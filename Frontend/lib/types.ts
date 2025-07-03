import {
  FileText,
  ImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
} from "lucide-react"

interface DocumentTypeConfig {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  gradient: string
  examples: string[]
}

export type DocumentType = "invoice" | "receipt" | "contract" | "financial_statement"

export const DOCUMENT_TYPES: Record<DocumentType, DocumentTypeConfig> = {
  invoice: {
    name: "Invoice",
    description: "Business invoices and billing documents",
    icon: FileText,
    color: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500 to-pink-500",
    examples: ["invoice.pdf", "bill_123.pdf", "inv_2024.pdf"],
  },
  receipt: {
    name: "Receipt",
    description: "Purchase receipts and transaction records",
    icon: ImageIcon,
    color: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
    examples: ["receipt.jpg", "purchase_rec.png", "transaction.pdf"],
  },
  contract: {
    name: "Contract",
    description: "Legal contracts and agreements",
    icon: FileTextIcon,
    color: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500 to-indigo-500",
    examples: ["contract.docx", "agreement.pdf", "terms.doc"],
  },
  financial_statement: {
    name: "Financial Statement",
    description: "Financial reports and statements",
    icon: FileSpreadsheetIcon,
    color: "text-green-600 dark:text-green-400",
    gradient: "from-green-500 to-teal-500",
    examples: ["balance_sheet.xlsx", "income_statement.csv", "financial_report.pdf"],
  },
}