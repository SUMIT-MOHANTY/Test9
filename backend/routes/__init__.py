"""
Routes package initialization.
This file initializes the routes module and sets up Blueprint registration.
"""
from flask import Blueprint

# Create a Blueprint for API routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import routes to register them with the blueprint
from .api import *  # noqa

# List of all blueprints for easy registration with the Flask app
blueprints = [api_bp]

def register_blueprints(app):
    """Register all blueprints with the Flask application."""
    for blueprint in blueprints:
        app.register_blueprint(blueprint)
    return app
