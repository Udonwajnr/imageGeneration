"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ImageIcon } from "lucide-react"

export function RecentActivity({ activities }) {
  return (
    <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">{activity.userEmail}</span> generated an image
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">{activity.prompt}</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs mb-1">
                  {activity.model}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(activity.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
