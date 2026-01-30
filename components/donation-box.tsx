"use client"

import { Copy, Heart } from "lucide-react"
import { useState } from "react"

export function DonationBox() {
  const [copied, setCopied] = useState(false)
  const address = "0x4AF8E256fE8F96bC05FA0d94920Ff6477C300398"

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/50 hover:border-rose-300 transition-all duration-300">
      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-slate-700">Support Us</p>
        <button
          onClick={handleCopy}
          className="text-xs text-rose-600 hover:text-rose-700 transition-colors duration-200 font-mono truncate max-w-[120px]"
          title={address}
        >
          {address.slice(0, 10)}...{address.slice(-8)}
        </button>
      </div>
      <button
        onClick={handleCopy}
        className="ml-1 p-1 hover:bg-rose-100 rounded transition-colors duration-200"
        title="Copy address"
      >
        {copied ? (
          <span className="text-xs text-green-600 font-semibold">✓</span>
        ) : (
          <Copy className="w-3.5 h-3.5 text-rose-500" />
        )}
      </button>
    </div>
  )
}
