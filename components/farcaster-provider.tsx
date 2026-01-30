"use client"

import { useEffect, useState, createContext, useContext, type ReactNode } from "react"

// Farcaster Mini App SDK types
interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

interface FarcasterContext {
  user?: FarcasterUser
  location?: {
    type: string
    referrerDomain?: string
  }
}

interface FarcasterSDK {
  actions: {
    ready: (options?: { disableNativeGestures?: boolean }) => Promise<void>
    openUrl: (url: string) => Promise<void>
    close: () => Promise<void>
    addMiniApp: () => Promise<void>
    signIn: (options?: { nonce?: string }) => Promise<{ signature: string; message: string }>
  }
  context?: FarcasterContext
}

declare global {
  interface Window {
    sdk?: FarcasterSDK
  }
}

interface FarcasterContextValue {
  sdk: FarcasterSDK | null
  isReady: boolean
  user: FarcasterUser | null
  isInMiniApp: boolean
}

const FarcasterCtx = createContext<FarcasterContextValue>({
  sdk: null,
  isReady: false,
  user: null,
  isInMiniApp: false,
})

export function useFarcasterSDK() {
  return useContext(FarcasterCtx)
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [sdk, setSdk] = useState<FarcasterSDK | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isInMiniApp, setIsInMiniApp] = useState(false)

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Dynamically import the Farcaster SDK
        const { sdk: farcasterSDK } = await import("@farcaster/miniapp-sdk")

        setSdk(farcasterSDK)

        // Check if we're in a Farcaster mini app context
        if (farcasterSDK.context) {
          setIsInMiniApp(true)
          if (farcasterSDK.context.user) {
            setUser(farcasterSDK.context.user)
          }
        }

        // Call ready to dismiss the splash screen
        await farcasterSDK.actions.ready({ disableNativeGestures: false })
        setIsReady(true)
      } catch (error) {
        // Not in a Farcaster mini app context or SDK not available
        console.log("[v0] Farcaster SDK not available, running in web mode")
        setIsReady(true)
      }
    }

    initSDK()
  }, [])

  return <FarcasterCtx.Provider value={{ sdk, isReady, user, isInMiniApp }}>{children}</FarcasterCtx.Provider>
}
