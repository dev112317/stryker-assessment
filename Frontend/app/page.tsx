"use client"

import React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Zap,
  AlertTriangle,
  FileIcon,
  ImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  Sparkles,
  Brain,
  Shield,
  Rocket,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useRealTimeProcessing } from "@/hooks/use-real-time-processing"
import { RealTimeProgress } from "@/components/real-time-progress"
import { StructuredDataViewer } from "@/components/structured-data-viewer"
import { MultipleDocumentManager } from "@/components/multiple-document-manager"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedBackground } from "@/components/animated-background"
import { DOCUMENT_TYPES, DocumentType } from "@/lib/types"

export default function DocumentExtractionApp() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>("invoice")
  const [dragActive, setDragActive] = useState(false)
  const [documentId, setDocumentId] = useState<number | null>(null)
  const [typeMismatch, setTypeMismatch] = useState<{
    detected: DocumentType
    expected: DocumentType
  } | null>(null)

  const { toast } = useToast()
  const {
    processingState,
    extractedData,
    processDocument,
    saveData,
    startProcessing,
    cancelProcessing,
    resetProcessing,
  } = useRealTimeProcessing()

  const supportedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
    "text/plain",
  ]

  const supportedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".docx", ".doc", ".xlsx", ".xls", ".csv", ".txt"]

  const isValidFileType = useCallback(
    (file: File): boolean => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      return supportedTypes.includes(file.type) || supportedExtensions.includes(fileExtension)
    },
    [supportedTypes, supportedExtensions],
  )

  const getFileTypeDisplay = useCallback((file: File): string => {
    const name = file.name.toLowerCase()
    if (name.endsWith(".pdf")) return "PDF Document"
    if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) return "Image File"
    if (name.endsWith(".docx") || name.endsWith(".doc")) return "Word Document"
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "Excel Spreadsheet"
    if (name.endsWith(".csv")) return "CSV File"
    if (name.endsWith(".txt")) return "Text File"
    return "Document"
  }, [])

  const getFileIcon = useCallback((file: File) => {
    const name = file.name.toLowerCase()
    if (name.endsWith(".pdf")) return <FileIcon className="h-8 w-8 text-red-500" />
    if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg"))
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    if (name.endsWith(".docx") || name.endsWith(".doc")) return <FileTextIcon className="h-8 w-8 text-blue-500" />
    if (name.endsWith(".xlsx") || name.endsWith(".xls"))
      return <FileSpreadsheetIcon className="h-8 w-8 text-green-500" />
    if (name.endsWith(".csv")) return <FileSpreadsheetIcon className="h-8 w-8 text-orange-500" />
    if (name.endsWith(".txt")) return <FileText className="h-8 w-8 text-gray-500" />
    return <FileText className="h-8 w-8 text-gray-500" />
  }, [])

  const detectDocumentType = useCallback((file: File): DocumentType => {
    const filename = file.name.toLowerCase()

    // Invoice detection
    if (filename.includes("invoice") || filename.includes("bill") || filename.includes("inv")) {
      return "invoice"
    }

    // Receipt detection
    if (
      filename.includes("receipt") ||
      filename.includes("rec") ||
      filename.endsWith(".png") ||
      filename.endsWith(".jpg") ||
      filename.endsWith(".jpeg")
    ) {
      return "receipt"
    }

    // Contract detection
    if (
      filename.includes("contract") ||
      filename.includes("agreement") ||
      filename.includes("terms") ||
      filename.endsWith(".docx") ||
      filename.endsWith(".doc")
    ) {
      return "contract"
    }

    // Financial statement detection
    if (
      filename.includes("financial") ||
      filename.includes("statement") ||
      filename.includes("balance") ||
      filename.endsWith(".xlsx") ||
      filename.endsWith(".xls") ||
      filename.endsWith(".csv")
    ) {
      return "financial_statement"
    }

    // Default to invoice for PDFs
    return "invoice"
  }, [])

  const handleFileUpload = useCallback(
    async (uploadedFile: File) => {
      console.log("File uploaded:", uploadedFile.name, uploadedFile.type)

      if (!isValidFileType(uploadedFile)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `Please upload: ${supportedExtensions.join(", ")}`,
        })
        return
      }

      // Detect document type
      const detectedType = detectDocumentType(uploadedFile)
      console.log("Detected type:", detectedType, "Expected type:", selectedDocumentType)

      // Check for type mismatch
      if (detectedType !== selectedDocumentType) {
        setTypeMismatch({
          detected: detectedType,
          expected: selectedDocumentType,
        })
        toast({
          variant: "destructive",
          title: "Document type mismatch",
          description: `This appears to be a ${DOCUMENT_TYPES[detectedType].name}, but you selected ${DOCUMENT_TYPES[selectedDocumentType].name}`,
        })
      } else {
        setTypeMismatch(null)
      }

      setFile(uploadedFile)
      resetProcessing()

      toast({
        title: "✅ File ready for processing",
        description: `${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)`,
      })
    },
    [isValidFileType, detectDocumentType, selectedDocumentType, toast, supportedExtensions, resetProcessing],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        handleFileUpload(droppedFiles[0])
      }
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFileUpload(selectedFile)
      }
    },
    [handleFileUpload],
  )

  const handleProcess = useCallback(async () => {
    if (!file) return

    try {
      const result = await processDocument(file, selectedDocumentType)
      if (result) {
        console.log("Processing completed:", result)
      }
    } catch (error) {
      console.error("Processing failed:", error)
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "Please try again or check your connection",
      })
    }
  }, [file, selectedDocumentType, processDocument, toast])

  const handleSave = useCallback(async () => {
    if (!extractedData) return
    await saveData(extractedData)
  }, [extractedData, saveData])

  const clearFile = useCallback(() => {
    setFile(null)
    setDocumentId(null)
    setTypeMismatch(null)
    resetProcessing()
  }, [resetProcessing])

  const dismissMismatch = useCallback(() => {
    setTypeMismatch(null)
    toast({
      title: "Mismatch dismissed",
      description: "Continuing with selected document type",
    })
  }, [toast])

  const changeDocumentType = useCallback(
    (newType: DocumentType) => {
      setSelectedDocumentType(newType)
      if (file) {
        const detectedType = detectDocumentType(file)
        if (detectedType === newType) {
          setTypeMismatch(null)
          toast({
            title: "Document type updated",
            description: "Type mismatch resolved",
          })
        }
      }
    },
    [file, detectDocumentType, toast],
  )

  const canProcess = file && !processingState.isProcessing && (!typeMismatch || typeMismatch)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <div className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm bg-white/80 dark:bg-slate-950/80">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  AI Document Processor
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Extract structured data with intelligent AI processing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl z-10 container mx-auto px-6 py-8">
        <Tabs defaultValue="simple" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
            <TabsTrigger
              value="simple"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" />
              Simple Mode
            </TabsTrigger>
            <TabsTrigger
              value="multiple"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Rocket className="h-4 w-4" />
              Batch Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-8">
            {/* Document Type Selector */}
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Document Type Selection</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Choose your document type for optimized AI processing
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select value={selectedDocumentType} onValueChange={changeDocumentType}>
                  <SelectTrigger className="w-full h-14 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                    {Object.entries(DOCUMENT_TYPES).map(([key, config]) => {
                      const IconComponent = config.icon
                      return (
                        <SelectItem key={key} value={key} className="h-16">
                          <div className="flex items-center gap-4">
                            <div className={cn("p-2 rounded-lg bg-gradient-to-br", config.gradient)}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold">{config.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{config.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                {/* Document Type Info */}
                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn("p-2 rounded-xl bg-gradient-to-br", DOCUMENT_TYPES[selectedDocumentType].gradient)}
                    >
                      {React.createElement(DOCUMENT_TYPES[selectedDocumentType].icon, {
                        className: "h-5 w-5 text-white",
                      })}
                    </div>
                    <div>
                      <span className="font-semibold text-lg">{DOCUMENT_TYPES[selectedDocumentType].name}</span>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {DOCUMENT_TYPES[selectedDocumentType].description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DOCUMENT_TYPES[selectedDocumentType].examples.map((example) => (
                      <Badge key={example} variant="secondary" className="text-xs bg-white/60 dark:bg-slate-800/60">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Upload className="h-5 w-5" />
                  Upload Document
                </CardTitle>
                <CardDescription>Drag and drop your document or click to browse</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
                    dragActive
                      ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.02]"
                      : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600",
                    file && "border-green-400 bg-green-50/50 dark:bg-green-950/20",
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {file ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center gap-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                          {getFileIcon(file)}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg">{file.name}</p>
                          <p className="text-slate-600 dark:text-slate-400">
                            {getFileTypeDisplay(file)} • {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {documentId && (
                            <p className="text-xs text-slate-500 dark:text-slate-500">Document ID: {documentId}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFile}
                        className="bg-white/50 dark:bg-slate-800/50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-800 dark:to-slate-700/50 inline-block">
                        <Upload className="h-10 w-10 text-slate-400 animate-float" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold mb-2">Drop your document here</p>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Supports PDF, Images, Word, Excel, CSV files up to 10MB
                        </p>
                        <Button
                          asChild
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          <label className="cursor-pointer">
                            Browse Files
                            <input
                              type="file"
                              className="hidden"
                              accept={supportedExtensions.join(",")}
                              onChange={handleFileInputChange}
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Type Mismatch Alert */}
                {typeMismatch && (
                  <Alert className="mt-6 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20 backdrop-blur-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <strong>Document type mismatch detected!</strong>
                        <br />
                        This appears to be a <strong>{DOCUMENT_TYPES[typeMismatch.detected].name}</strong>, but you
                        selected <strong>{DOCUMENT_TYPES[typeMismatch.expected].name}</strong>.
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => changeDocumentType(typeMismatch.detected)}>
                          Change to {DOCUMENT_TYPES[typeMismatch.detected].name}
                        </Button>
                        <Button size="sm" variant="outline" onClick={dismissMismatch}>
                          Dismiss
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Processing Controls */}
            {file && (
              <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI Processing
                  </CardTitle>
                  <CardDescription>
                    Extract structured data from your {DOCUMENT_TYPES[selectedDocumentType].name.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleProcess}
                      disabled={!canProcess}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {processingState.isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Process with AI
                        </>
                      )}
                    </Button>

                    {processingState.isProcessing && (
                      <Button variant="outline" onClick={cancelProcessing} className="bg-white/50 dark:bg-slate-800/50">
                        Cancel
                      </Button>
                    )}
                  </div>

                  {/* Real-time Progress */}
                  {processingState.isProcessing && <RealTimeProgress state={processingState} />}

                  {/* Success State */}
                  {processingState.step === "complete" && extractedData && (
                    <Alert className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20 backdrop-blur-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <strong>Processing completed successfully!</strong>
                        <br />
                        Extracted {Object.keys(extractedData).length} data fields with{" "}
                        {extractedData.confidence_score?.toFixed(1)}% confidence.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Extracted Data Display */}
            {extractedData && (
              <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Extracted Data
                  </CardTitle>
                  <CardDescription>Structured data extracted from your document</CardDescription>
                </CardHeader>
                <CardContent>
                  <StructuredDataViewer data={extractedData} onSave={handleSave} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="multiple">
            <MultipleDocumentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
