"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { submitChat } from "../actions/chat"

const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")
}

export function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim() === "") return

    const newMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, newMessage])

    const response = await submitChat(chatInput)

    setChatMessages((prev) => [...prev, { role: "assistant", content: response }])

    setChatInput("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.3 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-96 bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700"
          >
            <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700">
              <h3 className="text-xl font-bold text-gray-100">BNB BRAIN AI</h3>
            </div>
            <div className="p-4 bg-gray-800">
              <ScrollArea className="h-64 mb-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-gray-700 text-gray-100"
                          : "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      }`}
                    >
                      <strong>{message.role === "user" ? "You: " : "BNB BRAIN AI: "}</strong>
                      <span dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                    </span>
                  </div>
                ))}
              </ScrollArea>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter a crypto pair (e.g., BNB/USDT) for analysis..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow text-gray-200 placeholder-gray-400 bg-gray-700 border-gray-600"
                />
                <Button type="submit" className="bg-pink-500 text-white hover:bg-pink-600">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        className="w-16 h-16 rounded-full bg-gray-800 text-pink-500 shadow-lg hover:bg-gray-700 hover:text-pink-400"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </Button>
    </div>
  )
}

