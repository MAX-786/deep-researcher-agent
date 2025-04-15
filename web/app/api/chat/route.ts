import { openai } from "@ai-sdk/openai" // Using AI SDK OpenAI integration [^2]
import { streamText } from "ai" // Using AI SDK Core [^5]

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are a Deep Researcher AI assistant, specialized in helping with complex research topics. You provide detailed, accurate, and well-structured responses.",
    messages,
  })

  return result.toDataStreamResponse()
}
