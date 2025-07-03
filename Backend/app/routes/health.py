from flask import Blueprint, jsonify
from app.models import Document
from datetime import datetime

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "database": "connected",
        "total_documents": Document.query.count(),
        "timestamp": datetime.utcnow().isoformat()
    })
