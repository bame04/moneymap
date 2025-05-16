import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface Message {
  role: string;
  parts: { text: string }[];
}

// Initialize the Gemini AI instance with Flash model
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    console.log('📨 Received API request');
    const body = await req.json();
    console.log('📦 Request body:', body);
    const { message, conversation } = body;

    // Get the Flash model instance
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",  
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });
    console.log('🤖 AI model initialized');

    if (!conversation) {
      console.log('🆕 Starting new conversation');
      try {
        const result = await model.generateContent({
          contents: [{
            role: "user",
            parts: [{ 
              text: `You are a financial advisor bot. Your role is to:
              1. Analyze user transactions and spending patterns
              2. Provide practical financial advice
              3. Help users understand their spending habits
              4. Suggest ways to improve financial health
              
              Please introduce yourself and ask how you can help.` 
            }]
          }]
        });
        console.log('💡 Generated initial message');
        
        const response = await result.response;
        const initialMessage = response.text();
        console.log('📝 Initial message:', initialMessage);

        return NextResponse.json({
          message: initialMessage,
          conversation: {
            messages: [{
              role: "model",
              parts: [{ text: initialMessage }]
            }],
            lastResponse: initialMessage
          }
        });
      } catch (error) {
        console.error("❌ Error generating initial message:", error);
        throw error;
      }
    }

    console.log('💭 Generating response for existing conversation');
    try {
      const result = await model.generateContent({
        contents: [
          ...conversation.messages,
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      });

      const response = await result.response;
      const text = response.text();
      console.log('📝 Generated response:', text);

      const updatedConversation = {
        messages: [
          ...conversation.messages,
          { role: "user", parts: [{ text: message }] },
          { role: "model", parts: [{ text }] }
        ],
        lastResponse: text
      };
      console.log('🔄 Updated conversation state');

      return NextResponse.json({
        message: text,
        conversation: updatedConversation
      });
    } catch (error) {
      console.error("❌ Error generating response:", error);
      throw error;
    }
  } catch (error) {
    console.error('🚨 API Error:', error);
    return NextResponse.json(
      { 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}