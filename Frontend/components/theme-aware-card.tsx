"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type React from "react"

interface ThemeAwareCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  glowOnHover?: boolean
  title?: string
  icon?: React.ReactNode
}

export function ThemeAwareCard({
  children,
  className,
  hoverable = true,
  glowOnHover = true,
  title,
  icon,
}: ThemeAwareCardProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {icon}
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="relative group">
      {/* Glow Effect */}
      {glowOnHover && isHovered && (
        <div
          className={cn(
            "absolute -inset-0.5 rounded-xl blur-sm transition-opacity duration-300",
            isDark
              ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20"
              : "bg-gradient-to-r from-blue-400/15 to-indigo-400/15",
          )}
        />
      )}

      <Card
        className={cn(
          "relative border-0 shadow-xl transition-all duration-300",
          isDark ? "bg-gray-800/70 backdrop-blur-sm" : "bg-white/70 backdrop-blur-sm",
          hoverable && [
            "cursor-pointer",
            isHovered && "transform scale-[1.02]",
            isDark
              ? "hover:bg-gray-800/90 hover:shadow-2xl hover:shadow-blue-500/10"
              : "hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/5",
          ],
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Border */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl transition-opacity duration-300",
            isDark
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
              : "bg-gradient-to-r from-blue-400/10 to-indigo-400/10",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        />

        {title && (
          <CardHeader className="relative">
            <CardTitle
              className={cn(
                "flex items-center gap-3 transition-colors duration-300",
                isDark ? "text-gray-100" : "text-gray-900",
              )}
            >
              {icon && (
                <div
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isDark ? "bg-blue-900/50" : "bg-blue-100",
                    isHovered && "scale-110",
                  )}
                >
                  {icon}
                </div>
              )}
              {title}
            </CardTitle>
          </CardHeader>
        )}

        <CardContent className="relative">{children}</CardContent>

        {/* Shimmer Effect */}
        {isHovered && (
          <div
            className={cn(
              "absolute inset-0 rounded-xl opacity-30",
              "bg-gradient-to-r from-transparent via-white/10 to-transparent",
              "animate-shimmer-card",
            )}
          />
        )}
      </Card>
    </div>
  )
}
