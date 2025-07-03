from app import db
from datetime import datetime

class BatchJob(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    batch_id = db.Column(db.String(36), unique=True, nullable=False)

    total_documents = db.Column(db.Integer, nullable=False)
    completed_documents = db.Column(db.Integer, default=0)
    failed_documents = db.Column(db.Integer, default=0)
    processing_documents = db.Column(db.Integer, default=0)

    status = db.Column(db.String(20), default='queued')
    progress_percentage = db.Column(db.Float, default=0.0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)

    results_summary = db.Column(db.JSON)
