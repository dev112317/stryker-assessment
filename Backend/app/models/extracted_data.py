from app import db
from datetime import datetime

class ExtractedData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)

    structured_data = db.Column(db.JSON, nullable=False)
    raw_text = db.Column(db.Text)

    extraction_method = db.Column(db.String(50))  # 'ai', 'template', etc.
    confidence_score = db.Column(db.Float)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
