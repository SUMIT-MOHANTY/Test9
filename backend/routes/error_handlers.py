"""
Centralized error handlers for the Flask application.
"""
from flask import jsonify
from werkzeug.exceptions import HTTPException
import traceback
import logging

logger = logging.getLogger(__name__)

def register_error_handlers(app):
    """Register error handlers with the Flask app."""

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': str(error.description) if hasattr(error, 'description') else str(error)
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication is required to access this resource'
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource'
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found'
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'error': 'Method Not Allowed',
            'message': 'The method is not allowed for the requested URL'
        }), 405

    @app.errorhandler(429)
    def too_many_requests(error):
        return jsonify({
            'error': 'Too Many Requests',
            'message': 'Rate limit exceeded. Please try again later.'
        }), 429

    @app.errorhandler(500)
    def internal_server_error(error):
        # Log the full error internally but don't expose details to client
        logger.error(f"Internal server error: {str(error)}")
        logger.error(traceback.format_exc())

        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        # Handle non-HTTP exceptions
        logger.error(f"Unhandled exception: {str(error)}")
        logger.error(traceback.format_exc())

        # Don't expose exception details in production
        if app.debug:
            return jsonify({
                'error': 'Unhandled Exception',
                'message': str(error),
                'traceback': traceback.format_exc()
            }), 500
        else:
            return jsonify({
                'error': 'Internal Server Error',
                'message': 'An unexpected error occurred. Please try again later.'
            }), 500
