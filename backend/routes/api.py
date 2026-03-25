from flask import Blueprint, jsonify, request
import traceback

api_bp = Blueprint('api', __name__)

# Sample data - in a real app, this would come from a database
features = [
    {
        "id": 1,
        "title": "AI-Powered Insights",
        "description": "Get real-time insights powered by advanced artificial intelligence algorithms.",
        "icon": "lightbulb"
    },
    {
        "id": 2,
        "title": "Natural Language Processing",
        "description": "Process and understand natural language with state-of-the-art NLP techniques.",
        "icon": "message"
    },
    {
        "id": 3,
        "title": "Automated Workflows",
        "description": "Automate repetitive tasks and focus on what matters most to your business.",
        "icon": "sync"
    }
]

testimonials = [
    {
        "id": 1,
        "name": "Sarah Johnson",
        "company": "TechCorp Inc.",
        "quote": "This AI solution has transformed how we analyze customer data. Highly recommended!",
        "avatar": "avatar1"
    },
    {
        "id": 2,
        "name": "Michael Chen",
        "company": "Innovate Partners",
        "quote": "The insights we've gained have directly contributed to our 40% growth this year.",
        "avatar": "avatar2"
    }
]

@api_bp.route('/features', methods=['GET'])
def get_features():
    """Returns all available features"""
    try:
        return jsonify({"success": True, "data": features})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/features/<int:feature_id>', methods=['GET'])
def get_feature(feature_id):
    """Returns a specific feature by ID"""
    try:
        feature = next((f for f in features if f["id"] == feature_id), None)
        if feature:
            return jsonify({"success": True, "data": feature})
        return jsonify({"success": False, "error": "Feature not found"}), 404
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    """Returns all testimonials"""
    try:
        return jsonify({"success": True, "data": testimonials})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/contact', methods=['POST'])
def submit_contact():
    """Handles contact form submissions"""
    try:
        data = request.json
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400

        # In a real application, you would save this to a database
        # and perhaps send an email notification

        print(f"Contact form submission: {data}")

        return jsonify({
            "success": True,
            "message": "Thank you for your message. We'll be in touch soon!"
        })
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({"status": "healthy"})
