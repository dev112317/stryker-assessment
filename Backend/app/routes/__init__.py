from .health import health_bp
from .documents import document_bp
from .batch import batch_bp
from .stats import stats_bp

def register_blueprints(app):
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(document_bp, url_prefix="/api")
    app.register_blueprint(batch_bp, url_prefix="/api")
    app.register_blueprint(stats_bp, url_prefix="/api")
