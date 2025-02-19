"use client"

import type React from "react"

import { Inter } from "next/font/google"
import Image from "next/image"
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion"
import { Brain, ChevronRight, Menu, X, MessageCircle, Send, DollarSign, CreditCard, Wallet } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Loader } from "@/components/loader"
import { CopyableAddress } from "@/components/CopyableAddress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const inter = Inter({ subsets: ["latin"] })

const marketCapTiers = [
  {
    cap: "100K",
    features: [
      "Access to major cryptocurrency charts",
      "Basic AI-powered market analysis",
      "Community access and discussions",
      "Daily market reports",
    ],
  },
  {
    cap: "500K",
    features: [
      "Unlock top 100 altcoin charts",
      "Advanced AI predictions for major cryptocurrencies",
      "Priority customer support",
      "Weekly strategy webinars",
    ],
  },
  {
    cap: "1M",
    features: [
      "Full access to all altcoin charts",
      "Real-time alerts for major market movements",
      "Custom indicators and analysis tools",
      "Monthly one-on-one strategy sessions",
    ],
  },
  {
    cap: "10M",
    features: [
      "Memecoin and newly launched token charts",
      "AI-powered memecoin trend predictions",
      "Automated trading bot for major cryptocurrencies",
      "Exclusive access to pre-sale tokens",
    ],
  },
  {
    cap: "100M",
    features: [
      "BNB analysis for all tracked tokens",
      "Custom bot development for personal trading strategies",
      "Real-time arbitrage opportunity alerts",
      "Strategic partnerships with major exchanges",
    ],
  },
  {
    cap: "500M",
    features: [
      "BNB AI-powered predictive modeling for all global markets",
      "Cross-chain DEX aggregator with AI-optimized routing",
      "Exclusive access to high-frequency trading algorithms",
      "VIP networking events with industry leaders and venture capitalists",
    ],
  },
]

const ultimateTier = {
  cap: "100B",
  features: ["MIGRATING TO ETHEREUM", "VR GAME", "Minecraft RPG server with NFTs and player-regulated market"],
}

