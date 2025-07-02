"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Edit3,
  Save,
  X,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  DollarSign,
  Calendar,
  Building,
  CreditCard,
  Users,
  Scale,
  BarChart3,
  Eye,
  Database,
  History,
  Copy,
  Download,
  Sparkles,
  Star,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { ExtractedData } from "@/hooks/use-real-time-processing"

interface StructuredDataViewerProps {
  data: ExtractedData
  onSave?: (data: ExtractedData) => Promise<boolean>
  documentType?: string
  confidence?: number
}

interface FieldConfig {
  label: string
  icon: React.ComponentType<{ className?: string }>
  type: "text" | "textarea" | "date" | "currency" | "array"
  category: string
  description?: string
  gradient?: string
}

const FIELD_CONFIGS: Record<string, FieldConfig> = {
  // Invoice fields
  vendor_name: {
    label: "Vendor Name",
    icon: Building,
    type: "text",
    category: "Vendor Information",
    description: "Name of the company or vendor",
    gradient: "from-blue-500 to-cyan-500",
  },
  invoice_number: {
    label: "Invoice Number",
    icon: FileText,
    type: "text",
    category: "Invoice Details",
    description: "Unique invoice identifier",
    gradient: "from-purple-500 to-pink-500",
  },
  date: {
    label: "Invoice Date",
    icon: Calendar,
    type: "date",
    category: "Invoice Details",
    description: "Date when invoice was issued",
    gradient: "from-green-500 to-emerald-500",
  },
  total_amount: {
    label: "Total Amount",
    icon: DollarSign,
    type: "currency",
    category: "Financial Information",
    description: "Total amount due",
    gradient: "from-yellow-500 to-orange-500",
  },

  // Receipt fields
  merchant_name: {
    label: "Merchant Name",
    icon: Building,
    type: "text",
    category: "Merchant Information",
    description: "Name of the store or merchant",
    gradient: "from-blue-500 to-cyan-500",
  },
  transaction_date: {
    label: "Transaction Date",
    icon: Calendar,
    type: "date",
    category: "Transaction Details",
    description: "Date of purchase",
    gradient: "from-green-500 to-emerald-500",
  },
  transaction_time: {
    label: "Transaction Time",
    icon: Clock,
    type: "text",
    category: "Transaction Details",
    description: "Time of purchase",
    gradient: "from-indigo-500 to-purple-500",
  },
  payment_method: {
    label: "Payment Method",
    icon: CreditCard,
    type: "text",
    category: "Payment Information",
    description: "Method used for payment",
    gradient: "from-rose-500 to-pink-500",
  },

  // Contract fields
  contract_title: {
    label: "Contract Title",
    icon: FileText,
    type: "text",
    category: "Contract Information",
    description: "Title or type of contract",
    gradient: "from-purple-500 to-indigo-500",
  },
  parties: {
    label: "Contracting Parties",
    icon: Users,
    type: "array",
    category: "Contract Information",
    description: "Parties involved in the contract",
    gradient: "from-teal-500 to-cyan-500",
  },
  effective_date: {
    label: "Effective Date",
    icon: Calendar,
    type: "date",
    category: "Contract Terms",
    description: "Date when contract becomes effective",
    gradient: "from-green-500 to-emerald-500",
  },
  expiration_date: {
    label: "Expiration Date",
    icon: Calendar,
    type: "date",
    category: "Contract Terms",
    description: "Date when contract expires",
    gradient: "from-red-500 to-rose-500",
  },
  governing_law: {
    label: "Governing Law",
    icon: Scale,
    type: "text",
    category: "Legal Information",
    description: "Applicable law and jurisdiction",
    gradient: "from-amber-500 to-yellow-500",
  },

  // Financial Statement fields
  statement_type: {
    label: "Statement Type",
    icon: BarChart3,
    type: "text",
    category: "Statement Information",
    description: "Type of financial statement",
    gradient: "from-violet-500 to-purple-500",
  },
  period: {
    label: "Reporting Period",
    icon: Calendar,
    type: "text",
    category: "Statement Information",
    description: "Period covered by the statement",
    gradient: "from-green-500 to-emerald-500",
  },
  company_name: {
    label: "Company Name",
    icon: Building,
    type: "text",
    category: "Company Information",
    description: "Name of the company",
    gradient: "from-blue-500 to-cyan-500",
  },
  revenue: {
    label: "Revenue",
    icon: TrendingUp,
    type: "currency",
    category: "Financial Data",
    description: "Total revenue or income",
    gradient: "from-green-500 to-emerald-500",
  },
  net_income: {
    label: "Net Income",
    icon: DollarSign,
    type: "currency",
    category: "Financial Data",
    description: "Net income or profit/loss",
    gradient: "from-yellow-500 to-orange-500",
  },
  total_assets: {
    label: "Total Assets",
    icon: BarChart3,
    type: "currency",
    category: "Balance Sheet",
    description: "Total company assets",
    gradient: "from-blue-500 to-indigo-500",
  },
  total_liabilities: {
    label: "Total Liabilities",
    icon: BarChart3,
    type: "currency",
    category: "Balance Sheet",
    description: "Total company liabilities",
    gradient: "from-red-500 to-rose-500",
  },

  // Common metadata fields
  subtotal: {
    label: "Subtotal",
    icon: DollarSign,
    type: "currency",
    category: "Financial Information",
    description: "Amount before tax",
    gradient: "from-green-500 to-teal-500",
  },
  tax_amount: {
    label: "Tax Amount",
    icon: DollarSign,
    type: "currency",
    category: "Financial Information",
    description: "Tax amount",
    gradient: "from-orange-500 to-red-500",
  },
  due_date: {
    label: "Due Date",
    icon: Calendar,
    type: "date",
    category: "Payment Information",
    description: "Payment due date",
    gradient: "from-red-500 to-pink-500",
  },
  payment_terms: {
    label: "Payment Terms",
    icon: CreditCard,
    type: "text",
    category: "Payment Information",
    description: "Payment terms and conditions",
    gradient: "from-indigo-500 to-purple-500",
  },
}

