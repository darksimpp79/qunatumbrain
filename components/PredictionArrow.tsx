"use client"

import type React from "react"
import { motion } from "framer-motion"

interface PredictionArrowProps {
  direction: "up" | "down"
  position: { x: number; y: number }
}

export const PredictionArrow: React.FC<PredictionArrowProps> = ({ direction, position }) => {
  const arrowColor = direction === "up" ? "#22c55e" : "#ef4444"
  const rotation = direction === "up" ? 0 : 180

  return (
    <motion.svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <path d="M15 0L30 30H0L15 0Z" fill={arrowColor} />
    </motion.svg>
  )
}

