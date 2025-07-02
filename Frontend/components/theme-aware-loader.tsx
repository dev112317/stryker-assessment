"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeAwareLoaderProps {
  size?: "sm" | "md" | "lg"
  showParticles?: boolean
  className?: string
}

export function ThemeAwareLoader({ size = "md", showParticles = true, className }: ThemeAwareLoaderProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Loader2 className="h-6 w-6 animate-spin" />

  const isDark = resolvedTheme === "dark"

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Main Spinner */}
      <Loader2
        className={cn(
          "animate-spin transition-colors duration-300",
          sizeClasses[size],
          isDark
            ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            : "text-blue-600 drop-shadow-[0_0_4px_rgba(37,99,235,0.3)]",
        )}
      />

      {/* Animated Ring */}
      <div
        className={cn(
          "absolute rounded-full border-2 animate-ping",
          size === "sm" && "h-6 w-6",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-10 w-10",
          isDark ? "border-blue-400/30" : "border-blue-600/20",
        )}
      />

      {/* Floating Particles */}
      {showParticles && (
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <Sparkles
              key={i}
              className={cn(
                "absolute h-2 w-2 animate-bounce opacity-60",
                isDark ? "text-purple-400" : "text-indigo-500",
              )}
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
