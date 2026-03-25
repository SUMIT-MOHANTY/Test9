"""
Main Flask application entry point for GenAI Landing Page.

This module initializes the Flask application, sets up configuration,
registers blueprints, configures CORS, and serves the React frontend.
"""

import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from config import config_by_name
from routes.api import api_bp

def create_app(config_name='development'):
    """
    Create and configure the Flask application.

    Args:
        config_name (str): The configuration environment to use.
                           Defaults to 'development'.

    Returns:
        Flask: The configured Flask application.
    """
    app = Flask(__name__,
                static_folder='../frontend/build/static',
                template_folder='../frontend/build')

    # Load config based on environment
    app.config.from_object(config_by_name[config_name])

    # Configure logging
    setup_logging(app)

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # Rate limiting setup
    if app.config['ENABLE_RATE_LIMITING']:
        setup_rate_limiting(app)

    # Global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        """
        Global exception handler for proper error responses.
        """
        app.logger.error(f"Unhandled exception: {str(e)}", exc_info=True)

        # Handle HTTP exceptions
        if isinstance(e, HTTPException):
            response = {
                "error": True,
                "message": e.description,
                "status_code": e.code
            }
            return jsonify(response), e.code

        # Handle non-HTTP exceptions
        response = {
            "error": True,
            "message": "An internal server error occurred",
            "status_code": 500
        }
        return jsonify(response), 500

    # Serve React App - catch all route for the SPA
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        """Serve the React frontend."""
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.template_folder, 'index.html')

    app.logger.info(f"Flask application started with {config_name} configuration")
    return app

def setup_logging(app):
    """
    Configure application logging.

    Args:
        app (Flask): The Flask application instance.
    """
    log_level = app.config.get('LOG_LEVEL', logging.INFO)

    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.mkdir('logs')

    # Configure file handler
    file_handler = RotatingFileHandler(
        'logs/genai_api.log',
        maxBytes=10485760,  # 10MB
        backupCount=10
    )

    # Set log format
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(log_level)

    # Add handlers to app logger
    app.logger.addHandler(file_handler)
    app.logger.setLevel(log_level)

    # Werkzeug logger
    logging.getLogger('werkzeug').setLevel(log_level)
    logging.getLogger('werkzeug').addHandler(file_handler)

def setup_rate_limiting(app):
    """
    Configure rate limiting for API endpoints.

    Args:
        app (Flask): The Flask application instance.
    """
    try:
        from flask_limiter import Limiter
        from flask_limiter.util import get_remote_address

        limiter = Limiter(
            app=app,
            key_func=get_remote_address,
            default_limits=["200 per day", "50 per hour"]
        )

        app.logger.info("Rate limiting configured successfully")
        app.extensions['limiter'] = limiter

    except ImportError:
        app.logger.warning("Flask-Limiter not installed, rate limiting disabled")

# Run the application when executed directly
if __name__ == "__main__":
    app_instance = create_app(os.getenv('FLASK_ENV', 'development'))
    app_instance.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    )
