'use client'

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, FileText, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supautil"
import { toast } from "sonner"

// Debug logging utility
const logDebug = (message: string, data?: any) => {
  console.log(`[Upload] ${message}`, data || '')
}

const logError = (message: string, error: any) => {
  console.error(`[Upload Error] ${message}:`, error)
}

// Initialize PDF.js outside the component
let pdfjsLib: typeof import('pdfjs-dist')

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const initPdfJs = async () => {
      try {
        logDebug('Initializing PDF.js')
        // Import PDF.js dynamically
        const pdfjs = await import('pdfjs-dist')
        pdfjsLib = pdfjs

        // Set worker source to the public URL
        const workerUrl = '/pdf.worker.min.js'
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
        
        logDebug('PDF.js initialized with worker:', workerUrl)
      } catch (error) {
        logError('PDF.js initialization failed', error)
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

      if (!pdfjsLib) {
        throw new Error('PDF.js not initialized')
      }

      setUploading(true)
      setProgress(10)

      // Check authentication
      logDebug('Checking authentication')
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        logError('Authentication error', authError)
        throw authError
      }

      if (!session?.user) {
        logDebug('No active session')
        toast.error('Please login first')
        router.push('/login')
        return
      }

      logDebug('User authenticated', { userId: session.user.id })

      // Read file as ArrayBuffer
      logDebug('Reading file', { name: file.name, size: file.size })
      const buffer = await file.arrayBuffer()
      
      setProgress(30)
      logDebug('File read complete', { bufferSize: buffer.byteLength })

      // Load PDF document
      logDebug('Loading PDF document')
      const pdf = await pdfjsLib.getDocument(new Uint8Array(buffer)).promise
      logDebug('PDF loaded', { pageCount: pdf.numPages })

      setProgress(50)

      // Extract text from all pages
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        logDebug(`Processing page ${i}/${pdf.numPages}`)
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((item: any) => item.str).join(' ')
      }

      logDebug('Text extraction complete', { textLength: text.length })
      setProgress(70)

      // Parse statement data
      logDebug('Parsing statement data')
      const matches = {
        accountHolder: text.match(/MR (.+)/)?.[1] || '',
        openingBalance: parseFloat(text.match(/Opening Balance (\d+\.\d+)/)?.[1] || '0'),
        closingBalance: parseFloat(text.match(/Closing Balance (\d+\.\d+)/)?.[1] || '0'),
      }
      logDebug('Parsed data:', matches)

      // Upload to Supabase
      logDebug('Uploading to Supabase')
      const { error: uploadError } = await supabase
        .from('statements')
        .insert({
          user_id: session.user.id,
          account_holder: matches.accountHolder,
          content: text,
          opening_balance: matches.openingBalance,
          closing_balance: matches.closingBalance,
          filename: file.name,
          uploaded_at: new Date().toISOString()
        })

      if (uploadError) {
        logError('Database upload error', uploadError)
        throw uploadError
      }

      setProgress(100)
      logDebug('Upload complete')
      toast.success('Statement uploaded successfully')
      router.refresh() // Force refresh data
      router.push('/dashboard')

    } catch (error: any) {
      logError('Upload failed', error)
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(false)
      setProgress(0)
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
              accept=".pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Select PDF Statement'}
            </Button>
            {uploading && (
              <Progress value={progress} className="h-2" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
