"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Clock,
  Zap,
  Target,
  Sparkles,
  Shield,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProcessingState } from "@/hooks/use-real-time-processing"

interface RealTimeProgressProps {
  state: ProcessingState
  onCancel?: () => void
  className?: string
}

export function RealTimeProgress({ state, onCancel, className }: RealTimeProgressProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (state.progress > 0) {
      setPulseKey((prev) => prev + 1)
    }
  }, [state.progress])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  const getStepIcon = () => {
    switch (state.step) {
      case "upload":
        return <Upload className="h-5 w-5 animate-bounce" />
      case "extraction":
        return <FileText className="h-5 w-5 animate-pulse" />
      case "analysis":
        return <Brain className="h-5 w-5 animate-spin" />
      case "validation":
        return <Shield className="h-5 w-5 animate-pulse" />
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const getStepGradient = () => {
    switch (state.step) {
      case "upload":
        return "from-blue-500 to-cyan-500"
      case "extraction":
        return "from-purple-500 to-pink-500"
      case "analysis":
        return "from-green-500 to-emerald-500"
      case "validation":
        return "from-orange-500 to-yellow-500"
      case "complete":
        return "from-green-500 to-green-400"
      case "error":
        return "from-red-500 to-red-400"
      default:
        return "from-gray-500 to-gray-400"
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  }

  if (!state.isProcessing && state.step === "idle") return null

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
        className,
      )}
    >
      {/* Animated background gradient */}
      <div
        className={cn("absolute inset-0 opacity-5 bg-gradient-to-r animate-gradient", getStepGradient())}
        style={{ backgroundSize: "200% 200%" }}
      />

      <CardContent className="relative p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", getStepGradient())}>{getStepIcon()}</div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{state.message}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mt-1">
                <Clock className="h-4 w-4" />
                {state.estimatedTimeRemaining && state.isProcessing && (
                  <span>~{formatTime(state.estimatedTimeRemaining)} remaining</span>
                )}
                {state.step === "complete" && state.startTime && (
                  <span>Completed in {formatTime(Date.now() - state.startTime)}</span>
                )}
              </div>
            </div>
          </div>

          {state.isProcessing && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400 bg-white/50 dark:bg-slate-800/50"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Progress value={state.progress} className="h-4 transition-all duration-500" />

            {/* Animated shimmer effect */}
            {state.isProcessing && (
              <div
                key={pulseKey}
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full opacity-60 animate-shimmer-progress",
                  "bg-gradient-to-r from-transparent via-white/60 to-transparent",
                )}
                style={{ width: `${state.progress}%` }}
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={cn("bg-gradient-to-r text-white border-0 shadow-sm", getStepGradient())}
              >
                <Target className="h-3 w-3 mr-1" />
                {state.step.charAt(0).toUpperCase() + state.step.slice(1)}
              </Badge>
            </div>
            <span
              className={cn(
                "text-lg font-bold tabular-nums",
                state.progress === 100 ? "text-green-600 dark:text-green-400" : "text-slate-700 dark:text-slate-300",
              )}
            >
              {Math.round(state.progress)}%
            </span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between pt-4">
          {[
            { key: "upload", label: "Upload", icon: Upload },
            { key: "extraction", label: "Extract", icon: FileText },
            { key: "analysis", label: "AI Analysis", icon: Brain },
            { key: "validation", label: "Validate", icon: Shield },
            { key: "complete", label: "Complete", icon: CheckCircle },
          ].map((step, index) => {
            const isActive = state.step === step.key
            const isCompleted =
              ["upload", "extraction", "analysis", "validation", "complete"].indexOf(state.step) > index
            const Icon = step.icon

            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "p-3 rounded-2xl transition-all duration-300 shadow-sm",
                    isActive && "scale-110 animate-pulse shadow-lg",
                    isCompleted
                      ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                      : isActive
                        ? cn("bg-gradient-to-br text-white shadow-lg", getStepGradient())
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Processing Animation */}
        {state.isProcessing && (
          <div className="flex items-center justify-center gap-3 p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Cpu className="h-4 w-4" />
              <span className="text-sm font-medium">
                {state.step === "upload" && "Uploading to secure server..."}
                {state.step === "extraction" && "Extracting text content..."}
                {state.step === "analysis" && "AI is analyzing the document..."}
                {state.step === "validation" && "Validating extracted data..."}
              </span>
            </div>
          </div>
        )}

        {/* Success Animation */}
        {state.step === "complete" && (
          <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border border-green-200 dark:border-green-800">
            <div className="p-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">Processing Complete!</p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Your document has been successfully processed with AI
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
