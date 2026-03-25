"""
Initialize Flask route blueprints.
"""
from flask import Blueprint

# Create API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import routes after blueprint creation to avoid circular imports
from backend.routes.api import *

def init_app(app):
    """Register all blueprints with the app."""
    app.register_blueprint(api_bp)

    # Register error handlers
    from backend.routes.error_handlers import register_error_handlers
    register_error_handlers(app)
