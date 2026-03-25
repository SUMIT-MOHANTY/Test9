from flask import Blueprint, jsonify, request, abort
import json
import os
from werkzeug.exceptions import HTTPException

bp = Blueprint('api', __name__)

# Sample data - in a real application, this would come from a database
FEATURES = [
    {
        "id": 1,
        "title": "AI-Powered Analysis",
        "description": "Leverage cutting-edge machine learning to extract insights from your data.",
        "icon": "analytics"
    },
    {
        "id": 2,
        "title": "Natural Language Processing",
        "description": "Transform text into actionable intelligence with our NLP engine.",
        "icon": "language"
    },
    {
        "id": 3,
        "title": "Personalized Recommendations",
        "description": "Tailored suggestions based on user behavior and preferences.",
        "icon": "recommend"
    }
]

TESTIMONIALS = [
    {
        "id": 1,
        "name": "John Smith",
        "company": "Tech Innovators Inc.",
        "quote": "This platform revolutionized how we approach data analysis.",
        "avatar": "avatar1.jpg"
    },
    {
        "id": 2,
        "name": "Sarah Johnson",
        "company": "Data Solutions Ltd.",
        "quote": "The AI capabilities have transformed our decision-making process.",
        "avatar": "avatar2.jpg"
    }
]

@bp.route('/features', methods=['GET'])
def get_features():
    """Return all available features"""
    try:
        return jsonify({"success": True, "data": FEATURES}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    """Return all testimonials"""
    try:
        return jsonify({"success": True, "data": TESTIMONIALS}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route('/contact', methods=['POST'])
def submit_contact():
    """Process contact form submission"""
    try:
        data = request.json

        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400

        # Validate email format (basic validation)
        if '@' not in data['email'] or '.' not in data['email']:
            return jsonify({
                "success": False,
                "error": "Invalid email format"
            }), 400

        # In a real app, you would save this to a database
        # For now, just return success
        return jsonify({
            "success": True,
            "message": "Contact form submitted successfully"
        }), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route('/pricing', methods=['GET'])
def get_pricing():
    """Return pricing information"""
    try:
        pricing = [
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
        return jsonify({"success": True, "data": pricing}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Error handlers
@bp.errorhandler(HTTPException)
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

@bp.errorhandler(Exception)
def handle_exception(e):
    """Handle non-HTTP exceptions"""
    return jsonify({
        "success": False,
        "error": "Internal server error",
        "details": str(e)
    }), 500
