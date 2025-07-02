"use client"

import { Progress } from "@/components/ui/progress"
import { FileText, Brain, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ProcessingStep = "upload" | "extracting" | "processing" | "complete"

interface ProcessingProgressProps {
  step: ProcessingStep
  progress: number
}

export function ProcessingProgress({ step, progress }: ProcessingProgressProps) {
  const steps = [
    { key: "upload", label: "Upload", icon: FileText },
    { key: "extracting", label: "Text Extraction", icon: FileText },
    { key: "processing", label: "AI Analysis", icon: Brain },
    { key: "complete", label: "Complete", icon: CheckCircle },
  ]

  const getStepStatus = (stepKey: string) => {
    const currentIndex = steps.findIndex((s) => s.key === step)
    const stepIndex = steps.findIndex((s) => s.key === stepKey)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "active"
    return "pending"
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          {step === "complete" ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {step === "extracting" && "Extracting text from PDF..."}
            {step === "processing" && "AI is analyzing the content..."}
            {step === "complete" && "Processing complete!"}
          </p>
          <p className="text-sm text-gray-500">Please wait while we process your document</p>
        </div>
      </div>

      <div className="space-y-3">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {steps.slice(1).map((stepItem) => {
          const status = getStepStatus(stepItem.key)
          const Icon = stepItem.icon

          return (
            <div key={stepItem.key} className="flex items-center gap-2">
              <div
                className={cn(
                  "p-2 rounded-full transition-colors",
                  status === "completed" && "bg-green-100",
                  status === "active" && "bg-blue-100",
                  status === "pending" && "bg-gray-100",
                )}
              >
                <Icon
                  className={cn(
                    "h-3 w-3",
                    status === "completed" && "text-green-600",
                    status === "active" && "text-blue-600",
                    status === "pending" && "text-gray-400",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  status === "completed" && "text-green-600",
                  status === "active" && "text-blue-600",
                  status === "pending" && "text-gray-400",
                )}
              >
                {stepItem.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
