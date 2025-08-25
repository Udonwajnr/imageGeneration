"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UsersTable({ users, onUserUpdate }) {
  const [loading, setLoading] = useState({})
  const { toast } = useToast()

  const handleResetCredits = async (userId) => {
    setLoading((prev) => ({ ...prev, [userId]: true }))

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-credits`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Credits reset",
          description: "User credits have been reset successfully.",
        })
        onUserUpdate()
      } else {
        throw new Error("Failed to reset credits")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset user credits.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-300">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user.isAdmin ? "default" : "secondary"} className="text-xs">
                      {user.isAdmin ? "Admin" : "User"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-300">
                    {user.dailyCredits - user.usedCredits}/{user.dailyCredits} credits
                  </p>
                  <p className="text-xs text-gray-500">Reset: {new Date(user.lastCreditReset).toLocaleDateString()}</p>
                </div>

                <Button
                  onClick={() => handleResetCredits(user.id)}
                  disabled={loading[user.id]}
                  variant="outline"
                  size="sm"
                  className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  {loading[user.id] ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No users found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
