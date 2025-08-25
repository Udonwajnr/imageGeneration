"use client"

import { useState, useEffect } from "react"
import { AdminRoute } from "@/components/admin/admin-route"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/admin/stats-cards"
import { UsersTable } from "@/components/admin/users-table"
import { RecentActivity } from "@/components/admin/recent-activity"

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, activitiesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/admin/activity"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setActivities(activitiesData)
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        <Header />

        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage users and monitor system activity</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading admin data...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <StatsCards stats={stats} />

              <div className="grid lg:grid-cols-2 gap-8">
                <UsersTable users={users} onUserUpdate={fetchAdminData} />
                <RecentActivity activities={activities} />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
