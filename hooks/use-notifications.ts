"use client"

import { useState, useEffect, useCallback } from "react"

interface NotificationPreferences {
  activityReminders: boolean
  weeklySummary: boolean
  goalAlerts: boolean
}

interface NotificationState {
  permission: NotificationPermission
  preferences: NotificationPreferences
  isSupported: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  activityReminders: true,
  weeklySummary: true,
  goalAlerts: false,
}

const STORAGE_KEY = "activity-tracker-notifications"
const LAST_REMINDER_KEY = "activity-tracker-last-reminder"
const GOALS_KEY = "activity-tracker-goals"

export function useNotifications(username: string | null) {
  const [state, setState] = useState<NotificationState>({
    permission: "default",
    preferences: DEFAULT_PREFERENCES,
    isSupported: false,
  })

  // Initialize on mount
  useEffect(() => {
    const isSupported = typeof window !== "undefined" && "Notification" in window

    if (isSupported) {
      // Load saved preferences
      const saved = localStorage.getItem(STORAGE_KEY)
      const preferences = saved ? JSON.parse(saved) : DEFAULT_PREFERENCES

      setState({
        permission: Notification.permission,
        preferences,
        isSupported: true,
      })
    }
  }, [])

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setState((prev) => ({ ...prev, permission }))
      return permission === "granted"
    } catch (error) {
      console.error("Failed to request notification permission:", error)
      return false
    }
  }, [state.isSupported])

  // Update preference
  const updatePreference = useCallback(
    async (key: keyof NotificationPreferences, value: boolean) => {
      // If enabling a notification, ensure we have permission
      if (value && state.permission !== "granted") {
        const granted = await requestPermission()
        if (!granted) return false
      }

      const newPreferences = { ...state.preferences, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences))
      setState((prev) => ({ ...prev, preferences: newPreferences }))

      // Show confirmation notification
      if (value && state.permission === "granted") {
        showNotification(
          "Notifications Enabled",
          `You will now receive ${key === "activityReminders" ? "activity reminders" : key === "weeklySummary" ? "weekly summaries" : "goal alerts"}.`,
          "settings",
        )
      }

      return true
    },
    [state.preferences, state.permission, requestPermission],
  )

  // Show a notification
  const showNotification = useCallback(
    (title: string, body: string, type: "reminder" | "summary" | "goal" | "settings" = "reminder") => {
      if (!state.isSupported || state.permission !== "granted") return

      const icons: Record<string, string> = {
        reminder: "/icon.png",
        summary: "/icon.png",
        goal: "/icon.png",
        settings: "/icon.png",
      }

      const notification = new Notification(title, {
        body,
        icon: icons[type],
        badge: "/icon.png",
        tag: `activity-tracker-${type}`,
        requireInteraction: type === "goal",
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      return notification
    },
    [state.isSupported, state.permission],
  )

  // Send activity reminder
  const sendActivityReminder = useCallback(() => {
    if (!state.preferences.activityReminders || state.permission !== "granted") return

    const lastReminder = localStorage.getItem(LAST_REMINDER_KEY)
    const now = new Date()
    const today = now.toDateString()

    // Only send one reminder per day
    if (lastReminder === today) return

    localStorage.setItem(LAST_REMINDER_KEY, today)

    showNotification(
      "Time to Post! 📝",
      `Hey ${username || "there"}! Don't forget to share something with your Farcaster community today.`,
      "reminder",
    )
  }, [state.preferences.activityReminders, state.permission, username, showNotification])

  // Send weekly summary
  const sendWeeklySummary = useCallback(
    (stats: { followers: number; likes: number; posts: number; engagementRate: number }) => {
      if (!state.preferences.weeklySummary || state.permission !== "granted") return

      showNotification(
        "Your Weekly Summary 📊",
        `This week: ${stats.followers} followers, ${stats.likes} likes, ${stats.posts} posts. Engagement rate: ${stats.engagementRate}%`,
        "summary",
      )
    },
    [state.preferences.weeklySummary, state.permission, showNotification],
  )

  // Send goal alert
  const sendGoalAlert = useCallback(
    (goalType: string, achieved: number, target: number) => {
      if (!state.preferences.goalAlerts || state.permission !== "granted") return

      if (achieved >= target) {
        showNotification(
          "Goal Achieved! 🎉",
          `Congratulations! You've reached your ${goalType} goal of ${target}!`,
          "goal",
        )
      }
    },
    [state.preferences.goalAlerts, state.permission, showNotification],
  )

  // Check goals against current stats
  const checkGoals = useCallback(
    (currentStats: { followers: number; likes: number; posts: number }) => {
      if (!state.preferences.goalAlerts) return

      const savedGoals = localStorage.getItem(GOALS_KEY)
      if (!savedGoals) return

      const goals = JSON.parse(savedGoals)

      if (goals.followers && currentStats.followers >= goals.followers) {
        sendGoalAlert("followers", currentStats.followers, goals.followers)
      }
      if (goals.likes && currentStats.likes >= goals.likes) {
        sendGoalAlert("likes", currentStats.likes, goals.likes)
      }
      if (goals.posts && currentStats.posts >= goals.posts) {
        sendGoalAlert("posts", currentStats.posts, goals.posts)
      }
    },
    [state.preferences.goalAlerts, sendGoalAlert],
  )

  // Set goals
  const setGoals = useCallback((goals: { followers?: number; likes?: number; posts?: number }) => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  }, [])

  // Schedule daily reminder check
  useEffect(() => {
    if (!state.preferences.activityReminders || state.permission !== "granted") return

    // Check every hour if we should send a reminder
    const interval = setInterval(
      () => {
        const hour = new Date().getHours()
        // Send reminder between 9 AM and 10 AM
        if (hour === 9) {
          sendActivityReminder()
        }
      },
      60 * 60 * 1000,
    ) // Check every hour

    return () => clearInterval(interval)
  }, [state.preferences.activityReminders, state.permission, sendActivityReminder])

  return {
    ...state,
    requestPermission,
    updatePreference,
    showNotification,
    sendActivityReminder,
    sendWeeklySummary,
    sendGoalAlert,
    checkGoals,
    setGoals,
  }
}
