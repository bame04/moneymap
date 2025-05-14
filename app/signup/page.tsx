'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CreditCard, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    // Reset states
    setLoading(true)
    setError('')
    setDebugInfo('')
    setSuccess(false)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Extract specific error information
        const errorMessage = data.error || 'Failed to create account'
        const statusCode = response.status
        
        // Set more descriptive error based on status code
        let userFriendlyError = errorMessage
        if (statusCode === 409) {
          userFriendlyError = 'Email already in use. Please try a different email.'
        } else if (statusCode === 400) {
          userFriendlyError = 'Invalid input. Please check your email and password.'
        } else if (statusCode >= 500) {
          userFriendlyError = 'Server error. Please try again later.'
        }
        
        setError(userFriendlyError)
        setDebugInfo(`Status: ${statusCode}, Error: ${JSON.stringify(data)}`)
        toast.error(userFriendlyError)
        throw new Error(errorMessage)
      }

      // Success path
      setSuccess(true)
      toast.success('Account created! Please check your email for verification.')
      
      // Redirect after a short delay to allow user to see success message
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      console.error('Signup error:', error)
      // If we haven't already set an error message
      if (!error) {
        setError('Unable to connect to the server. Please check your internet connection.')
        toast.error('Connection error. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="rounded-full bg-blue-500 p-1">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">MoneyMap</span>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your email and create a password to get started</CardDescription>
        </CardHeader>
        
        {/* Success Alert */}
        {success && (
          <div className="px-6 pb-4">
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Account created successfully. Redirecting to login...
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Error Alert */}
        {error && (
          <div className="px-6 pb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            {/* Developer Debug Info - Collapsed by default */}
            {debugInfo && (
              <details className="mt-2 text-xs text-gray-500">
                <summary className="cursor-pointer font-medium">Debug Info</summary>
                <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2">{debugInfo}</pre>
              </details>
            )}
          </div>
        )}
        
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
                className={error && error.includes('email') ? 'border-red-500' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                className={error && error.includes('password') ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Account Created
                </>
              ) : (
                'Sign up'
              )}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-500 hover:text-blue-600">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}