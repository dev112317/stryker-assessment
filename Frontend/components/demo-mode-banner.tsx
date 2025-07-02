"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, X, Server, Database } from "lucide-react"

export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <span className="font-medium text-blue-800 dark:text-blue-200">🎭 Demo Mode Active</span>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Running with simulated data and mock processing. All features are fully functional for demonstration.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1 border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300"
            >
              <Server className="h-3 w-3" />
              Frontend Only
            </Badge>
            <Badge
              variant="outline"
              className="gap-1 border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300"
            >
              <Database className="h-3 w-3" />
              Mock Data
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
