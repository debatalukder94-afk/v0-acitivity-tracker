"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats } from "@/hooks/use-farcaster"
import { Card } from "@/components/ui/card"
import { CardModal } from "./card-modal"
import { AnalysisState } from "./analysis-state"
import { ActivityCard } from "./activity-card"

interface CardSectionProps {
  username: string
}

// Mock data for top engagers - In production, calculate from actual engagement data
const MOCK_TOP_ENGAGERS = [
  {
    username: "alice.eth",
    display_name: "Alice Chen",
    pfp_url: "https://i.pravatar.cc/150?u=alice&d=identicon",
    engagement_score: 2840,
    rank: 1,
  },
  {
    username: "builder_bob",
    display_name: "Bob Smith",
    pfp_url: "https://i.pravatar.cc/150?u=bob&d=identicon",
    engagement_score: 2156,
    rank: 2,
  },
  {
    username: "creator_carol",
    display_name: "Carol Jensen",
    pfp_url: "https://i.pravatar.cc/150?u=carol&d=identicon",
    engagement_score: 1945,
    rank: 3,
  },
]

export function CardSection({ username }: CardSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCard, setShowCard] = useState(false)

  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setShowCard(true)
      setIsModalOpen(false)
    }, 3000)
  }

  if (!user || userLoading) {
    return null
  }

  return (
    <>
      {/* CTA Section */}
      <Card className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-indigo-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] card-3d">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Generate Activity Card</h3>
            <p className="text-slate-600">Create a beautiful shareable card showcasing your Farcaster performance</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5" />
            Generate Card
          </button>
        </div>
      </Card>

      {/* Card Display */}
      {showCard && (
        <Card className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white via-white to-purple-50/50 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex flex-col items-center gap-6">
            <div>
              <h3 className="text-center text-lg md:text-xl font-bold text-slate-800 mb-2">Your Activity Card</h3>
              <p className="text-center text-slate-600 text-sm">Share this card to showcase your Farcaster growth</p>
            </div>

            <ActivityCard
              user={user}
              engagementRate={engagementStats.engagementRate}
              totalLikes={engagementStats.totalLikes}
              totalRecasts={engagementStats.totalRecasts}
              totalReplies={engagementStats.totalReplies}
              topEngagers={MOCK_TOP_ENGAGERS}
            />

            <button
              onClick={() => setShowCard(false)}
              className="px-6 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              Generate Another
            </button>
          </div>
        </Card>
      )}

      {/* Modal */}
      <CardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onGenerate={handleGenerate}>
        {isGenerating ? <AnalysisState /> : undefined}
      </CardModal>
    </>
  )
}
