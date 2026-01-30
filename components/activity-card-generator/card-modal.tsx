"use client"

import { X, Sparkles } from "lucide-react"
import type React from "react"

interface CardModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: () => void
  children?: React.ReactNode
}

export function CardModal({ isOpen, onClose, onGenerate, children }: CardModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full z-10 overflow-hidden">
        {/* Header gradient */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500" />

        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>

          {/* Content */}
          {children ? (
            children
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-2">Generate Activity Card</h2>
              <p className="text-center text-slate-600 mb-8">
                Turn your Farcaster activity into a shareable visual card
              </p>

              <button
                onClick={onGenerate}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Generate Card
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
