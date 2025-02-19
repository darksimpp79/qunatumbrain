"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Manrope } from "next/font/google"
import Link from "next/link"
import Image from "next/image"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const manrope = Manrope({ subsets: ["latin"] })

function Chart() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Quantum Processing Power",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(124, 58, 237)",
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
      title: {
        display: true,
        text: "Quantum Processing Performance",
        color: "rgba(255, 255, 255, 0.9)",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
  }

  return <Line data={data} options={options} />
}

export default function ChartPage() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white ${manrope.className}`}
    >
      <header className="bg-black bg-opacity-50 backdrop-blur-sm shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QvJ0xolroQjDULZi7gtyW4vnKdn5bK.png"
                  alt="QUANTUMBRAIN Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-green-500 text-transparent bg-clip-text">
                BNBBRAIN
              </span>
            </Link>
            <Link href="/" className="text-white hover:text-purple-400 transition-colors">
              Back to Home
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-purple-500 to-green-500 text-transparent bg-clip-text">
          Performance Analytics
        </h1>
        <div className="bg-black bg-opacity-30 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <Chart />
        </div>
      </main>
    </div>
  )
}

