import re
import docx
import pandas as pd
from PIL import Image
import pytesseract
import PyPDF2
import aiofiles
from pathlib import Path
from app.constants.document_types import DOCUMENT_TYPES
from app.services.ai import ai_extract_data
import logging

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.supported_extensions = set()
        self.supported_mime_types = set()
        for config in DOCUMENT_TYPES.values():
            self.supported_extensions.update(config.extensions)
            self.supported_mime_types.update(config.mime_types)

    def is_supported_file(self, filename: str, mime_type: str) -> bool:
        ext = Path(filename).suffix.lower()
        return ext in self.supported_extensions or mime_type in self.supported_mime_types

    def detect_document_type(self, filename: str, file_content: str = ""):
        filename_lower = filename.lower()
        content_lower = file_content.lower()
        scores = {}

        for doc_type, config in DOCUMENT_TYPES.items():
            score = 0.0
            for keyword in config.keywords:
                if keyword in filename_lower:
                    score += 0.3
                if keyword in content_lower:
                    score += 0.1
            ext = Path(filename).suffix.lower()
            if ext in config.extensions:
                score += 0.2
            scores[doc_type] = min(score, 1.0)

        best_type = max(scores.items(), key=lambda x: x[1])
        return best_type[0], best_type[1]

    async def extract_text(self, file_path: str, mime_type: str) -> str:
        try:
            if mime_type == 'application/pdf':
                return await self.extract_pdf(file_path)
            elif mime_type in ['image/png', 'image/jpeg']:
                return await self.extract_image(file_path)
            elif mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return await self.extract_docx(file_path)
            elif mime_type == 'text/csv':
                return await self.extract_csv(file_path)
            return ""
        except Exception as e:
            logger.error(f"Text extraction error: {e}")
            return ""

    async def extract_pdf(self, path):
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            return "\n".join(p.extract_text() or "" for p in reader.pages)

    async def extract_image(self, path):
        return pytesseract.image_to_string(Image.open(path)).strip()

    async def extract_docx(self, path):
        doc = docx.Document(path)
        return "\n".join(p.text for p in doc.paragraphs)

    async def extract_csv(self, path):
        df = pd.read_csv(path)
        return df.to_string()

    async def extract_structured_data(self, text: str, doc_type: str):
        if not text.strip():
            return {}
        config = DOCUMENT_TYPES.get(doc_type)
        if not config:
            return {}
        return await ai_extract_data(text, config)

processor = DocumentProcessor()