function ScrollingText() {
  return (
    <div className="w-full overflow-hidden bg-black/30 border-y border-pink-500/20">
      <div className="py-2 whitespace-nowrap">
        <motion.div
          className="inline-block"
          animate={{
            x: [0, -1000],
            transition: {
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            },
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8 text-pink-500">
              <span>BNB BRAIN</span>
              <span>•</span>
              <span>PREDICT • BUY • SELL</span>
              <span>•</span>
              <span>AI-POWERED ANALYSIS</span>
              <span>•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() + 0.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

function MarketCapTier({ cap, features, index }: { cap: string; features: string[]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full"
    >
      <motion.div
        className="h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-pink-500/30 overflow-hidden shadow-lg"
        whileHover={{ scale: 1.03, borderColor: "rgba(236, 72, 153, 0.5)" }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <motion.div
          className="p-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.h3
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {cap} MarketCap
          </motion.h3>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-2 text-white/80"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <ChevronRight className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
          <motion.button
            className="mt-6 text-sm font-bold uppercase bg-pink-500/20 text-pink-500 px-4 py-2 rounded-full border border-pink-500/30 hover:bg-pink-500/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function MainFeatures({ features }: { features: string[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      className="col-span-full p-8 rounded-3xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-pink-500/40 hover:border-pink-500/60 transition-all"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <motion.h3
        className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
        initial={{ scale: 0.9 }}
        animate={{ scale: isInView ? 1 : 0.9 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Ultimate Goals
      </motion.h3>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isInView ? 1 : 0.8, opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 1 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              {index === 0 ? "🌐" : index === 1 ? "🎮" : "⛏️"}
            </motion.div>
            <motion.p
              className="text-2xl font-bold text-center"
              animate={{
                color: ["#fff", index === 0 ? "#f0f" : index === 1 ? "#0ff" : "#ff0", "#fff"],
                textShadow: [
                  "0 0 0px rgba(236, 72, 153, 0.7)",
                  `0 0 10px rgba(${index === 0 ? "236, 72, 153" : index === 1 ? "0, 255, 255" : "255, 255, 0"}, 0.7)`,
                  "0 0 0px rgba(236, 72, 153, 0.7)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              {feature}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function StaticBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-black" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
    </>
  )
}

function ScrollRevealSection({ children, className = "" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 p-6 backdrop-blur-sm bg-black/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-12 h-12 relative overflow-hidden rounded-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3dgifmaker13249.gif-XY9TqH00EmG8k1VCRXZmTWO3GZgh6m.mp4"
            />
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            BNB BRAIN
          </div>
        </motion.div>
        <motion.div
          className="hidden md:flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.a
            href="https://t.me/bnbbrain"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-telegram-app-IHtUBvQANcAcpwIhqNbahfAEgHZ0zD.gif"
              alt="Telegram"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </motion.a>
          <motion.a
            href="https://dexscreener.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dex-screener-logo-png_seeklogo-527276-FbEhUvJZYMPVzjX2sOp4mSPkwxfL2a.png"
              alt="DexScreener"
              width={24}
              height={24}
              className="w-6 h-6 invert"
            />
          </motion.a>
          <motion.a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-x%20(2)-vTO7qE3Yhmku80NUagYzuPWBYBC9Pu.svg"
              alt="X (Twitter)"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </motion.a>
          <motion.a
            href="https://t.me/bnbbrain_BNB"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-pink-500/20 rounded-full border border-pink-500/30 text-pink-500 hover:bg-pink-500/30 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-4 h-4" />
            Launch App
          </motion.a>
        </motion.div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4 bg-black/80 backdrop-blur-md rounded-lg p-4"
        >
          <div className="flex flex-col space-y-4">
            <a href="https://t.me/bnbbrain" target="_blank" rel="noopener noreferrer" className="text-white">
              Telegram
            </a>
            <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="text-white">
              DexScreener
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white">
              X (Twitter)
            </a>
            <a
              href="https://t.me/bnbbrain_BNB"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-pink-500/20 rounded-full border border-pink-500/30 text-pink-500 hover:bg-pink-500/30 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Launch App
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")
}

function HowToBuy() {
  const steps = [
    {
      title: "Create a Wallet",
      description: "Set up a cryptocurrency wallet that supports BNB Chain tokens.",
      icon: <Wallet className="w-12 h-12 text-pink-500" />,
    },
    {
      title: "Get BNB",
      description: "Purchase BNB from a major exchange or swap platform.",
      icon: <DollarSign className="w-12 h-12 text-pink-500" />,
    },
    {
      title: "Connect to DEX",
      description: "Connect your wallet to a BNB Chain-based decentralized exchange.",
      icon: <CreditCard className="w-12 h-12 text-pink-500" />,
    },
    {
      title: "Swap for BNBBRAIN",
      description: "Use the DEX to swap your BNB for BNBBRAIN tokens.",
      icon: <Brain className="w-12 h-12 text-pink-500" />,
    },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How To Buy BNBBRAIN
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-xl p-6 shadow-lg border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
            Get Your BNBBRAIN Now!
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim() === "") return

    const newMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, newMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: chatInput,
          instruction:
            "Analyze the given cryptocurrency pair. Provide a prediction if it will go up or down, and explain why. Use markdown-like syntax for formatting: **bold** for important points and *italic* for emphasis.",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      const aiResponse = {
        role: "assistant",
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request.",
      }

      setChatMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Chat error:", error)
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error processing your request." },
      ])
    }

    setChatInput("")
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className={`relative min-h-screen text-white ${inter.className}`}>
      <StaticBackground />
      <FloatingElements />
      <Header />

      <main className="relative z-10">
        <ScrollRevealSection className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.h1
                  className="text-5xl md:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent inline-block"
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    BNB
                  </motion.span>
                  <br />
                  <motion.span
                    className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent inline-block"
                    animate={{ rotate: [0, -5, 0, 5, 0] }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                  >
                    BRAIN
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-white/70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  The ultimate AI-powered platform for market analysis and trading automation. Get real-time
                  predictions, automated trading, and instant notifications through our Telegram bot.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Contract Address (CA)
                  </h3>
                  <CopyableAddress address="0x1234567890123456789012345678901234567890" />
                </motion.div>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.a
                    href="https://t.me/bnbbrain_BNB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Connect Bot
                  </motion.a>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/demo"
                      className="px-6 py-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <Brain className="w-5 h-5" />
                      Try Demo
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Image
                  src="https://sjc.microlink.io/JdfoH4a68TUwOT-JCMwl3DHUStE8oK-uZiRq8fzbgNiUs4Waixo5mKXYottyMd2EP671PCYayzmjHW9uz-TRrQ.jpeg"
                  alt="Platform Preview"
                  width={600}
                  height={400}
                  className="rounded-2xl border border-pink-500/20"
                />
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span className="text-pink-500">AI Analysis Active</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </ScrollRevealSection>

        <ScrollingText />

        <ScrollRevealSection className="py-20 px-4">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Market Cap Tiers and Features
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-white/70 text-center mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              As our project grows, we unlock more powerful features and expand our coverage. Start your journey with
              major cryptocurrencies and progress to the cutting edge of AI-powered trading and market analysis.
            </motion.p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {marketCapTiers.map((tier, index) => (
                <MarketCapTier key={tier.cap} cap={tier.cap} features={tier.features} index={index} />
              ))}
            </div>
            <div className="mt-16">
              <MainFeatures features={ultimateTier.features} />
            </div>
          </div>
        </ScrollRevealSection>

        <HowToBuy />
      </main>

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
    </div>
  )
}

