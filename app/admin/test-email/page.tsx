"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'

export default function TestEmailPage() {
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    messageId?: string
  } | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email')
      const data = await response.json()
      
      setResult({
        success: data.success,
        message: data.message || data.error
      })
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to test email connection'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) {
      setResult({
        success: false,
        message: 'Please enter a test email address'
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      })
      
      const data = await response.json()
      
      setResult({
        success: data.success,
        message: data.message || data.error,
        messageId: data.messageId
      })
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send test email'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Email Testing</h1>
        
        <div className="space-y-6">
          {/* Connection Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Test Email Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Test if the email server connection is working properly.
              </p>
              <Button 
                onClick={testConnection}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Send Test Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Test Order Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Send a test order confirmation email to verify the email template and delivery.
              </p>
              
              <div>
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={sendTestEmail}
                disabled={isLoading || !testEmail}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Test Email'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  Test Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${
                  result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </p>
                  {result.messageId && (
                    <p className="text-sm text-green-600 mt-2">
                      Message ID: {result.messageId}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">
                To use email functionality, make sure you have the following environment variables set in your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                <div>SMTP_HOST=smtp.gmail.com</div>
                <div>SMTP_PORT=587</div>
                <div>SMTP_USER=your-email@gmail.com</div>
                <div>SMTP_PASSWORD="your-app-password"</div>
                <div>SMTP_TLS=true</div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> For Gmail, you need to use an App Password, not your regular password. 
                Enable 2-factor authentication and generate an App Password in your Google Account settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
