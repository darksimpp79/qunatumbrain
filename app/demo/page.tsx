"use client"

import { useEffect, useRef, useState } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronDown,
  LineChart,
  MessageCircle,
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
  marketCap: string
  high24h: string
  low24h: string
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
}: { title: string; value: string; icon: any; change?: string }) {
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
          <span className={`text-sm ${Number(change) >= 0 ? "text-green-500" : "text-red-500"}`}>{change}%</span>
        )}
      </div>
      <p className="text-xl font-bold mt-2">{value}</p>
    </motion.div>
  )
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
  const [marketData, setMarketData] = useState<MarketData>({
    price: "Loading...",
    change24h: "0",
    volume24h: "Loading...",
    marketCap: "Loading...",
    high24h: "Loading...",
    low24h: "Loading...",
  })

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
      )
      const data = await response.json()

      setMarketData({
        price: `$${data.market_data.current_price.usd.toFixed(2)}`,
        change24h: data.market_data.price_change_percentage_24h.toFixed(2),
        volume24h: `$${(data.market_data.total_volume.usd / 1e6).toFixed(2)}M`,
        marketCap: `$${(data.market_data.market_cap.usd / 1e9).toFixed(2)}B`,
        high24h: `$${data.market_data.high_24h.usd.toFixed(2)}`,
        low24h: `$${data.market_data.low_24h.usd.toFixed(2)}`,
      })
    } catch (error) {
      console.error("Error fetching market data:", error)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        if (typeof window.TradingView !== "undefined") {
          const widgetOptions = {
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
  }, [isDarkMode, timeframe, chartType, layout, activeIndicators])

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators((prev) =>
      prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator],
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MarketDataCard title="Price" value={marketData.price} icon={LineChart} change={marketData.change24h} />
        <MarketDataCard title="Volume 24h" value={marketData.volume24h} icon={Volume2} />
        <MarketDataCard title="Market Cap" value={marketData.marketCap} icon={BarChart3} />
        <MarketDataCard title="24h High" value={marketData.high24h} icon={ArrowUpDown} />
        <MarketDataCard title="24h Low" value={marketData.low24h} icon={ArrowUpDown} />
        <MarketDataCard title="Volatility" value="High" icon={Gauge} />
      </div>

      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-pink-500/20 p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[100px] bg-gray-800 text-white">
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
            <SelectTrigger className="w-[140px] bg-gray-800 text-white">
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
                  variant="secondary"
                  size="icon"
                  onClick={() => setChartType((prev) => (prev === "candlestick" ? "line" : "candlestick"))}
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
                <Button variant="secondary" size="icon" onClick={() => setIsDarkMode((prev) => !prev)}>
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

          <Button variant="secondary" className="gap-2 ml-auto">
            <Zap className="w-4 h-4" />
            AI Analysis
          </Button>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: layout === "quad" ? "1fr 1fr" : "1fr" }}>
          <motion.div
            ref={containerRef}
            id="tradingview_chart"
            className="rounded-lg overflow-hidden h-[800px]"
            layout
          />
          {layout !== "single" && (
            <motion.div className="rounded-lg overflow-hidden bg-black/20" layout>
              {/* Additional charts would be added here based on layout */}
              <div className="h-full flex items-center justify-center text-white/60">
                <p>Additional Chart View</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        <motion.a
          href="https://t.me/quantumbrain_SOL"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-5 h-5" />
          Connect with AI Bot
        </motion.a>
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
            QUANTUM BRAIN
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
            Quantum Brain Trading Dashboard
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

