"""
API route definitions.
"""
from flask import jsonify, request, current_app
from backend.routes import api_bp
import logging
from functools import wraps
from werkzeug.exceptions import BadRequest, Unauthorized, Forbidden

logger = logging.getLogger(__name__)

# Request validation decorator
def validate_json(*required_fields):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check if request has JSON
            if not request.is_json:
                logger.warning("Request without JSON data received")
                raise BadRequest("Request must be JSON")

            # Check for required fields
            data = request.get_json()
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                logger.warning(f"Request missing required fields: {missing_fields}")
                raise BadRequest(f"Missing required fields: {', '.join(missing_fields)}")

            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Example: Health check endpoint
@api_bp.route('/health', methods=['GET'])
def health_check():
    """API health check endpoint."""
    return jsonify({
        'status': 'ok',
        'message': 'API is operational'
    })

# Example: Get features endpoint
@api_bp.route('/features', methods=['GET'])
def get_features():
    """Return list of features for the landing page."""
    try:
        features = [
            {
                'id': 1,
                'title': 'AI-Powered Insights',
                'description': 'Leverage artificial intelligence to gain meaningful insights from your data.'
            },
            {
                'id': 2,
                'title': 'Natural Language Processing',
                'description': 'Process and understand human language with our advanced NLP algorithms.'
            },
            {
                'id': 3,
                'title': 'Adaptive Learning',
                'description': 'Our models learn and improve over time, adapting to your specific needs.'
            }
        ]
        return jsonify({'features': features})
    except Exception as e:
        logger.error(f"Error retrieving features: {str(e)}")
        raise

# Example: Contact form submission endpoint
@api_bp.route('/contact', methods=['POST'])
@validate_json('name', 'email', 'message')
def submit_contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json()

        # Input validation
        if not data.get('email') or '@' not in data.get('email'):
            raise BadRequest("Invalid email address")

        if len(data.get('message', '')) < 10:
            raise BadRequest("Message is too short")

        # Here you would normally save to database or send email
        # For demo purposes, we'll just log and return success
        logger.info(f"Contact form submitted by: {data.get('name')} ({data.get('email')})")

        return jsonify({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!'
        })
    except BadRequest as e:
        # Re-raise validation errors for the error handler
        raise
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise
