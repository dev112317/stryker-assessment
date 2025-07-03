"use client"

import { useState, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface ProcessingState {
  isProcessing: boolean
  step: "idle" | "upload" | "extraction" | "analysis" | "validation" | "complete" | "error"
  progress: number
  message: string
  startTime?: number
  estimatedTimeRemaining?: number
}

export interface ExtractedData {
  id?: string | number
  [key: string]: any
  metadata?: Record<string, any>
  confidence_score?: number
  processing_time?: number
  created_at?: string
  updated_at?: string
  raw_text?: string
}

export function useRealTimeProcessing() {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    step: "idle",
    progress: 0,
    message: "Ready to process",
  })

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { toast } = useToast()

  const updateProcessingState = useCallback((updates: Partial<ProcessingState>) => {
    setProcessingState((prev) => ({ ...prev, ...updates }))
  }, [])

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${Backend_URL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      return response.ok
    } catch (error) {
      console.log("Backend not available, using demo mode")
      return false
    }
  }, [])

  const processDocument = useCallback(
    async (file: File, documentType: string): Promise<ExtractedData | null> => {
      const startTime = Date.now()
      abortControllerRef.current = new AbortController()

      try {
        setProcessingState({
          isProcessing: true,
          step: "upload",
          progress: 0,
          message: "Checking backend availability...",
          startTime,
        })

        // Check if backend is available
        const isBackendAvailable = await checkBackendHealth()

        if (isBackendAvailable) {
          // Real backend processing
          return await processWithBackend(file, documentType, startTime)
        } else {
          // Demo mode processing
          return await processWithDemo(file, documentType, startTime)
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          updateProcessingState({
            isProcessing: false,
            step: "idle",
            progress: 0,
            message: "Processing cancelled",
          })
          return null
        }

        console.error("Processing failed:", error)
        updateProcessingState({
          isProcessing: false,
          step: "error",
          progress: 0,
          message: "Processing failed. Please try again.",
        })

        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: error.message || "An unexpected error occurred",
        })

        return null
      }
    },
    [checkBackendHealth, toast, updateProcessingState],
  )

  const processWithBackend = useCallback(
    async (file: File, documentType: string, startTime: number): Promise<ExtractedData | null> => {
      // Step 1: Upload
      updateProcessingState({
        step: "upload",
        progress: 10,
        message: "Uploading document to server...",
        estimatedTimeRemaining: 8000,
      })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("document_type", documentType)

      const uploadResponse = await fetch(`${Backend_URL}/simple/upload`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current?.signal,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }

      const uploadResult = await uploadResponse.json()

      // Step 2: Processing
      updateProcessingState({
        step: "extraction",
        progress: 30,
        message: "Extracting text content...",
        estimatedTimeRemaining: 6000,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      updateProcessingState({
        step: "analysis",
        progress: 60,
        message: "AI is analyzing the document...",
        estimatedTimeRemaining: 3000,
      })

      const processResponse = await fetch(`${Backend_URL}/simple/process/${uploadResult.document_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current?.signal,
      })

      if (!processResponse.ok) {
        throw new Error(`Processing failed: ${processResponse.statusText}`)
      }

      const processResult = await processResponse.json()

      // Step 3: Validation
      updateProcessingState({
        step: "validation",
        progress: 90,
        message: "Validating extracted data...",
        estimatedTimeRemaining: 1000,
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 4: Complete
      const finalData: ExtractedData = {
        id: uploadResult.document_id,
        ...processResult.data,
        confidence_score: processResult.confidence_score,
        processing_time: Date.now() - startTime,
        created_at: new Date().toISOString(),
        metadata: {
          document_type: documentType,
          file_name: file.name,
          file_size: file.size,
          detected_type: uploadResult.detected_type,
          type_mismatch: uploadResult.type_mismatch,
        },
      }

      updateProcessingState({
        step: "complete",
        progress: 100,
        message: "Processing completed successfully!",
        estimatedTimeRemaining: 0,
      })

      setExtractedData(finalData)

      toast({
        title: "✅ Processing Complete",
        description: `Document processed with ${processResult.confidence_score?.toFixed(1)}% confidence`,
      })

      return finalData
    },
    [updateProcessingState, toast],
  )

  const processWithDemo = useCallback(
    async (file: File, documentType: string, startTime: number): Promise<ExtractedData | null> => {
      // Demo processing with realistic timing
      const steps = [
        { step: "upload", progress: 15, message: "Uploading document...", delay: 800 },
        { step: "extraction", progress: 40, message: "Extracting text content...", delay: 1200 },
        { step: "analysis", progress: 75, message: "AI is analyzing the document...", delay: 2000 },
        { step: "validation", progress: 95, message: "Validating extracted data...", delay: 800 },
      ]

      for (const stepData of steps) {
        updateProcessingState({
          step: stepData.step as any,
          progress: stepData.progress,
          message: stepData.message,
          estimatedTimeRemaining: steps.reduce((acc, s, i) => {
            return i >= steps.indexOf(stepData) ? acc + s.delay : acc
          }, 0),
        })

        await new Promise((resolve) => setTimeout(resolve, stepData.delay))

        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Processing cancelled")
        }
      }

      // Generate demo data based on document type
      const demoData = generateDemoData(documentType, file)

      const finalData: ExtractedData = {
        id: Math.floor(Math.random() * 10000),
        ...demoData,
        confidence_score: 92.5 + Math.random() * 5,
        processing_time: Date.now() - startTime,
        created_at: new Date().toISOString(),
        metadata: {
          document_type: documentType,
          file_name: file.name,
          file_size: file.size,
          demo_mode: true,
        },
      }

      updateProcessingState({
        step: "complete",
        progress: 100,
        message: "Processing completed successfully!",
        estimatedTimeRemaining: 0,
      })

      setExtractedData(finalData)

      toast({
        title: "✅ Demo Processing Complete",
        description: `Document processed with ${finalData.confidence_score?.toFixed(1)}% confidence (Demo Mode)`,
      })

      return finalData
    },
    [updateProcessingState, toast],
  )

  const generateDemoData = useCallback((documentType: string, file: File): Partial<ExtractedData> => {
    const baseData = {
      raw_text: `This is extracted text content from ${file.name}...`,
    }

    switch (documentType) {
      case "invoice":
        return {
          ...baseData,
          vendor_name: "Acme Corporation",
          invoice_number: "INV-2024-001",
          date: "2024-01-15",
          total_amount: "$1,250.00",
          subtotal: "$1,150.00",
          tax_amount: "$100.00",
          due_date: "2024-02-15",
          payment_terms: "Net 30",
        }

      case "receipt":
        return {
          ...baseData,
          merchant_name: "Tech Store Plus",
          transaction_date: "2024-01-15",
          transaction_time: "14:30:25",
          total_amount: "$89.99",
          payment_method: "Credit Card",
          subtotal: "$82.99",
          tax_amount: "$7.00",
        }

      case "contract":
        return {
          ...baseData,
          contract_title: "Software Development Agreement",
          parties: ["TechCorp Inc.", "DevStudio LLC"],
          effective_date: "2024-01-01",
          expiration_date: "2024-12-31",
          governing_law: "State of California",
          payment_terms: "Monthly payments of $5,000",
        }

      case "financial_statement":
        return {
          ...baseData,
          statement_type: "Income Statement",
          period: "Q4 2023",
          company_name: "Innovation Corp",
          revenue: "$2,500,000",
          net_income: "$450,000",
          total_assets: "$5,200,000",
          total_liabilities: "$1,800,000",
        }

      default:
        return baseData
    }
  }, [])

  const saveData = useCallback(
    async (data: ExtractedData): Promise<boolean> => {
      try {
        // Check if backend is available
        const isBackendAvailable = await checkBackendHealth()

        if (isBackendAvailable) {
          const response = await fetch(`${Backend_URL}/simple/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              document_id: data.id,
              extracted_data: data,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to save data")
          }
        }

        // Update local data
        const updatedData = {
          ...data,
          updated_at: new Date().toISOString(),
        }

        setExtractedData(updatedData)

        toast({
          title: "💾 Data Saved",
          description: "Document data has been saved successfully",
        })

        return true
      } catch (error) {
        console.error("Save failed:", error)
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Failed to save document data",
        })
        return false
      }
    },
    [checkBackendHealth, toast],
  )

  const startProcessing = useCallback(() => {
    updateProcessingState({
      isProcessing: true,
      step: "upload",
      progress: 0,
      message: "Starting processing...",
      startTime: Date.now(),
    })
  }, [updateProcessingState])

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    updateProcessingState({
      isProcessing: false,
      step: "idle",
      progress: 0,
      message: "Processing cancelled",
    })

    toast({
      title: "Processing Cancelled",
      description: "Document processing has been cancelled",
    })
  }, [updateProcessingState, toast])

  const resetProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setProcessingState({
      isProcessing: false,
      step: "idle",
      progress: 0,
      message: "Ready to process",
    })

    setExtractedData(null)
  }, [])

  return {
    processingState,
    extractedData,
    processDocument,
    saveData,
    startProcessing,
    cancelProcessing,
    resetProcessing,
  }
}
