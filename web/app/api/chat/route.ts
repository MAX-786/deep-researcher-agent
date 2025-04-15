import { openai } from "@ai-sdk/openai" // Using AI SDK OpenAI integration [^2]
import { streamText } from "ai" // Using AI SDK Core [^5]
import { NextRequest, NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Main chat endpoint
export async function POST(req: NextRequest) {
  // Check if we should use the backend server or direct LLM integration
  const useBackendServer = process.env.USE_BACKEND_SERVER === 'true';

  if (useBackendServer) {
    try {
      // Get the request data
      const data = await req.json();

      // Forward the request to our backend server
      const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Get the response data
      const responseData = await response.json();

      // Return the response
      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Error calling chat API:', error);
      return NextResponse.json(
        { error: 'Failed to process chat request' },
        { status: 500 }
      );
    }
  } else {
    // Use direct LLM integration (original implementation)
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"),
      system:
        "You are a Deep Researcher AI assistant, specialized in helping with complex research topics. You provide detailed, accurate, and well-structured responses.",
      messages,
    });

    return result.toDataStreamResponse();
  }
}
