"use server"

export const submitChat = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        instruction:
          "Analyze the given cryptocurrency pair. Provide a prediction if it will go up or down, and explain why. Use markdown-like syntax for formatting: **bold** for important points and *italic* for emphasis.",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get response from /api/chat")
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request."
  } catch (error: any) {
    console.error("Error in submitChat:", error)
    return "Sorry, I encountered an error processing your request."
  }
}

