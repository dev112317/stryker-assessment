"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ThemeAwareChartProps {
  children: React.ReactNode
  className?: string
}

export function ThemeAwareChart({ children, className }: ThemeAwareChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className={className}>{children}</div>

  const isDark = resolvedTheme === "dark"

  return (
    <div
      className={cn("transition-all duration-300", isDark ? "text-gray-100" : "text-gray-900", className)}
      style={
        {
          "--chart-1": isDark ? "217 91% 60%" : "221 83% 53%",
          "--chart-2": isDark ? "142 76% 36%" : "142 69% 58%",
          "--chart-3": isDark ? "47 96% 89%" : "47 96% 89%",
          "--chart-4": isDark ? "280 100% 70%" : "280 100% 70%",
          "--chart-5": isDark ? "340 75% 55%" : "340 75% 55%",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
