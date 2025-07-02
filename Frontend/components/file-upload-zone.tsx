"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClearFile: () => void
  disabled?: boolean
}

const isValidFileType = (file: File): boolean => {
  const supportedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "text/plain",
    "application/msword", // Legacy .doc files
    "application/vnd.ms-excel", // Legacy .xls files
  ]

  const supportedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".docx", ".xlsx", ".csv", ".txt", ".doc", ".xls"]

  const hasValidMimeType = supportedTypes.includes(file.type)
  const hasValidExtension = supportedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

  console.log("File validation:", {
    fileName: file.name,
    fileType: file.type,
    hasValidMimeType,
    hasValidExtension,
    isValid: hasValidMimeType || hasValidExtension,
  })

  return hasValidMimeType || hasValidExtension
}

const getFileTypeDisplay = (file: File): string => {
  const name = file.name.toLowerCase()
  if (name.endsWith(".pdf")) return "PDF Document"
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) return "Image File"
  if (name.endsWith(".docx") || name.endsWith(".doc")) return "Word Document"
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "Excel Spreadsheet"
  if (name.endsWith(".csv")) return "CSV File"
  if (name.endsWith(".txt")) return "Text File"
  return "Document"
}

export function FileUploadZone({ onFileSelect, selectedFile, onClearFile, disabled = false }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]

        if (isValidFileType(file)) {
          onFileSelect(file)
          toast({
            title: "File selected",
            description: `${getFileTypeDisplay(file)} ready for processing`,
          })
        } else {
          toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please select a PDF, Image, Word, Excel, CSV, or TXT file",
          })
        }
      }
    },
    [onFileSelect, toast],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (isValidFileType(file)) {
        onFileSelect(file)
        toast({
          title: "File selected",
          description: `${getFileTypeDisplay(file)} ready for processing`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select a PDF, Image, Word, Excel, CSV, or TXT file",
        })
        // Clear the input
        e.target.value = ""
      }
    }
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300",
        dragActive && !disabled ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-300 hover:border-gray-400",
        selectedFile && "border-green-500 bg-green-50",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.docx,.doc,.xlsx,.xls,.csv,.txt"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="text-center space-y-4">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="p-4 bg-green-100 rounded-full">
                  <FileText className="h-10 w-10 text-green-600" />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClearFile()
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 truncate max-w-xs mx-auto">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {getFileTypeDisplay(selectedFile)} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <div className={cn("p-4 rounded-full transition-colors", dragActive ? "bg-blue-100" : "bg-gray-100")}>
                <Upload className={cn("h-10 w-10 transition-colors", dragActive ? "text-blue-600" : "text-gray-400")} />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {dragActive ? "Drop your document here" : "Upload Document"}
              </p>
              <p className="text-gray-500">Drag and drop or click to browse</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 max-w-sm mx-auto">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>PDF, Word, Excel</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>Images, CSV, TXT</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>All document types supported</span>
              <span>•</span>
              <span>Max 10MB</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