export function StructuredDataViewer({ data, onSave, documentType, confidence }: StructuredDataViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<ExtractedData>(data)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  const handleEdit = useCallback(() => {
    setIsEditing(true)
    setEditedData(data)
  }, [data])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditedData(data)
  }, [data])

  const handleSave = useCallback(async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      const success = await onSave(editedData)
      if (success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }, [editedData, onSave])

  const handleFieldChange = useCallback((field: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleMetadataChange = useCallback((field: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }))
  }, [])

  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    },
    [toast],
  )

  const exportData = useCallback(() => {
    const exportData = {
      ...data,
      exported_at: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document_${data.id || "data"}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "📥 Export Complete",
      description: "Data exported successfully",
    })
  }, [data, toast])

  const getConfidenceColor = (score?: number) => {
    if (!score) return "text-slate-500"
    if (score >= 95) return "text-green-600 dark:text-green-400"
    if (score >= 85) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getConfidenceBadge = (score?: number) => {
    if (!score) return "Unknown"
    if (score >= 95) return "High"
    if (score >= 85) return "Medium"
    return "Low"
  }

  const renderField = useCallback(
    (key: string, value: any, isMetadata = false, onChange?: (field: string, value: any) => void) => {
      const config = FIELD_CONFIGS[key]
      if (!config) return null

      const IconComponent = config.icon
      const currentValue = value || ""
      const isEditable = isEditing && onChange

      const renderInput = () => {
        switch (config.type) {
          case "textarea":
            return (
              <Textarea
                value={currentValue}
                onChange={(e) => onChange?.(key, e.target.value)}
                disabled={!isEditable}
                className="min-h-[80px] bg-white/50 dark:bg-slate-800/50"
                placeholder={config.description}
              />
            )

          case "array":
            const arrayValue = Array.isArray(currentValue) ? currentValue.join(", ") : currentValue
            return (
              <Textarea
                value={arrayValue}
                onChange={(e) => onChange?.(key, e.target.value.split(", ").filter(Boolean))}
                disabled={!isEditable}
                placeholder="Separate items with commas"
                className="min-h-[60px] bg-white/50 dark:bg-slate-800/50"
              />
            )

          default:
            return (
              <Input
                type={config.type === "date" ? "date" : "text"}
                value={currentValue}
                onChange={(e) => onChange?.(key, e.target.value)}
                disabled={!isEditable}
                placeholder={config.description}
                className="bg-white/50 dark:bg-slate-800/50"
              />
            )
        }
      }

      return (
        <div key={key} className="space-y-3">
          <Label className="flex items-center gap-3 text-sm font-semibold">
            <div className={cn("p-2 rounded-xl bg-gradient-to-br", config.gradient)}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            {config.label}
          </Label>
          {renderInput()}
          {config.description && !isEditing && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{config.description}</p>
          )}
        </div>
      )
    },
    [isEditing],
  )

  // Group fields by category
  const groupedFields = React.useMemo(() => {
    const groups: Record<string, Array<{ key: string; value: any; isMetadata: boolean }>> = {}

    // Add main fields
    Object.entries(editedData).forEach(([key, value]) => {
      if (
        key === "metadata" ||
        key === "id" ||
        key === "raw_text" ||
        key === "confidence_score" ||
        key === "processing_time" ||
        key === "created_at" ||
        key === "updated_at"
      ) {
        return
      }

      const config = FIELD_CONFIGS[key]
      if (config && value !== undefined && value !== null && value !== "") {
        const category = config.category
        if (!groups[category]) groups[category] = []
        groups[category].push({ key, value, isMetadata: false })
      }
    })

    // Add metadata fields
    if (editedData.metadata) {
      Object.entries(editedData.metadata).forEach(([key, value]) => {
        const config = FIELD_CONFIGS[key]
        if (config && value !== undefined && value !== null && value !== "") {
          const category = config.category
          if (!groups[category]) groups[category] = []
          groups[category].push({ key, value, isMetadata: true })
        }
      })
    }

    return groups
  }, [editedData])

  return (
    <div className="space-y-8">
      {/* Header with confidence and actions */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>

          <div className="flex items-center gap-4">
            {(confidence || data.confidence_score) && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <Badge
                  variant="secondary"
                  className={cn("text-sm font-semibold", getConfidenceColor(confidence || data.confidence_score))}
                >
                  {(confidence || data.confidence_score)?.toFixed(1)}% Confidence
                </Badge>
              </div>
            )}

            {data.processing_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <Badge variant="outline" className="text-sm">
                  {(data.processing_time / 1000).toFixed(1)}s
                </Badge>
              </div>
            )}

            {data.id && (
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-500" />
                <Badge variant="outline" className="text-sm">
                  ID: {data.id}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2), "Document data")}
            className="gap-2 bg-white/50 dark:bg-slate-800/50"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>

          <Button variant="outline" size="sm" onClick={exportData} className="gap-2 bg-white/50 dark:bg-slate-800/50">
            <Download className="h-4 w-4" />
            Export
          </Button>

          {!isEditing ? (
            <Button onClick={handleEdit} className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <FileText className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="metadata" className="gap-2">
            <Database className="h-4 w-4" />
            Metadata
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-8">
          {/* Processing Information */}
          {(data.confidence_score || data.processing_time) && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg">AI Processing Results</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.confidence_score && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Confidence</span>
                        <p className={cn("font-bold text-lg", getConfidenceColor(data.confidence_score))}>
                          {data.confidence_score.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                  {data.processing_time && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Processing Time</span>
                        <p className="font-bold text-lg text-green-600 dark:text-green-400">
                          {(data.processing_time / 1000).toFixed(1)}s
                        </p>
                      </div>
                    </div>
                  )}
                  {data.created_at && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Created</span>
                        <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          {new Date(data.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grouped fields */}
          <div className="grid gap-6">
            {Object.entries(groupedFields).map(([category, fields]) => (
              <Card key={category} className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    {category}
                  </CardTitle>
                  <CardDescription>
                    {fields.length} field{fields.length !== 1 ? "s" : ""} extracted
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {fields.map(({ key, value, isMetadata }) =>
                      renderField(key, value, isMetadata, isMetadata ? handleMetadataChange : handleFieldChange),
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-8">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                All Extracted Fields
              </CardTitle>
              <CardDescription>Complete list of all extracted data fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(editedData)
                  .filter(([key]) => !["metadata", "raw_text"].includes(key))
                  .map(([key, value]) => renderField(key, value, false, handleFieldChange))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-6 mt-8">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-5 w-5" />
                Document Metadata
              </CardTitle>
              <CardDescription>Additional information and processing metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {editedData.metadata && Object.keys(editedData.metadata).length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(editedData.metadata).map(([key, value]) =>
                    renderField(key, value, true, handleMetadataChange),
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>No metadata available for this document.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 mt-8">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <History className="h-5 w-5" />
                Processing History
              </CardTitle>
              <CardDescription>Timeline of document processing events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.created_at && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="p-2 rounded-full bg-green-500">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Document Processed</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(data.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {data.updated_at && data.updated_at !== data.created_at && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="p-2 rounded-full bg-blue-500">
                      <Edit3 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Data Updated</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(data.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
