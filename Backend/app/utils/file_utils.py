import os
import time
import mimetypes
import hashlib
from werkzeug.utils import secure_filename
from pathlib import Path
from app import db
from app.models import Document
from app.services.processor import processor  # instance of DocumentProcessor

def calculate_file_hash(file_path: str) -> str:
    hash_sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()

def save_uploaded_file(file, expected_type: str, processing_mode: str, upload_folder: str) -> Document:
    original_filename = file.filename
    filename = secure_filename(original_filename) or f"document_{int(time.time())}"
    name, ext = os.path.splitext(filename)
    filename = f"{name}_{int(time.time())}{ext}"
    file_path = os.path.join(upload_folder, filename)

    file.save(file_path)
    file_size = os.path.getsize(file_path)
    file_hash = calculate_file_hash(file_path)
    mime_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'

    detected_type, _ = processor.detect_document_type(original_filename)
    type_mismatch = detected_type != expected_type

    document = Document(
        filename=filename,
        original_filename=original_filename,
        file_path=file_path,
        file_size=file_size,
        file_hash=file_hash,
        mime_type=mime_type,
        expected_type=expected_type,
        detected_type=detected_type,
        type_mismatch=type_mismatch,
        processing_mode=processing_mode
    )

    db.session.add(document)
    db.session.commit()
    return document
