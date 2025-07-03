from dataclasses import dataclass
from typing import List, Dict

@dataclass
class DocumentTypeConfig:
    name: str
    extensions: List[str]
    mime_types: List[str]
    keywords: List[str]
    extraction_fields: Dict[str, str]
    processing_steps: List[str]
    confidence_threshold: float = 0.8

DOCUMENT_TYPES = {
    'invoice': DocumentTypeConfig(
        name='Invoice',
        extensions=['.pdf', '.png', '.jpg', '.jpeg'],
        mime_types=['application/pdf', 'image/png', 'image/jpeg'],
        keywords=['invoice', 'bill', 'inv', 'billing', 'payment', 'due'],
        extraction_fields={
            'vendor_name': 'Company or vendor name',
            'invoice_number': 'Invoice or bill number',
            'date': 'Invoice date',
            'due_date': 'Payment due date',
            'total_amount': 'Total amount due',
            'subtotal': 'Subtotal before tax',
            'tax_amount': 'Tax amount',
            'line_items': 'List of items/services',
            'vendor_address': 'Company location & Vendor location',
            'user_address': 'User location',
            'vendor_email': 'Company email & Vendor email',
            'user_email': 'User email & buyer email'
        },
        processing_steps=[
            'Text extraction from PDF/Image',
            'Invoice header identification',
            'Line item parsing',
            'Amount calculation validation',
            'Date format standardization',
        ]
    ),
    'receipt': DocumentTypeConfig(
        name='Receipt',
        extensions=['.pdf', '.png', '.jpg', '.jpeg'],
        mime_types=['application/pdf', 'image/png', 'image/jpeg'],
        keywords=['receipt', 'rec', 'purchase', 'transaction', 'store', 'shop'],
        extraction_fields={
            'merchant_name': 'Store or merchant name',
            'transaction_date': 'Purchase date',
            'transaction_time': 'Purchase time',
            'total_amount': 'Total paid',
            'payment_method': 'Payment method used',
            'items': 'Purchased items',
            'tax_amount': 'Tax paid',
            'vendor_address': 'Company location & Vendor location',
            'user_address': 'User location',
            'vendor_email': 'Company email & Vendor email',
            'user_email': 'User email & buyer email'
        },
        processing_steps=[
            'OCR text extraction',
            'Merchant identification',
            'Transaction details parsing',
            'Item list extraction',
            'Payment validation'
        ]
    ),
    'contract': DocumentTypeConfig(
        name='Contract',
        extensions=['.pdf', '.docx', '.doc'],
        mime_types=['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        keywords=['contract', 'agreement', 'terms', 'conditions', 'party', 'parties'],
        extraction_fields={
            'contract_title': 'Contract title or type',
            'parties': 'Contracting parties',
            'effective_date': 'Contract effective date',
            'expiration_date': 'Contract end date',
            'key_terms': 'Important terms and conditions',
            'signatures': 'Signature information',
            'governing_law': 'Applicable law/jurisdiction',
            'contractor1_address': 'Contract1 location',
            'contractor2_address': 'Contract2 location',
            'contractor1_email': 'Contract1 email',
            'contractor2_email': 'Contract2 email',
        },
        processing_steps=[
            'Document text extraction',
            'Party identification',
            'Date extraction and validation',
            'Key terms identification',
            'Legal clause analysis'
        ]
    ),
    'financial_statement': DocumentTypeConfig(
        name='Financial Statement',
        extensions=['.pdf', '.xlsx', '.xls', '.csv'],
        mime_types=['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
        keywords=['financial', 'statement', 'balance', 'income', 'cash', 'flow', 'report'],
        extraction_fields={
            'statement_type': 'Type of financial statement',
            'period': 'Reporting period',
            'company_name': 'Company name',
            'total_assets': 'Total assets',
            'total_liabilities': 'Total liabilities',
            'revenue': 'Total revenue',
            'net_income': 'Net income/loss',
            'key_ratios': 'Important financial ratios'
        },
        processing_steps=[
            'Financial data extraction',
            'Statement type identification',
            'Numerical data validation',
            'Ratio calculations',
            'Period standardization'
        ]
    )
}
