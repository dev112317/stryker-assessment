"use client"

import { useState, useCallback } from "react"

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false)

  const checkBackendAvailability = useCallback(async () => {
    try {
      const response = await fetch("/api/v2/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setIsDemoMode(false)
        return true
      } else {
        setIsDemoMode(true)
        return false
      }
    } catch (error) {
      setIsDemoMode(true)
      return false
    }
  }, [])

  const getMockData = useCallback(() => {
    return {
      documents: [
        {
          id: 1,
          uuid: "demo-uuid-1",
          filename: "sample_invoice_001.pdf",
          document_type: "invoice",
          status: "completed",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          confidence_score: 95.2,
          processing_time: 2100,
        },
        {
          id: 2,
          uuid: "demo-uuid-2",
          filename: "receipt_grocery_002.pdf",
          document_type: "receipt",
          status: "completed",
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          confidence_score: 92.8,
          processing_time: 1800,
        },
        {
          id: 3,
          uuid: "demo-uuid-3",
          filename: "service_contract_003.pdf",
          document_type: "contract",
          status: "processing",
          created_at: new Date().toISOString(),
          confidence_score: undefined,
          processing_time: undefined,
        },
        {
          id: 4,
          uuid: "demo-uuid-4",
          filename: "financial_statement_q3.pdf",
          document_type: "financial_statement",
          status: "completed",
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          confidence_score: 98.1,
          processing_time: 3200,
        },
        {
          id: 5,
          uuid: "demo-uuid-5",
          filename: "utility_bill_004.pdf",
          document_type: "invoice",
          status: "failed",
          created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          confidence_score: undefined,
          processing_time: undefined,
        },
      ],
      systemStats: {
        document_stats: {
          invoice: { completed: 45, failed: 2, processing: 3, pending: 5 },
          receipt: { completed: 23, failed: 1, processing: 1, pending: 2 },
          contract: { completed: 12, failed: 0, processing: 1, pending: 1 },
          financial_statement: { completed: 8, failed: 1, processing: 0, pending: 0 },
        },
        processing_stats: {
          avg_processing_time: 2.3,
          avg_confidence: 94.2,
          total_processed_24h: 88,
        },
        supported_document_types: ["invoice", "receipt", "contract", "financial_statement"],
      },
    }
  }, [])

  return {
    isDemoMode,
    checkBackendAvailability,
    getMockData,
  }
}
