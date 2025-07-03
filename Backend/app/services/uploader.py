import os
import time
import mimetypes
from pathlib import Path
from werkzeug.utils import secure_filename
from app import db
from app.models import Document
from app.services.processor import processor
from app.utils.file_utils import calculate_file_hash

def save_file_and_create_document(file, expected_type: str, processing_mode: str, upload_folder: str) -> Document:
    """Save the uploaded file and create a corresponding Document record in the DB."""

    original_filename = file.filename
    filename = secure_filename(original_filename) or f"document_{int(time.time())}"
    name, ext = os.path.splitext(filename)
    filename = f"{name}_{int(time.time())}{ext}"

    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    file_size = os.path.getsize(file_path)
    file_hash = calculate_file_hash(file_path)
    mime_type = mimetypes.guess_type(file_path)[0] or "application/octet-stream"

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
        processing_mode=processing_mode,
        status="uploaded"
    )

    db.session.add(document)
    db.session.commit()
    return document


def handle_batch_upload(files, expected_type: str, batch_id: str, upload_folder: str):
    """Save multiple files and create document records linked to a batch."""
    from app.models import Document  # prevent circular import

    uploaded_documents = []
    failed_uploads = []

    for file in files:
        try:
            if file.filename == "":
                continue

            detected_type, _ = processor.detect_document_type(file.filename)
            doc_type = detected_type if expected_type == "auto" else expected_type

            if not processor.is_supported_file(file.filename, file.content_type):
                failed_uploads.append({
                    "filename": file.filename,
                    "error": "Unsupported file type"
                })
                continue

            document = save_file_and_create_document(file, doc_type, "multiple", upload_folder)
            document.batch_id = batch_id
            db.session.commit()

            uploaded_documents.append({
                "document_id": document.id,
                "filename": document.original_filename,
                "expected_type": doc_type,
                "detected_type": document.detected_type,
                "type_mismatch": document.type_mismatch
            })

        except Exception as e:
            failed_uploads.append({
                "filename": file.filename,
                "error": str(e)
            })

    return uploaded_documents, failed_uploads
