"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function AnimatedBackground() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full opacity-20 animate-float-slow",
              isDark ? "bg-gradient-to-r from-blue-400 to-purple-500" : "bg-gradient-to-r from-blue-200 to-indigo-300",
            )}
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Grid */}
      <div className={cn("absolute inset-0 opacity-5", isDark ? "bg-grid-dark" : "bg-grid-light")} />

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-1000",
          isDark
            ? "bg-gradient-to-br from-transparent via-blue-950/10 to-purple-950/20"
            : "bg-gradient-to-br from-transparent via-blue-50/30 to-indigo-50/40",
        )}
      />
    </div>
  )
}
