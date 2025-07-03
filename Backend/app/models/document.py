from app import db
from datetime import datetime
import uuid

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    file_hash = db.Column(db.String(64), nullable=False)
    mime_type = db.Column(db.String(100), nullable=False)

    expected_type = db.Column(db.String(50), nullable=False)
    detected_type = db.Column(db.String(50))
    type_mismatch = db.Column(db.Boolean, default=False)

    processing_mode = db.Column(db.String(20), nullable=False)  # 'simple' or 'multiple'
    status = db.Column(db.String(20), default='uploaded')
    batch_id = db.Column(db.String(36))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime)

    confidence_score = db.Column(db.Float)
    processing_time = db.Column(db.Float)
    error_message = db.Column(db.Text)

    extracted_data = db.relationship(
        'ExtractedData',
        backref='document',
        uselist=False,
        cascade='all, delete-orphan'
    )
