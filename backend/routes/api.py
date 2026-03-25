"""
API routes for the GenAI Landing Page.
This module defines the API endpoints that provide data to the frontend.
"""

import re
import json
import logging
from flask import jsonify, request, abort, current_app
import os
from werkzeug.exceptions import HTTPException, BadRequest
from functools import wraps
from . import api_bp

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

# Sample data for the API endpoints
FEATURES = [
    {
        "id": "feature-1",
        "title": "Natural Language Processing",
        "description": "Our advanced NLP algorithms understand and generate human language with remarkable accuracy.",
        "icon": "language"
    },
    {
        "id": "feature-2",
        "title": "Computer Vision",
        "description": "Process and analyze visual data from the world with our state-of-the-art computer vision models.",
        "icon": "visibility"
    },
    {
        "id": "feature-3",
        "title": "Predictive Analytics",
        "description": "Harness the power of AI to forecast trends and make data-driven decisions for your business.",
        "icon": "analytics"
    },
    {
        "id": "feature-4",
        "title": "Automated Content Creation",
        "description": "Generate high-quality content automatically for marketing, reports, and more.",
        "icon": "create"
    }
]

USE_CASES = [
    {
        "id": "content-creation",
        "title": "Content Creation",
        "description": "Generate high-quality blog posts, marketing copy, and social media content in seconds, not hours.",
        "image_url": "/static/images/content-creation.jpg"
    },
    {
        "id": "customer-support",
        "title": "Customer Support",
        "description": "Deploy intelligent chatbots that understand customer inquiries and provide helpful, accurate responses 24/7.",
        "image_url": "/static/images/customer-support.jpg"
    },
    {
        "id": "data-analysis",
        "title": "Data Analysis",
        "description": "Transform raw data into valuable insights with automated analysis and visualization tools.",
        "image_url": "/static/images/data-analysis.jpg"
    },
    {
        "id": "product-design",
        "title": "Product Design",
        "description": "Accelerate your design process with AI-generated mockups, prototypes, and design variations.",
        "image_url": "/static/images/product-design.jpg"
    }
]

TESTIMONIALS = [
    {
        "id": "testimonial-1",
        "author": "John Smith",
        "company": "Tech Innovations Inc.",
        "content": "GenAI has revolutionized how we approach customer service. The automated responses are indistinguishable from human agents.",
        "rating": 5
    },
    {
        "id": "testimonial-2",
        "author": "Sarah Johnson",
        "company": "Data Analytics Partners",
        "content": "The predictive models from GenAI have improved our forecasting accuracy by 47%. A game-changer for our business.",
        "rating": 4.5
    },
    {
        "id": "testimonial-3",
        "author": "Michael Chen",
        "company": "Global Media Solutions",
        "content": "We've been able to scale our content creation tenfold with GenAI. The quality is consistently excellent.",
        "rating": 5
    }
]

CONTACT_INFO = {
    "email": "contact@genai-solutions.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 AI Boulevard, Silicon Valley, CA 94025"
}

PRICING = [
    {
        "id": 1,
        "name": "Basic",
        "price": 49,
        "period": "month",
        "features": ["Core AI features", "5 users", "Basic support"]
    },
    {
        "id": 2,
        "name": "Pro",
        "price": 99,
        "period": "month",
        "features": ["All Basic features", "25 users", "Priority support", "Advanced analytics"]
    },
    {
        "id": 3,
        "name": "Enterprise",
        "price": 249,
        "period": "month",
        "features": ["All Pro features", "Unlimited users", "24/7 support", "Custom integration"]
    }
]

@api_bp.route('/health', methods=['GET'])
def health_check():
    """API health check endpoint."""
    return jsonify({
        'status': 'ok',
        'message': 'API is operational'
    })

@api_bp.route('/hello', methods=['GET'])
def hello():
    """Simple endpoint to test API functionality"""
    return jsonify({"message": "Hello from GenAI Landing Page API!"})

@api_bp.route('/features', methods=['GET'])
def get_features():
    """
    Endpoint to retrieve the list of GenAI features.

    Returns:
        JSON object with features array
    """
    try:
        return jsonify({"success": True, "data": FEATURES}), 200
    except Exception as e:
        logging.error(f"Error retrieving features: {str(e)}")
        return jsonify({"success": False, "error": "Failed to retrieve features"}), 500

