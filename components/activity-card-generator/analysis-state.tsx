"use client"

import { useEffect, useState } from "react"

const analysisSteps = ["Analyzing engagement…", "Calculating growth…", "Building your card…"]

export function AnalysisState() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % analysisSteps.length)
    }, 1500)

    return () => clearInterval(stepInterval)
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 30, 95))
    }, 500)

    return () => clearInterval(progressInterval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      {/* Animated orbiting circles */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-sky-500 border-l-sky-500 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 animate-pulse" />
        </div>
      </div>

      {/* Text animation */}
      <div className="text-center space-y-2">
        <p className="text-slate-600 text-lg font-semibold h-7 flex items-center justify-center">
          <span className="animate-in fade-in-50 duration-500" key={currentStep}>
            {analysisSteps[currentStep]}
          </span>
        </p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter */}
        <p className="text-sm text-slate-500 mt-4">
          <span className="font-semibold text-slate-700">{Math.floor(progress)}%</span> complete
        </p>
      </div>
    </div>
  )
}
