"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Images, Zap, TrendingUp } from "lucide-react"

export function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Images Generated",
      value: stats?.totalImages || 0,
      icon: Images,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Credits Used Today",
      value: stats?.creditsUsedToday || 0,
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{card.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
