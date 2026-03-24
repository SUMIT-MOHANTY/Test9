from flask import Blueprint, jsonify, request, current_app
import time
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
api_bp = Blueprint('api', __name__)

# Simple in-memory storage for demo purposes
# In a production app, you would use a database
demo_requests_count = {}
contact_submissions = []

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint to check if the API is running."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': current_app.config['API_VERSION']
    })

@api_bp.route('/features', methods=['GET'])
def get_features():
    """Return the list of AI features to display on the landing page."""
    try:
        features = current_app.config['DEFAULT_FEATURES']
        return jsonify({
            'success': True,
            'features': features
        })
    except Exception as e:
        logger.error(f"Error fetching features: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve features',
            'details': str(e)
        }), 500

@api_bp.route('/demo', methods=['POST'])
def request_demo():
    """Handle demo requests from users."""
    try:
        # Extract data from request
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['name', 'email', 'company']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Check for rate limiting
        ip_address = request.remote_addr
        today = datetime.now().strftime('%Y-%m-%d')
        key = f"{ip_address}:{today}"

        if key in demo_requests_count:
            demo_requests_count[key] += 1
        else:
            demo_requests_count[key] = 1

        # Check if limit exceeded
        if demo_requests_count[key] > current_app.config['MAX_DEMO_REQUESTS_PER_DAY']:
            logger.warning(f"Rate limit exceeded for {ip_address}")
            return jsonify({
                'success': False,
                'error': 'Rate limit exceeded. Please try again tomorrow.'
            }), 429

        # Process the demo request
        # In a real app, you might save this to a database and trigger an email
        logger.info(f"Demo request from {data['name']} at {data['company']}")

        return jsonify({
            'success': True,
            'message': 'Demo request received. Our team will contact you shortly.'
        })

    except Exception as e:
        logger.error(f"Error processing demo request: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to process demo request',
            'details': str(e)
        }), 500

@api_bp.route('/contact', methods=['POST'])
def submit_contact():
    """Handle contact form submissions."""
    try:
        # Extract data from request
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['name', 'email', 'message']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Basic email validation
        if '@' not in data['email'] or '.' not in data['email']:
            return jsonify({
                'success': False,
                'error': 'Invalid email address format'
            }), 400

        # Process the contact submission
        # In a real app, you might save this to a database and trigger an email
        submission = {
            'name': data['name'],
            'email': data['email'],
            'message': data['message'],
            'timestamp': datetime.now().isoformat(),
            'ip': request.remote_addr
        }

        contact_submissions.append(submission)
        logger.info(f"Contact form submission from {data['name']} ({data['email']})")

        return jsonify({
            'success': True,
            'message': 'Thank you for your message. We will respond shortly.'
        })

    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to process contact submission',
            'details': str(e)
        }), 500

@api_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    """Return customer testimonials for the landing page."""
    try:
        # In a real app, these would come from a database
        testimonials = [
            {
                'id': 1,
                'name': 'Jane Smith',
                'company': 'Tech Innovations Inc.',
                'quote': 'This AI solution has transformed our customer service operations.',
                'rating': 5
            },
            {
                'id': 2,
                'name': 'John Davis',
                'company': 'Data Analytics Pro',
                'quote': 'The predictive models have increased our forecasting accuracy by 45%.',
                'rating': 5
            },
            {
                'id': 3,
                'name': 'Sarah Johnson',
                'company': 'Global Solutions',
                'quote': 'Implementation was smooth and the results exceeded our expectations.',
                'rating': 4
            }
        ]
        return jsonify({
            'success': True,
            'testimonials': testimonials
        })
    except Exception as e:
        logger.error(f"Error fetching testimonials: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve testimonials',
            'details': str(e)
        }), 500
