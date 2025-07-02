"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ThemeAwareProgressProps {
  value: number
  className?: string
  showGlow?: boolean
  animated?: boolean
}

export function ThemeAwareProgress({ value, className, showGlow = true, animated = true }: ThemeAwareProgressProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Progress value={value} className={className} />

  const isDark = resolvedTheme === "dark"

  return (
    <div className={cn("relative", className)}>
      {/* Glow Effect */}
      {showGlow && (
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-sm transition-opacity duration-300",
            isDark
              ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30"
              : "bg-gradient-to-r from-blue-400/20 to-indigo-400/20",
            value > 0 ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Main Progress Bar */}
      <Progress
        value={value}
        className={cn("relative h-2 transition-all duration-300", isDark ? "bg-gray-800" : "bg-gray-200")}
      />

      {/* Animated Shimmer Effect */}
      {animated && value > 0 && value < 100 && (
        <div
          className={cn(
            "absolute top-0 left-0 h-full rounded-full animate-shimmer-progress",
            isDark
              ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
              : "bg-gradient-to-r from-transparent via-white/40 to-transparent",
          )}
          style={{ width: `${value}%` }}
        />
      )}

      {/* Completion Sparkle */}
      {value === 100 && (
        <div className="absolute -top-1 -right-1">
          <div className={cn("h-4 w-4 rounded-full animate-ping", isDark ? "bg-green-400" : "bg-green-500")} />
          <div
            className={cn("absolute top-0 right-0 h-4 w-4 rounded-full", isDark ? "bg-green-400" : "bg-green-500")}
          />
        </div>
      )}
    </div>
  )
}
