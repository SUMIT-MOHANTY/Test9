from flask import Blueprint, request, jsonify

api_bp = Blueprint('api', __name__)

# Sample data for landing page
features = [
    {"id": 1, "title": "AI Chat", "description": "Engage with our advanced AI chatbot for instant assistance", "icon": "chat"},
    {"id": 2, "title": "Text Generation", "description": "Generate high-quality content with our AI models", "icon": "text"},
    {"id": 3, "title": "Image Creation", "description": "Create stunning visuals with our AI image generator", "icon": "image"},
]

testimonials = [
    {"id": 1, "name": "Jane Doe", "company": "Tech Innovations", "comment": "This GenAI platform transformed our content strategy.", "avatar": "avatar1"},
    {"id": 2, "name": "John Smith", "company": "Creative Solutions", "comment": "The AI capabilities exceed our expectations in every way.", "avatar": "avatar2"},
]

pricing = [
    {"id": 1, "name": "Basic", "price": "$9.99/month", "features": ["AI Chat", "5 Text Generations/day"]},
    {"id": 2, "name": "Pro", "price": "$19.99/month", "features": ["AI Chat", "20 Text Generations/day", "10 Image Generations/day"]},
    {"id": 3, "name": "Enterprise", "price": "$49.99/month", "features": ["AI Chat", "Unlimited Text Generations", "50 Image Generations/day", "Priority Support"]},
]

@api_bp.route('/features', methods=['GET'])
def get_features():
    try:
        return jsonify({"success": True, "data": features}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    try:
        return jsonify({"success": True, "data": testimonials}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/pricing', methods=['GET'])
def get_pricing():
    try:
        return jsonify({"success": True, "data": pricing}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400

        # In a real application, you would save this to a database
        # For now, we'll just return a success response
        return jsonify({"success": True, "message": "Contact form submitted successfully"}), 201
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
        email = data['email']
        if '@' not in email or '.' not in email:
            return jsonify({"success": False, "error": "Invalid email format"}), 400

        # In a real application, you would save this to a database
        return jsonify({"success": True, "message": "Subscribed to newsletter successfully"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_bp.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Resource not found"}), 404

@api_bp.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error"}), 500
