"""
Main Flask application entry point.
This file initializes and configures the Flask application.
"""
import os
import logging
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from config import config_by_name
from routes import register_blueprints, api
from routes.api import api_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_name="default"):
    """
    Create and configure the Flask application.

    Args:
        config_name: Configuration environment to use (default, development, testing, production)

    Returns:
        Configured Flask application
    """
    app = Flask(__name__,
                static_folder="../frontend/build/static",
                template_folder="../frontend/build")

    # Load configuration based on environment
    app.config.from_object(config_by_name[config_name])

    # Configure CORS
    # Allow requests from the frontend origin
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "https://your-production-domain.com"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register blueprints
    register_blueprints(app)
    app.register_blueprint(api_bp, url_prefix='/api')

    # Setup error handlers
    @app.errorhandler(404)
    def not_found(e):
        """Handle 404 errors globally."""
        if request.path.startswith('/api/'):
            return jsonify({"error": "API endpoint not found"}), 404
        return send_from_directory('../frontend/build', 'index.html')

    @app.errorhandler(500)
    def server_error(e):
        """Handle 500 errors globally."""
        logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    # Route to serve React app
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        """
        Serve the React frontend.

        For API calls, these will be handled by the API blueprint.
        For all other routes, serve the React app and let it handle routing.
        """
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory('../frontend/build', 'index.html')

    # Health check endpoint
    @app.route('/health')
    def health():
        """Health check endpoint for monitoring."""
        return jsonify({"status": "healthy"}), 200

    logger.info(f"Flask app initialized with {config_name} configuration")
    return app

if __name__ == '__main__':
    # Get configuration from environment or use development by default
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app(env)
    
    # Run the app
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
