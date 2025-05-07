'use client'

import { useState, useRef, useEffect } from "react"
import { Bot, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createFinancialAdvice } from "@/lib/openai"
import { supabase } from "@/lib/supautil"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [statementData, setStatementData] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getStatementData = async () => {
      const { data } = await supabase
        .from('statements')
        .select('*')
        .single()
      
      if (data) {
        setStatementData(data)
        // Add initial message based on statement data
        setMessages([{
          role: 'assistant',
          content: "Hello! I've analyzed your bank statements and I'm ready to help you with personalized financial advice. What would you like to know?"
        }])
      } else {
        setMessages([{
          role: 'assistant',
          content: "Hello! I can help you with financial advice. Note that uploading your bank statements will allow me to provide more personalized recommendations."
        }])
      }
    }

    getStatementData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await createFinancialAdvice(userMessage, statementData)
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Sorry, I could not process your request.' }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card className="h-[80vh]">
        <CardHeader className="border-b bg-gray-50/80 px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Bot className="h-5 w-5 text-blue-500" />
            MoneyMap Advisor
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex h-[calc(100%-4rem)] flex-col p-0">
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } max-w-[80%]`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-gray-100 p-3">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
