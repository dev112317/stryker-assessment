# Document Extraction System

A full-stack web application for extracting structured data from PDF invoices using AI.

## Features

- **PDF Upload**: Upload PDF invoice documents
- **AI-Powered Extraction**: Uses OpenAI GPT to extract structured data
- **Real-time Processing**: Responsive UI with loading states
- **Data Editing**: Review and edit extracted data before saving
- **Database Storage**: Persistent storage with SQLite
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack
### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- shadcn/ui components
- TypeScript

### Backend
- Flask (Python)
- SQLite database
- OpenAI API
- pdfplumber for PDF processing

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- OpenAI API key

### Backend Setup

1. Navigate to the scripts directory:
\`\`\`bash
cd scripts
\`\`\`

2. Install Python dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Set up environment variables:
\`\`\`bash
export OPENAI_API_KEY="your-openai-api-key-here"
\`\`\`

4. Initialize the database:
\`\`\`bash
python setup_database.py
\`\`\`

5. Start the Flask server:
\`\`\`bash
python flask_app.py
\`\`\`

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The frontend will run on `http://localhost:3000`

## Usage

1. Open the web application in your browser
2. Upload a PDF invoice using the file upload component
3. Click "Process Document" to extract data using AI
4. Review and edit the extracted fields as needed
5. Click "Save" to store the data in the database

## API Endpoints

- `POST /api/process-document` - Upload and process a PDF document
- `POST /api/save-data` - Save extracted data to database
- `GET /api/health` - Health check endpoint

## Database Schema

### extracted_data table
- `id` - Primary key
- `vendor_name` - Vendor/company name
- `invoice_number` - Invoice number
- `date` - Invoice date
- `total_amount` - Total amount
- `raw_text` - Raw extracted text
- `created_at` - Timestamp

## Scaling Strategies

### Performance Optimization
- **Async Processing**: Implement background job queues (Celery + Redis)
- **Caching**: Cache LLM responses for similar documents
- **Database Optimization**: Add indexes, consider PostgreSQL for production

### Infrastructure Scaling
- **Containerization**: Docker containers for easy deployment
- **Load Balancing**: Multiple Flask instances behind a load balancer
- **Cloud Services**: AWS Lambda for serverless processing, S3 for file storage

### Feature Enhancements
- **Multi-format Support**: Support for more document types (Word, Excel, images)
- **Batch Processing**: Process multiple documents simultaneously
- **User Authentication**: Multi-tenant support with user accounts
- **Audit Logging**: Track all document processing activities

## Security Considerations

- **File Validation**: Strict file type and size validation
- **Rate Limiting**: Prevent API abuse
- **Data Encryption**: Encrypt sensitive data at rest
- **Access Control**: Implement proper authentication and authorization

## Testing

Run the test script to verify PDF processing:
\`\`\`bash
python scripts/test_pdf_processing.py
\`\`\`

## Deployment

### Docker Deployment
\`\`\`bash
# Build and run with Docker Compose
docker-compose up --build
\`\`\`

### Cloud Deployment
- **Frontend**: Deploy to Vercel or Netlify
- **Backend**: Deploy to AWS EC2, Google Cloud Run, or Heroku
- **Database**: Use managed database services (AWS RDS, Google Cloud SQL)

## Environment Variables

\`\`\`bash
# Backend
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=sqlite:///documents.db  # or PostgreSQL URL for production

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend URL
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
