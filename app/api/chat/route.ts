import { NextResponse } from "next/server"
import axios from "axios"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured")
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const { prompt, instruction } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: instruction }, { text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      return NextResponse.json(
        { error: error.response?.data?.error?.message || "Error calling Gemini API" },
        { status: error.response?.status || 500 },
      )
    }

    console.error("Unknown error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

