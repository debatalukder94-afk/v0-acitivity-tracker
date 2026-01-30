"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

export function FloatingBubbles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const colors = [
      "from-teal-300/30 to-teal-400/10",
      "from-sky-400/25 to-blue-500/10",
      "from-indigo-400/25 to-indigo-600/10",
      "from-violet-300/20 to-purple-400/10",
      "from-slate-200/40 to-slate-300/20",
      "from-cyan-300/25 to-cyan-400/10",
    ]

    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 6,
    }))

    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static decorative bubbles */}
      <div className="absolute top-20 right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-teal-300/40 to-teal-400/20 blur-sm animate-float" />
      <div
        className="absolute top-40 right-[25%] w-24 h-24 rounded-full bg-gradient-to-br from-sky-400/30 to-blue-500/20 blur-sm animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-60 right-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400/30 to-indigo-600/20 blur-sm animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-40 left-[10%] w-40 h-40 rounded-full bg-gradient-to-br from-violet-300/20 to-purple-400/10 blur-md animate-float"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute top-32 left-[20%] w-16 h-16 rounded-full bg-gradient-to-br from-slate-200/50 to-slate-300/30 blur-sm animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full bg-gradient-to-br ${particle.color} blur-sm animate-float-slow`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(100 116 139) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}
