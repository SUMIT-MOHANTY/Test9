"""
API endpoints implementation.

This module defines the API routes for the GenAI landing page,
including endpoints for features, use cases, and contact form submissions.
"""

import re
import logging
from flask import Blueprint, jsonify, request, current_app
from werkzeug.exceptions import BadRequest

# Create API Blueprint
api_bp = Blueprint('api', __name__)
logger = logging.getLogger(__name__)

# Sample data for development
FEATURES = [
    {
        "id": "natural-language",
        "title": "Natural Language Processing",
        "description": "Advanced algorithms that understand and generate human language with remarkable accuracy and context-awareness.",
        "icon": "chat-text"
    },
    {
        "id": "image-generation",
        "title": "Image Generation",
        "description": "Create stunning, realistic images from text descriptions using state-of-the-art generative models.",
        "icon": "image"
    },
    {
        "id": "predictive-analysis",
        "title": "Predictive Analysis",
        "description": "Harness the power of machine learning to predict trends and make data-driven decisions with confidence.",
        "icon": "graph-up"
    },
    {
        "id": "automated-summarization",
        "title": "Automated Summarization",
        "description": "Instantly extract key information from large documents and generate concise, accurate summaries.",
        "icon": "file-text"
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

@api_bp.route('/features', methods=['GET'])
def get_features():
    """
    Get a list of GenAI features.

    Returns:
        JSON response containing features list.
    """
    logger.info("Fetching features list")
    return jsonify({"features": FEATURES})

@api_bp.route('/use-cases', methods=['GET'])
def get_use_cases():
    """
    Get a list of GenAI use cases.

    Returns:
        JSON response containing use cases list.
    """
    logger.info("Fetching use cases list")
    return jsonify({"use_cases": USE_CASES})

@api_bp.route('/contact', methods=['POST'])
def submit_contact():
    """
    Handle contact form submissions.

    Request JSON body:
        name: string - Name of the person contacting
        email: string - Email address
        message: string - Contact message

    Returns:
        JSON response indicating success or failure.
    """
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
            if field not in data or not data[field]:
                logger.warning(f"Contact form missing required field: {field}")
                return jsonify({
                    "success": False,
                    "message": f"The {field} field is required."
                }), 400

        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            logger.warning(f"Invalid email format: {data['email']}")
            return jsonify({
                "success": False,
                "message": "Please provide a valid email address."
            }), 400

        # Check message length
        if len(data['message']) < 10:
            return jsonify({
                "success": False,
                "message": "Message must be at least 10 characters long."
            }), 400

        # Log the contact form submission
        logger.info(f"Contact form submission received from {data['name']} ({data['email']})")

        # In a real application, you would process the submission here
        # For example, send an email, save to database, etc.
        # For this demo, we'll just return success

        return jsonify({
            "success": True,
            "message": "Thank you for your message! We'll get back to you soon."
        })

    except BadRequest as e:
        logger.warning(f"Bad request in contact form: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": "An error occurred while processing your request. Please try again later."
        }), 500

# Error handlers for the blueprint
@api_bp.errorhandler(400)
def handle_bad_request(e):
    """Handle 400 Bad Request errors."""
    logger.warning(f"Bad request: {str(e)}")
    return jsonify({
        "error": True,
        "message": str(e),
        "status_code": 400
    }), 400

@api_bp.errorhandler(404)
def handle_not_found(e):
    """Handle 404 Not Found errors."""
    logger.info(f"Resource not found: {request.path}")
    return jsonify({
        "error": True,
        "message": "Resource not found",
        "status_code": 404
    }), 404

@api_bp.errorhandler(405)
def handle_method_not_allowed(e):
    """Handle 405 Method Not Allowed errors."""
    logger.warning(f"Method not allowed: {request.method} {request.path}")
    return jsonify({
        "error": True,
        "message": f"Method {request.method} not allowed",
        "status_code": 405
    }), 405

@api_bp.errorhandler(500)
def handle_server_error(e):
    """Handle 500 Internal Server Error."""
    logger.error(f"Internal server error: {str(e)}", exc_info=True)
    return jsonify({
        "error": True,
        "message": "Internal server error",
        "status_code": 500
    }), 500
