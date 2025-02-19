"use client"

import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#2e2a5d] to-[#3b3176] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-500" />
              <h3 className="text-xl font-bold text-white">BNB BRAIN</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              The most magical AI token in the cryptoverse! Join our community and experience the power of BNB-powered
              intelligence! ✨ ✨
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                  Utility Page
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                  Buy BNBBRAIN
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Community</h4>
            <div className="flex gap-4">
              <Link href="https://t.me/brain_bnb" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-telegram-app-IHtUBvQANcAcpwIhqNbahfAEgHZ0zD.gif"
                  alt="Telegram"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </Link>
              <Link href="https://x.com/brain_bnb" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-x%20(2)-vTO7qE3Yhmku80NUagYzuPWBYBC9Pu.svg"
                  alt="X (Twitter)"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} BNB BRAIN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

