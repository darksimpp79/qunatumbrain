"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function Loader() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="loader p-16 rounded-3xl bg-black border-2 border-pink-500/30 shadow-lg shadow-pink-500/20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(0,0,0,0) 70%)",
              "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(0,0,0,0) 70%)",
              "radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(0,0,0,0) 70%)",
            ],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="flex flex-col items-center space-y-8 relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Update the loader text */}
          {["BNB", "BRAIN"].map((word, wordIndex) => (
            <div key={wordIndex} className="flex justify-center items-center space-x-4">
              {word.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-6xl md:text-7xl lg:text-8xl font-bold text-pink-500"
                  style={{
                    textShadow: "0 0 15px rgba(236, 72, 153, 0.7)",
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: (wordIndex * word.length + index) * 0.1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.div>
        <motion.div
          className="mt-16 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="w-24 h-24 relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className="absolute inset-1 rounded-full bg-black flex items-center justify-center">
              <motion.div
                className="w-16 h-16 border-t-4 border-r-4 border-pink-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-500 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0,
              }}
              animate={{
                y: ["-10%", "110%"],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

{
  /* BNB BRAIN loader animation */
}

