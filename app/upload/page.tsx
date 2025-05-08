'use client'

declare global {
  interface Window {
    errorReporting?: {
      captureException(error: unknown): void;
    };
  }
}

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supautil"
import { toast } from "sonner"
import * as pdfjsLib from 'pdfjs-dist'

const logDebug = (message: string, data?: any) => {
  console.log(`[Upload] ${message}`, data || '')
}

const logError = (message: string, error: any) => {
  if (error && typeof error === 'object' && Object.keys(error).length === 0) {
    console.error(`[Upload Error] ${message}: Empty error object.`)
    return
  }
  
  const formattedError = error instanceof Error 
    ? { 
        name: error.name,
        message: error.message,
        stack: error.stack
      } 
    : error
    
  console.error(`[Upload Error] ${message}:`, formattedError)
}

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [pdfJsReady, setPdfJsReady] = useState(false)

  useEffect(() => {
    const initPdfJs = async () => {
      try {
        logDebug('Initializing PDF.js')
        const workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
        logDebug('PDF.js initialized with worker:', workerSrc)
        setPdfJsReady(true)
      } catch (error) {
        logError('PDF.js initialization failed', error)
        toast.error('PDF processor initialization failed. Please reload the page.')
      }
    }
    
    initPdfJs()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      logDebug('Starting upload process')
      const file = e.target.files?.[0]
      if (!file) {
        logDebug('No file selected')
        return
      }

      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }

      const MAX_SIZE = 10 * 1024 * 1024
      if (file.size > MAX_SIZE) {
        toast.error('File size must be less than 10MB')
        return
      }
      
      if (file.size === 0) {
        toast.error('File appears to be empty')
        return
      }

      if (!pdfJsReady) {
        logDebug('PDF.js not initialized yet, waiting...')
        toast.error('PDF processor is initializing. Please try again in a moment.')
        return
      }

      setUploading(true)
      setProgress(10)

      let userId: string
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          logError('Authentication error', authError)
          throw new Error(`Authentication failed: ${authError.message || 'Unable to verify your login session'}`)
        }

        if (!session?.user) {
          logDebug('No active session')
          toast.error('Please login first')
          router.push('/login')
          return
        }
        
        userId = session.user.id
        logDebug('User authenticated', { userId })
      } catch (authCheckError: any) {
        logError('Authentication check failed', authCheckError)
        throw new Error(`Authentication check failed: ${authCheckError.message || 'Network or service error'}`)
      }

      const buffer = await file.arrayBuffer()
      setProgress(30)
      logDebug('File read complete', { bufferSize: buffer.byteLength })

      logDebug('Loading PDF document')
      let pdf
      try {
        const pdfLoadingPromise = pdfjsLib.getDocument(new Uint8Array(buffer)).promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('PDF loading timed out after 30 seconds')), 30000)
        })
        
        pdf = await Promise.race([pdfLoadingPromise, timeoutPromise]) as any
        
        if (!pdf || pdf.numPages <= 0) {
          throw new Error('PDF appears to be empty or invalid')
        }
        
        logDebug('PDF loaded successfully', { pageCount: pdf.numPages })
      } catch (pdfError: any) {
        logError('PDF loading failed', pdfError)
        
        if (pdfError.message?.includes('Password')) {
          throw new Error('Cannot process password-protected PDF files. Please remove the password and try again.')
        } else if (pdfError.message?.includes('timed out')) {
          throw new Error('PDF processing took too long. The file may be too large or complex.')
        } else if (pdfError.message?.includes('Failed to fetch')) {
          throw new Error('Network error while processing PDF. Please check your connection and try again.')
        } else {
          throw new Error('Could not process PDF file. The file may be corrupted or in an unsupported format.')
        }
      }

      setProgress(50)

      let text = ''
      try {
        for (let i = 1; i <= pdf.numPages; i++) {
          logDebug(`Processing page ${i}/${pdf.numPages}`)
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map((item: any) => item.str).join(' ')
          
          const pageProgress = 50 + Math.floor((i / pdf.numPages) * 20)
          setProgress(pageProgress)
        }
      } catch (extractError) {
        logError('Text extraction failed', extractError)
        throw new Error('Failed to extract text from PDF')
      }

      logDebug('Text extraction complete', { textLength: text.length })
      setProgress(70)

      const matches = {
        accountHolder: text.match(/MR (.+)/)?.[1] || '',
        openingBalance: parseFloat(text.match(/Opening Balance (\d+\.\d+)/)?.[1] || '0'),
        closingBalance: parseFloat(text.match(/Closing Balance (\d+\.\d+)/)?.[1] || '0'),
      }
      logDebug('Parsed data:', matches)

      logDebug('Uploading to Supabase')
      
      try {
        const { error: uploadError } = await supabase
          .from('statements')
          .insert({
            user_id: userId,
            account_holder: matches.accountHolder,
            content: text,
            opening_balance: matches.openingBalance,
            closing_balance: matches.closingBalance,
            filename: file.name,
            uploaded_at: new Date().toISOString()
          })

        if (uploadError) {
          logError('Database upload error', {
            message: uploadError.message || 'No error message',
            details: uploadError.details || 'No details',
            hint: uploadError.hint || 'No hint',
            code: uploadError.code || 'No code'
          })
          throw new Error(`Database error: ${uploadError.message || 'Unknown database error'}`)
        }
      } catch (dbError: any) {
        logError('Unexpected database error', {
          name: dbError.name,
          message: dbError.message,
          stack: dbError.stack
        })
        throw new Error(`Database error: ${dbError.message || 'Unexpected error during database operation'}`)
      }

      setProgress(100)
      logDebug('Upload complete')
      toast.success('Statement uploaded successfully')
      router.refresh()
      router.push('/dashboard')

    } catch (error: any) {
      logError('Upload failed', {
        name: error.name || 'Unknown error type',
        message: error.message || 'No error message',
        code: error.code,
        details: error.details,
        stack: error.stack
      })
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code) {
        const errorMessages: {[key: string]: string} = {
          'PDFJS_PARSE_ERROR': 'Could not parse the PDF file',
          'PERMISSION_DENIED': 'You do not have permission to upload',
          '23505': 'A statement with this name already exists',
          'auth/not-authenticated': 'You need to log in first'
        };
        errorMessage = errorMessages[error.code] || `Error code: ${error.code}`;
      }
      
      toast.error(`Upload failed: ${errorMessage}`);
      
      if (window.errorReporting) {
        window.errorReporting.captureException(error);
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setTimeout(() => setProgress(0), 500)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Bank Statement</CardTitle>
          <CardDescription>
            Upload your FNB bank statement in PDF format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !pdfJsReady}
              className="w-full"
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              {uploading ? `Processing (${progress}%)` : 'Select PDF Statement'}
            </Button>
            {uploading && (
              <Progress value={progress} className="h-2" />
            )}
            {!pdfJsReady && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>PDF processor is initializing</AlertTitle>
                <AlertDescription>
                  Please wait a moment before uploading your document.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UploadPage