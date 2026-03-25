"""
Main Flask application entry point.
"""
import os
import logging
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from backend.config import get_config

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_name=None):
    """Application factory pattern to create the Flask app."""
    # Initialize Flask app
    app = Flask(__name__, static_folder=None)

    # Load configuration
    config = get_config()
    app.config.from_object(config)

    # Initialize extensions
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["100 per minute"],
        storage_uri=app.config.get("RATELIMIT_STORAGE_URL", "memory://"),
    )

    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS')}})

    # Register routes
    from backend.routes import init_app as init_routes
    init_routes(app)

    # Add security headers middleware
    @app.after_request
    def add_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        return response

    # Serve React frontend in production
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        if path and os.path.exists(os.path.join('../frontend/build', path)):
            return send_from_directory('../frontend/build', path)
        return send_from_directory('../frontend/build', 'index.html')

    # Custom 404 handler for API routes
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith('/api/'):
            return jsonify(error=str(e)), 404
        return serve_react('')

    return app

if __name__ == '__main__':
    app = create_app()

    # Use secure debug settings
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    if debug and not os.environ.get('FLASK_ENV') == 'production':
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        # For production, prefer gunicorn or another WSGI server
        app.run(debug=False, host='0.0.0.0', port=5000)
