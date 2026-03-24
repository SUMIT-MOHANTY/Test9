"""
API routes for the GenAI Landing Page.
This module defines the API endpoints that provide data to the frontend.
"""
import logging
from flask import jsonify
from . import api_bp

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

@api_bp.route('/features', methods=['GET'])
def get_features():
    """
    Endpoint to retrieve the list of GenAI features.

    Returns:
        JSON object with features array
    """
    try:
        return jsonify({"features": FEATURES}), 200
    except Exception as e:
        logging.error(f"Error retrieving features: {str(e)}")
        return jsonify({"error": "Failed to retrieve features"}), 500

@api_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    """
    Endpoint to retrieve testimonials for GenAI.

    Returns:
        JSON object with testimonials array
    """
    try:
        return jsonify({"testimonials": TESTIMONIALS}), 200
    except Exception as e:
        logging.error(f"Error retrieving testimonials: {str(e)}")
        return jsonify({"error": "Failed to retrieve testimonials"}), 500

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

# Error handlers for the API blueprint
@api_bp.errorhandler(404)
def not_found(e):
    """Handle 404 errors for API routes."""
    return jsonify({"error": "Resource not found"}), 404

@api_bp.errorhandler(500)
def server_error(e):
    """Handle 500 errors for API routes."""
    return jsonify({"error": "Internal server error"}), 500
