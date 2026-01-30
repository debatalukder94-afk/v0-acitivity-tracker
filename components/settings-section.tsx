"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { LogOut, Bell, Moon, Globe, Shield, User, Sparkles, Save, BellRing, CheckCircle2 } from "lucide-react"
import { useFarcasterUser } from "@/hooks/use-farcaster"
import { useNotifications } from "@/hooks/use-notifications"

interface SettingsSectionProps {
  username: string
  onLogout: () => void
}

export function SettingsSection({ username, onLogout }: SettingsSectionProps) {
  const { user } = useFarcasterUser(username)
  const { permission, preferences, isSupported, requestPermission, updatePreference, showNotification } =
    useNotifications(username)

  const [permissionRequested, setPermissionRequested] = useState(false)

  // Handle notification toggle
  const handleNotificationToggle = async (
    key: "activityReminders" | "weeklySummary" | "goalAlerts",
    checked: boolean,
  ) => {
    if (checked && permission === "default") {
      setPermissionRequested(true)
      const granted = await requestPermission()
      setPermissionRequested(false)
      if (!granted) return
    }

    await updatePreference(key, checked)
  }

  // Test notification button
  const handleTestNotification = () => {
    if (permission !== "granted") {
      requestPermission().then((granted) => {
        if (granted) {
          showNotification(
            "Notifications Working! 🎉",
            "You'll now receive activity reminders, weekly summaries, and goal alerts.",
            "settings",
          )
        }
      })
    } else {
      showNotification("Test Notification", "Your notifications are set up correctly!", "settings")
    }
  }

  return (
    <div className="space-y-4 md:space-y-8 w-full max-w-2xl overflow-hidden px-1">
      {/* Header with 3D avatar */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative group">
          {user?.pfp_url ? (
            <img
              src={user.pfp_url || "/placeholder.svg"}
              alt={user.display_name}
              className="w-14 h-14 md:w-20 md:h-20 rounded-full ring-2 md:ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
          ) : (
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center ring-2 md:ring-4 ring-white shadow-xl">
              <span className="text-white text-xl md:text-3xl font-bold">{username.charAt(0).toUpperCase()}</span>
            </div>
          )}
          {/* Glow effect */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
          {/* Power badge */}
          {user?.power_badge && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center ring-2 md:ring-4 ring-white">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm md:text-base text-slate-500">Manage your account preferences</p>
        </div>
      </div>

      {/* Account settings with 3D card */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 card-3d relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-transparent rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200/50 flex-shrink-0">
              <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-800">Account</h2>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="text-xs md:text-sm font-medium text-slate-600 mb-2 block">Farcaster Username</label>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <Input
                  defaultValue={username}
                  className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50/80 px-4 md:px-5 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-base md:text-lg font-medium w-full"
                />
                <Button className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-lg shadow-sky-200/50 transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0 w-full sm:w-auto">
                  <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Update
                </Button>
              </div>
            </div>

            {user?.verified_addresses?.eth_addresses?.[0] && (
              <div>
                <label className="text-xs md:text-sm font-medium text-slate-600 mb-2 block">Connected Wallet</label>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-slate-50 to-sky-50/50 border border-slate-100">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white text-xs md:text-sm font-bold">E</span>
                  </div>
                  <span className="text-xs md:text-sm font-mono text-slate-600 truncate">
                    {user.verified_addresses.eth_addresses[0].slice(0, 8)}...
                    {user.verified_addresses.eth_addresses[0].slice(-6)}
                  </span>
                  <div className="ml-auto px-2 md:px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] md:text-xs font-semibold flex-shrink-0">
                    Verified
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Notification settings with real functionality */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 card-3d relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 flex-shrink-0">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-slate-800">Notifications</h2>
            </div>
            {isSupported && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  permission === "granted"
                    ? "bg-emerald-100 text-emerald-600"
                    : permission === "denied"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600"
                }`}
              >
                {permission === "granted" ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Enabled
                  </>
                ) : permission === "denied" ? (
                  "Blocked"
                ) : (
                  "Not enabled"
                )}
              </div>
            )}
          </div>

          {isSupported && permission !== "granted" && (
            <div className="mb-4 p-3 md:p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <BellRing className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Enable notifications</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {permission === "denied"
                      ? "Notifications are blocked. Please enable them in your browser settings."
                      : "Get real-time reminders and alerts to stay on top of your Farcaster activity."}
                  </p>
                  {permission === "default" && (
                    <Button
                      size="sm"
                      onClick={handleTestNotification}
                      disabled={permissionRequested}
                      className="mt-2 h-8 px-3 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                    >
                      {permissionRequested ? "Requesting..." : "Enable Notifications"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 md:space-y-5">
            <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300">
              <div className="mr-2">
                <p className="font-semibold text-sm md:text-base text-slate-700">Activity reminders</p>
                <p className="text-xs md:text-sm text-slate-400">Get reminded to post daily at 9 AM</p>
              </div>
              <Switch
                checked={preferences.activityReminders}
                onCheckedChange={(checked) => handleNotificationToggle("activityReminders", checked)}
                disabled={permission === "denied"}
                className="flex-shrink-0"
              />
            </div>

            <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300">
              <div className="mr-2">
                <p className="font-semibold text-sm md:text-base text-slate-700">Weekly summary</p>
                <p className="text-xs md:text-sm text-slate-400">Receive weekly stats report</p>
              </div>
              <Switch
                checked={preferences.weeklySummary}
                onCheckedChange={(checked) => handleNotificationToggle("weeklySummary", checked)}
                disabled={permission === "denied"}
                className="flex-shrink-0"
              />
            </div>

            <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300">
              <div className="mr-2">
                <p className="font-semibold text-sm md:text-base text-slate-700">Goal alerts</p>
                <p className="text-xs md:text-sm text-slate-400">Notify when you reach goals</p>
              </div>
              <Switch
                checked={preferences.goalAlerts}
                onCheckedChange={(checked) => handleNotificationToggle("goalAlerts", checked)}
                disabled={permission === "denied"}
                className="flex-shrink-0"
              />
            </div>
          </div>

          {permission === "granted" && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                className="w-full h-10 text-sm rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 bg-transparent"
              >
                <BellRing className="w-4 h-4 mr-2" />
                Send Test Notification
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Preferences with enhanced styling */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 card-3d relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200/50 flex-shrink-0">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-800">Preferences</h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-700">Dark mode</p>
                  <p className="text-xs md:text-sm text-slate-400">Coming soon</p>
                </div>
              </div>
              <Switch disabled className="flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-700">Privacy mode</p>
                  <p className="text-xs md:text-sm text-slate-400">Hide activity from public</p>
                </div>
              </div>
              <Switch className="flex-shrink-0" />
            </div>
          </div>
        </div>
      </Card>

      {/* Logout button with 3D press effect */}
      <Button
        onClick={onLogout}
        variant="outline"
        className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 hover:text-rose-700 hover:border-rose-300 bg-transparent transition-all duration-300 text-base md:text-lg font-semibold hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-lg"
      >
        <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        Log out
      </Button>
    </div>
  )
}
