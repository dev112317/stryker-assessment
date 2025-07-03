import os
import re
import json
import logging
import requests
from app.constants.document_types import DocumentTypeConfig

logger = logging.getLogger(__name__)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def ai_extract_data(text: str, config: DocumentTypeConfig) -> dict:
    try:
        fields_description = "\n".join([f"- {k}: {v}" for k, v in config.extraction_fields.items()])
        prompt = f"""
Extract structured data from this {config.name.lower()} document.

Required fields:
{fields_description}

Document text:
{text[:3000]}

Return as JSON. Use ISO format for dates (e.g. 2024-01-31).
"""
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are a JSON extraction assistant."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0,
                "max_tokens": 500
            }
        )
        result = response.json()["choices"][0]["message"]["content"]
        cleaned = re.sub(r"^```json|```$", "", result.strip(), flags=re.MULTILINE).strip()
        return json.loads(cleaned)

    except Exception as e:
        logger.error(f"AI extraction error: {e}")
        return {}
