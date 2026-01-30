"use client"

import { useState } from "react"
import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ActivityCardProps {
  content: string
  likes: number
  comments: number
  recasts: number
  time: string
}

export function ActivityCard({ content, likes, comments, recasts, time }: ActivityCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Card className="p-5 rounded-2xl bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 card-3d relative overflow-hidden group">
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 via-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-3">{content}</p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100/80">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-1.5 transition-all duration-300 ${
                isLiked ? "text-rose-500 scale-110" : "text-slate-400 hover:text-rose-500 hover:scale-105"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{isLiked ? likes + 1 : likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-sky-500 hover:scale-105 transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-500 hover:scale-105 transition-all duration-300">
              <Repeat2 className="w-4 h-4" />
              <span className="text-xs font-medium">{recasts}</span>
            </button>
          </div>
          <span className="text-xs text-slate-400 font-medium">{time}</span>
        </div>
      </div>
    </Card>
  )
}
