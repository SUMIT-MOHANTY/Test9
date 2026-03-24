from flask import jsonify, request
from . import api_bp

@api_bp.route('/hello', methods=['GET'])
def hello():
    """Simple endpoint to test API functionality"""
    return jsonify({"message": "Hello from GenAI Landing Page API!"})

@api_bp.route('/contact', methods=['POST'])
def contact():
    """Endpoint to handle contact form submissions"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # In a real application, we would process the form data here
        # e.g., send email, store in database, etc.

        return jsonify({
            "success": True,
            "message": "Thank you for your message! We will get back to you soon."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
