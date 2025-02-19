"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  ChevronDown,
  LineChart,
  Moon,
  Settings,
  Sun,
  Volume2,
  Bell,
  Zap,
  Eye,
  BarChart3,
  CandlestickChart,
  Gauge,
  ArrowUpDown,
  MessageCircle,
  X,
  Send,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const inter = Inter({ subsets: ["latin"] })

declare global {
  interface Window {
    TradingView: any
  }
}

interface MarketData {
  price: string
  change24h: string
  volume24h: string
  high24h: string
  low24h: string
  volatility: string
}

const TIMEFRAMES = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "30", label: "30m" },
  { value: "60", label: "1h" },
  { value: "240", label: "4h" },
  { value: "D", label: "1d" },
  { value: "W", label: "1w" },
]

const INDICATORS = [
  { value: "EMMA", label: "EMMA (30)" },
  { value: "RSI", label: "RSI" },
  { value: "MACD", label: "MACD" },
  { value: "BB", label: "Bollinger Bands" },
  { value: "EMA", label: "EMA (200)" },
  { value: "SMA", label: "SMA (200)" },
  { value: "VWAP", label: "VWAP" },
]

const LAYOUTS = [
  { value: "single", label: "Single Chart" },
  { value: "dual", label: "Dual Chart" },
  { value: "quad", label: "Quad Chart" },
]

function StaticBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-black" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
    </>
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

function MarketDataCard({
  title,
  value,
  icon: Icon,
  change,
}: {
  title: string
  value: string
  icon: React.ElementType
  change?: string
}) {
  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-pink-500/20"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/60">
          <Icon className="w-4 h-4" />
          <span className="text-sm">{title}</span>
        </div>
        {change && (
          <span className={`text-sm ${Number(change) >= 0 ? "text-green-500" : "text-red-500"}`}>
            {Number(change) >= 0 ? (
              <TrendingUp className="w-4 h-4 inline" />
            ) : (
              <TrendingDown className="w-4 h-4 inline" />
            )}
            {change}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold mt-2">{value}</p>
    </motion.div>
  )
}

const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")
}

