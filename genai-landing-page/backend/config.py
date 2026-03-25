import os

class Config:
    """Configuration settings for the Flask application."""

    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-please-change-in-production')
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'

    # API settings
    API_TITLE = 'GenAI Landing Page API'
    API_VERSION = 'v1'

    # Service settings
    CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'example@genai-landing.com')

    # Default AI model features to display on landing page
    DEFAULT_FEATURES = [
        {
            'id': 1,
            'name': 'Natural Language Processing',
            'description': 'Advanced NLP capabilities for understanding and generating human language.'
        },
        {
            'id': 2,
            'name': 'Computer Vision',
            'description': 'Image and video analysis with state-of-the-art deep learning models.'
        },
        {
            'id': 3,
            'name': 'Predictive Analytics',
            'description': 'Data-driven forecasting and decision support.'
        }
    ]

    # Demo request limits
    MAX_DEMO_REQUESTS_PER_DAY = 50
