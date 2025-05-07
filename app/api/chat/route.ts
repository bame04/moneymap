import OpenAI from 'openai'
import { NextResponse } from 'next/server'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
})

export async function POST(request: Request) {
  try {
    const { message, statementData } = await request.json()
    
    const context = statementData 
      ? `Based on the user's bank statement: ${JSON.stringify(statementData)}\n`
      : ''

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are MoneyMap, a professional financial advisor."
        },
        {
          role: "user",
          content: `${context}${message}`
        }
      ]
    })

    return NextResponse.json({
      content: response.choices[0].message.content
    })
  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate advice' },
      { status: 500 }
    )
  }
}