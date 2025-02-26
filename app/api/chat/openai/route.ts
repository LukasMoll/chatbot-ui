import { NextRequest } from "next/server"
import { StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"

export const runtime: ServerRuntime = "edge"

export async function POST(request: NextRequest) {
  // If you're sending JSON from the client, parse it:
  const { chatSettings, messages } = await request.json()

  try {
    // Send the user's latest message to your local FastAPI
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: messages[messages.length - 1]?.content
      })
    })

    if (!response.ok) {
      throw new Error(`FastAPI Error: ${response.statusText}`)
    }

    // Here we simply return a streaming response.
    // The `StreamingTextResponse` helper from `ai` takes
    // a ReadableStream and streams it to the client.
    return new StreamingTextResponse(<ReadableStream<any>>response.body)
  } catch (error: any) {
    console.error("Error calling FastAPI:", error)
    return new Response(
      JSON.stringify({ message: "Failed to connect to local AI model" }),
      { status: 500 }
    )
  }
}
