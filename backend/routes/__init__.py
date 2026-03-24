from flask import Blueprint

# Create a Blueprint for API routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import route definitions after Blueprint creation to avoid circular imports
from . import api

# Register the routes with the Blueprint
def init_app(app):
    """Register the API routes with the Flask application"""
    app.register_blueprint(api_bp)
    return app
