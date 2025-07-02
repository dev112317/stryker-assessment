"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ThemeAwareFabProps {
  icon: LucideIcon
  onClick: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "success" | "warning"
}

export function ThemeAwareFab({
  icon: Icon,
  onClick,
  className,
  size = "md",
  variant = "primary",
}: ThemeAwareFabProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const getVariantClasses = () => {
    const baseClasses = "relative overflow-hidden transition-all duration-300 transform"

    switch (variant) {
      case "primary":
        return cn(
          baseClasses,
          isDark
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25"
            : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/25",
          isHovered && "scale-110 shadow-xl",
        )
      case "success":
        return cn(
          baseClasses,
          isDark
            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25"
            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25",
          isHovered && "scale-110 shadow-xl",
        )
      default:
        return baseClasses
    }
  }

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(sizeClasses[size], "rounded-full p-0 border-0", getVariantClasses(), className)}
    >
      {/* Ripple Effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-transform duration-300",
          isDark ? "bg-white/10" : "bg-white/20",
          isHovered ? "scale-100" : "scale-0",
        )}
      />

      {/* Icon */}
      <Icon
        className={cn(
          iconSizes[size],
          "relative z-10 text-white transition-transform duration-200",
          isHovered && "scale-110",
        )}
      />

      {/* Glow Effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-md transition-opacity duration-300",
          variant === "primary" && (isDark ? "bg-blue-400/30" : "bg-blue-500/20"),
          variant === "success" && (isDark ? "bg-green-400/30" : "bg-green-500/20"),
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />
    </Button>
  )
}
