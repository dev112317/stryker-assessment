# 📄 Document Extraction System

A modern, AI-powered document processing system that extracts structured data from PDFs, images, and other document formats using advanced OCR and machine learning techniques.

![Document Extraction System](https://img.shields.io/badge/Version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)
![SQLite](https://img.shields.io/badge/SQLite-3.0+-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Format Support**: Process PDFs, images (PNG, JPG, TIFF), Word documents, Excel files, and CSV
- **AI-Powered Extraction**: Advanced GPT-4 integration for intelligent data extraction
- **Smart Document Detection**: Automatic document type identification with confidence scoring
- **Real-Time Processing**: Live progress updates with WebSocket support
- **Batch Processing**: Handle multiple documents simultaneously
- **Template-Based Extraction**: Fallback extraction using predefined templates

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass effects with backdrop blur
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Automatic theme switching with system preference detection
- **Micro-Interactions**: Smooth animations and hover effects
- **Real-Time Feedback**: Instant visual feedback for all user actions
- **Accessibility**: Full WCAG 2.1 AA compliance with screen reader support

### 🔧 Advanced Features
- **Document Versioning**: Track changes and maintain document history
- **Export Options**: JSON, CSV, and Excel export formats
- **Search & Filter**: Advanced document search with multiple criteria
- **Audit Logging**: Comprehensive activity tracking and logging
- **API Integration**: RESTful API with comprehensive documentation
- **Performance Monitoring**: Built-in analytics and performance metrics

## 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Flask)       │◄──►│   (SQLite3)     │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Python 3.11   │    │ • Documents     │
│ • Tailwind CSS  │    │ • OpenAI API    │    │ • Extracted Data│
│ • TypeScript    │    │ • OCR Engine    │    │ • Audit Logs    │
│ • shadcn/ui     │    │ • File Processing│    │ • Statistics    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://python.org/))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/your-username/document-extraction-system.git
cd document-extraction-system
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Navigate to scripts directory
cd scripts

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your-openai-api-key-here"
export FLASK_ENV="development"
export SECRET_KEY="your-secret-key-here"

# Initialize database
python init_db.py

# Start backend server
python main.py
\`\`\`

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

\`\`\`bash
# Install dependencies
npm install

# Set environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

### 4. Verify Installation

\`\`\`bash
# Test backend health
curl http://localhost:5000/api/health

# Run test suite
python scripts/test_sqlite_backend.py
\`\`\`

## 📖 Usage Guide

### Simple Mode (Single Document)

1. **Upload Document**
   - Drag and drop or click to select a file
   - System automatically detects document type
   - Review detection results and confidence score

2. **Process Document**
   - Click "Process Document" to start extraction
   - Monitor real-time progress updates
   - Review extracted data in structured format

3. **Review & Edit**
   - Verify extracted information accuracy
   - Edit any incorrect fields
   - Add additional metadata if needed

4. **Save Results**
   - Save to database for future reference
   - Export in JSON, CSV, or Excel format
   - Share results via API endpoints

### Multiple Mode (Batch Processing)

1. **Upload Multiple Files**
   - Select multiple documents at once
   - System queues documents for processing
   - Monitor batch progress in real-time

2. **Batch Processing**
   - Documents processed sequentially
   - Individual progress tracking per document
   - Automatic error handling and retry logic

3. **Results Management**
   - View batch processing summary
   - Download individual or combined results
   - Filter and search processed documents

## 🔌 API Documentation

### Authentication

All API endpoints require authentication via API key:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://localhost:5000/api/endpoint
\`\`\`

### Core Endpoints

#### Health Check
```http
GET /api/health