function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["EMMA"])
  const [timeframe, setTimeframe] = useState("60")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick")
  const [layout, setLayout] = useState("single")
  const chartRef = useRef<any>(null)
  const [isChartReady, setIsChartReady] = useState(false)
  const [currentSymbol, setCurrentSymbol] = useState("BTCUSDT")
  const [marketData, setMarketData] = useState<MarketData>({
    price: "Loading...",
    change24h: "0",
    volume24h: "Loading...",
    high24h: "Loading...",
    low24h: "Loading...",
    volatility: "Loading...",
  })
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBinanceData = useCallback(async (symbol: string) => {
    try {
      setError(null)
      const [tickerResponse, dayStatsResponse] = await Promise.all([
        axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`),
        axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`),
      ])

      const tickerData = tickerResponse.data
      const dayStatsData = dayStatsResponse.data

      const price = Number.parseFloat(tickerData.lastPrice).toFixed(2)
      const change24h = Number.parseFloat(tickerData.priceChangePercent).toFixed(2)
      const volume24h = `$${((Number.parseFloat(tickerData.volume) * Number.parseFloat(tickerData.lastPrice)) / 1e6).toFixed(2)}M`
      const high24h = Number.parseFloat(dayStatsData.highPrice).toFixed(2)
      const low24h = Number.parseFloat(dayStatsData.lowPrice).toFixed(2)
      const volatility = (
        ((Number.parseFloat(high24h) - Number.parseFloat(low24h)) / Number.parseFloat(low24h)) *
        100
      ).toFixed(2)

      setMarketData({
        price: `$${price}`,
        change24h: change24h,
        volume24h: volume24h,
        high24h: `$${high24h}`,
        low24h: `$${low24h}`,
        volatility: `${volatility}%`,
      })
    } catch (error) {
      console.error("Error fetching Binance data:", error)
      setError("Failed to fetch market data. Please try again later.")
      setMarketData({
        price: "Error",
        change24h: "0",
        volume24h: "Error",
        high24h: "Error",
        low24h: "Error",
        volatility: "Error",
      })
    }
  }, [])

  const updateCurrentSymbol = useCallback(() => {
    if (chartRef.current && chartRef.current.activeChart) {
      const widget = chartRef.current
      const symbolInfo = widget.symbolInterval()
      if (symbolInfo) {
        const newSymbol = symbolInfo.symbol.replace("BINANCE:", "")
        setCurrentSymbol(newSymbol)
        fetchBinanceData(newSymbol)
      }
    }
  }, [fetchBinanceData])

  useEffect(() => {
    // Fetch initial data
    fetchBinanceData(currentSymbol)

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchBinanceData(currentSymbol)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(intervalId)
  }, [currentSymbol, fetchBinanceData])

  useEffect(() => {
    if (containerRef.current) {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        if (typeof window.TradingView !== "undefined") {
          const widgetOptions: any = {
            width: "100%",
            height: layout === "single" ? 800 : 400,
            symbol: "BINANCE:BTCUSDT",
            interval: timeframe,
            timezone: "Etc/UTC",
            theme: isDarkMode ? "dark" : "light",
            style: chartType === "candlestick" ? "1" : "2",
            locale: "en",
            toolbar_bg: isDarkMode ? "#1a1a1a" : "#f1f5f9",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: "tradingview_chart",
            studies: activeIndicators.map((ind) => `STD;${ind}`),
            overrides: {
              "mainSeriesProperties.candleStyle.upColor": "#22c55e",
              "mainSeriesProperties.candleStyle.downColor": "#ef4444",
              "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
              "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
              "paneProperties.background": "#000000",
              "paneProperties.vertGridProperties.color": isDarkMode ? "#2a2a2a" : "#e2e8f0",
              "paneProperties.horzGridProperties.color": isDarkMode ? "#2a2a2a" : "#e2e8f0",
              "scalesProperties.textColor": isDarkMode ? "#ffffff" : "#1a1a1a",
            },
            loading_screen: {
              backgroundColor: "#000000",
              foregroundColor: "#ec4899",
            },
            onChartReady: () => {
              chartRef.current = (window as any).tvWidget
              setIsChartReady(true)
              updateCurrentSymbol()
            },
          }

          new window.TradingView.widget(widgetOptions)
        }
      }
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [isDarkMode, timeframe, chartType, layout, activeIndicators, updateCurrentSymbol])

  useEffect(() => {
    if (isChartReady) {
      const interval = setInterval(updateCurrentSymbol, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isChartReady, updateCurrentSymbol])

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators((prev) =>
      prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator],
    )
  }

  const predictNextCandle = useCallback(() => {
    const widget = chartRef.current
    const chart = widget.activeChart()
    const series = chart.getSeries()
    const data = series.data()
    const lastIndex = data.length() - 1
    const lastCandle = data.valueAt(lastIndex)
    const prevCandle = data.valueAt(lastIndex - 1)

    if (lastCandle && prevCandle) {
      const prediction = lastCandle.close > prevCandle.close ? "up" : "down"
      const color = prediction === "up" ? "#22c55e" : "#ef4444"
      const shape = chart.createShape(
        { time: lastCandle.time, price: lastCandle.high + lastCandle.high * 0.001 },
        {
          shape: "arrow_down",
          text: prediction === "up" ? "▲" : "▼",
          textColor: "white",
          fontSize: 20,
          backgroundColor: color,
          backgroundOpacity: 95,
        },
      )

      setTimeout(() => {
        chart.removeEntity(shape)
      }, 5000)
    }
  }, [])

  const runStrategy = useCallback(() => {
    if (chartRef.current && chartRef.current.symbolInterval) {
      const widget = chartRef.current
      const chart = widget.activeChart()
      const series = chart.getSeries()
      const data = series.data()
      const lastIndex = data.length() - 1

      // Simple Moving Average (SMA) strategy
      const smaLength = 20
      let sum = 0
      for (let i = lastIndex; i > lastIndex - smaLength; i--) {
        sum += data.valueAt(i).close
      }
      const sma = sum / smaLength

      const lastClose = data.valueAt(lastIndex).close
      const prediction = lastClose > sma ? "up" : "down"
      const color = prediction === "up" ? "#22c55e" : "#ef4444"

      chart.createShape(
        { time: data.valueAt(lastIndex).time, price: lastClose },
        {
          shape: "arrow_up",
          text: `SMA: ${prediction.toUpperCase()}`,
          textColor: "white",
          fontSize: 14,
          backgroundColor: color,
          backgroundOpacity: 95,
        },
      )
    }
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

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MarketDataCard title="Price" value={marketData.price} icon={LineChart} change={marketData.change24h} />
        <MarketDataCard title="Volume 24h" value={marketData.volume24h} icon={Volume2} />
        <MarketDataCard title="24h High" value={marketData.high24h} icon={ArrowUpDown} />
        <MarketDataCard title="24h Low" value={marketData.low24h} icon={ArrowUpDown} />
        <MarketDataCard title="Volatility" value={marketData.volatility} icon={Gauge} />
      </div>

      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-pink-500/20 p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[100px] bg-white text-gray-800">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <Settings className="w-4 h-4" />
                Indicators
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Technical Indicators</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {INDICATORS.map((indicator) => (
                <DropdownMenuItem key={indicator.value} onClick={() => toggleIndicator(indicator.value)}>
                  <div className="flex items-center gap-2">
                    <Switch checked={activeIndicators.includes(indicator.value)} />
                    {indicator.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={layout} onValueChange={setLayout}>
            <SelectTrigger className="w-[140px] bg-white text-gray-800">
              <SelectValue placeholder="Chart Layout" />
            </SelectTrigger>
            <SelectContent>
              {LAYOUTS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setChartType((prev) => (prev === "candlestick" ? "line" : "candlestick"))}
                  className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                >
                  {chartType === "candlestick" ? (
                    <CandlestickChart className="w-4 h-4" />
                  ) : (
                    <LineChart className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Chart Type</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDarkMode((prev) => !prev)}
                  className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="secondary" className="gap-2">
            <Bell className="w-4 h-4" />
            Set Alert
          </Button>

          <Button variant="secondary" className="gap-2">
            <Eye className="w-4 h-4" />
            Watch List
          </Button>

          <Button variant="secondary" className="gap-2 ml-auto" onClick={predictNextCandle}>
            <Zap className="w-4 h-4" />
            AI Analysis
          </Button>
          <Button variant="secondary" className="gap-2" onClick={runStrategy}>
            <BarChart3 className="w-4 h-4" />
            Run Strategy
          </Button>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: layout === "quad" ? "1fr 1fr" : "1fr" }}>
          <motion.div
            ref={containerRef}
            id="tradingview_chart"
            className="rounded-lg overflow-hidden h-[800px] relative"
            layout
          />
          {layout !== "single" && (
            <motion.div className="rounded-lg overflow-hidden bg-black/20" layout>
              <div className="h-full flex items-center justify-center text-white/60">
                <p>Additional Chart View</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

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
                <h3 className="text-xl font-bold text-gray-100">BNB AI</h3>
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
                        <strong>{message.role === "user" ? "You: " : "BNBAI: "}</strong>
                        <span dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                      </span>
                    </div>
                  ))}
                </ScrollArea>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter a crypto pair (e.g., BTC/USDT) for analysis..."
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

export default function DemoPage() {
  return (
    <div className={`relative min-h-screen text-white ${inter.className}`}>
      <StaticBackground />
      <FloatingElements />

      <header className="fixed top-0 left-0 right-0 z-50 p-6 backdrop-blur-sm bg-black/20">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
          >
            BNB BRAIN
          </Link>
          <Link
            href="/"
            className="px-6 py-2 bg-pink-500/20 rounded-full border border-pink-500/30 text-pink-500 hover:bg-pink-500/30 transition-colors"
          >
            Back to Home
          </Link>
        </nav>
      </header>

      <main className="pt-24 px-4 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            BNB Brain Trading Dashboard
          </motion.h1>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TradingViewChart />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

