"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Zap, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface InstantFeedbackProps {
  type: "success" | "error" | "processing" | "info"
  message: string
  details?: string
  duration?: number
  onDismiss?: () => void
  showConfidence?: number
  processingTime?: number
}

export function InstantFeedback({
  type,
  message,
  details,
  duration = 4000,
  onDismiss,
  showConfidence,
  processingTime,
}: InstantFeedbackProps) {
  const { resolvedTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    if (duration > 0) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100)
          if (newProgress <= 0) {
            clearInterval(progressInterval)
            // Use setTimeout to avoid calling setState during render
            setTimeout(() => {
              setIsVisible(false)
              onDismiss?.()
            }, 0)
            return 0
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(progressInterval)
    }
  }, [duration, onDismiss])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500 animate-bounce" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
      case "processing":
        return <Zap className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return isDark
          ? "bg-green-950/50 border-green-800 text-green-200"
          : "bg-green-50 border-green-200 text-green-800"
      case "error":
        return isDark ? "bg-red-950/50 border-red-800 text-red-200" : "bg-red-50 border-red-200 text-red-800"
      case "processing":
        return isDark ? "bg-blue-950/50 border-blue-800 text-blue-200" : "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return isDark ? "bg-gray-800/50 border-gray-700 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-in-right",
        getColors(),
      )}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-lg transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        <div className="flex-1 space-y-1">
          <p className="font-medium text-sm">{message}</p>

          {details && <p className="text-xs opacity-80">{details}</p>}

          <div className="flex items-center gap-2 mt-2">
            {showConfidence && (
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {showConfidence.toFixed(1)}% confidence
              </Badge>
            )}

            {processingTime && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {(processingTime / 1000).toFixed(1)}s
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