@api_bp.route('/use-cases', methods=['GET'])
def get_use_cases():
    """
    Get a list of GenAI use cases.

    Returns:
        JSON response containing use cases list.
    """
    logger.info("Fetching use cases list")
    return jsonify({"use_cases": USE_CASES})

@api_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    """
    Endpoint to retrieve testimonials for GenAI.

    Returns:
        JSON object with testimonials array
    """
    try:
        return jsonify({"success": True, "data": TESTIMONIALS}), 200
    except Exception as e:
        logging.error(f"Error retrieving testimonials: {str(e)}")
        return jsonify({"success": False, "error": "Failed to retrieve testimonials"}), 500

@api_bp.route('/contact', methods=['GET'])
def get_contact():
    """
    Endpoint to retrieve contact information.

    Returns:
        JSON object with contact details
    """
    try:
        return jsonify(CONTACT_INFO), 200
    except Exception as e:
        logging.error(f"Error retrieving contact information: {str(e)}")
        return jsonify({"error": "Failed to retrieve contact information"}), 500

@api_bp.route('/contact', methods=['POST'])
def contact():
    """Endpoint to handle contact form submissions"""
    try:
        # Get request data
        data = request.get_json()

        # Check if data exists
        if not data:
            logger.warning("Contact form submission with empty data")
            raise BadRequest("Missing request data")

        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data or not data[field].strip():
                logger.warning(f"Contact form missing required field: {field}")
                return jsonify({
                    "success": False, 
                    "error": f"The {field} field is required."
                }), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            logger.warning(f"Invalid email format: {data['email']}")
            return jsonify({
                "success": False,
                "error": "Please provide a valid email address."
            }), 400

        # Check message length
        if len(data['message']) < 10:
            return jsonify({
                "success": False,
                "error": "Message must be at least 10 characters long."
            }), 400

        # Log the contact form submission
        logger.info(f"Contact form submission received from {data['name']} ({data['email']})")

        # In a real application, we would process the form data here
        # e.g., send email, store in database, etc.

        return jsonify({
            "success": True,
            "message": "Thank you for your message! We will get back to you soon."
        })
    except BadRequest as e:
        logger.warning(f"Bad request in contact form: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/pricing', methods=['GET'])
def get_pricing():
    """Return pricing information"""
    try:
        return jsonify({"success": True, "data": PRICING}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/subscribe', methods=['POST'])
def subscribe_newsletter():
    try:
        data = request.get_json()

        # Validate email field
        if 'email' not in data or not data['email']:
            return jsonify({"success": False, "error": "Email is required"}), 400

        # Simple email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({"success": False, "error": "Invalid email format"}), 400

        # In a real application, you would save this to a database
        return jsonify({"success": True, "message": "Subscribed to newsletter successfully"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Error handlers for the API blueprint
@api_bp.errorhandler(400)
def handle_bad_request(e):
    """Handle 400 Bad Request errors."""
    logger.warning(f"Bad request: {str(e)}")
    return jsonify({
        "success": False,
        "error": str(e),
        "code": 400
    }), 400

@api_bp.errorhandler(404)
def not_found(e):
    """Handle 404 errors for API routes."""
    return jsonify({"success": False, "error": "Resource not found"}), 404

@api_bp.errorhandler(405)
def handle_method_not_allowed(e):
    """Handle 405 Method Not Allowed errors."""
    logger.warning(f"Method not allowed: {request.method} {request.path}")
    return jsonify({
        "success": False,
        "error": f"Method {request.method} not allowed",
        "code": 405
    }), 405

@api_bp.errorhandler(500)
def server_error(e):
    """Handle 500 errors for API routes."""
    logger.error(f"Internal server error: {str(e)}", exc_info=True)
    return jsonify({"success": False, "error": "Internal server error"}), 500

@api_bp.errorhandler(HTTPException)
def handle_http_exception(e):
    """Handle HTTP exceptions"""
    response = e.get_response()
    response.data = json.dumps({
        "success": False,
        "error": e.description,
        "code": e.code
    })
    response.content_type = "application/json"
    return response

@api_bp.errorhandler(Exception)
def handle_exception(e):
    """Handle non-HTTP exceptions"""
    return jsonify({
        "success": False,
        "error": "Internal server error",
        "details": str(e)
    }), 500
