from flask import Blueprint, jsonify
from app.models import Document
from app.constants.document_types import DOCUMENT_TYPES
from datetime import datetime, timedelta

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/stats", methods=["GET"])
def get_stats():
    stats = {}
    for doc_type in DOCUMENT_TYPES.keys():
        stats[doc_type] = {
            "completed": Document.query.filter_by(expected_type=doc_type, status="completed").count(),
            "failed": Document.query.filter_by(expected_type=doc_type, status="failed").count(),
        }

    docs = Document.query.filter_by(status="completed").all()
    total = len(docs)
    avg_time = sum(d.processing_time or 0 for d in docs) / total if total else 0
    avg_conf = sum(d.confidence_score or 0 for d in docs) / total if total else 0

    return jsonify({
        "document_stats": stats,
        "avg_processing_time": round(avg_time, 2),
        "avg_confidence": round(avg_conf, 2)
    })
