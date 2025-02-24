import { getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    // Call your locally running FastAPI backend instead of OpenAI
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: messages[messages.length - 1]?.content // Send the latest message
      })
    })

    if (!response.ok) {
      throw new Error(`FastAPI Error: ${response.statusText}`)
    }

    const data = await response.json()

    // Assuming FastAPI returns { "response": "Generated text" }
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(data.response)
        controller.close()
      }
    })

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error("Error calling FastAPI:", error)

    return new Response(
      JSON.stringify({ message: "Failed to connect to local AI model" }),
      { status: 500 }
    )
  }
}
