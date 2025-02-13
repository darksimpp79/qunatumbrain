"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check } from "lucide-react"

interface CopyableAddressProps {
  address: string
}

export function CopyableAddress({ address }: CopyableAddressProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="flex items-center space-x-2 bg-black/30 rounded-lg p-2 backdrop-blur-sm">
      <code className="text-pink-500 font-mono text-sm">{address}</code>
      <motion.button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-pink-500" />}
      </motion.button>
    </div>
  )
}

