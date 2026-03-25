"""
Configuration settings for the Flask application.
This module contains different configuration classes for various environments.
"""
import os
from typing import List, Dict, Any, Union

class Config:
    """Base configuration class with common settings"""
    # Application settings
    VERSION: str = '1.0.0'
    ENVIRONMENT: str = os.environ.get('FLASK_ENV', 'development')
    SECRET_KEY: str = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

    # CORS settings
    CORS_ORIGINS: List[str] = ['http://localhost:3000', 'http://localhost:5000']
    CORS_HEADERS: str = 'Content-Type'

    # API settings
    API_PREFIX: str = '/api'

    # Application directories
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_FOLDER = os.path.join(BASE_DIR, 'static')
    TEMPLATES_FOLDER = os.path.join(BASE_DIR, 'templates')

    # Validation settings
    EMAIL_REGEX: str = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # Logging settings
    LOG_LEVEL: str = os.environ.get('LOG_LEVEL', 'INFO')

    # Email configuration for contact form
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.example.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', True)
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'user@example.com')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'password')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@genai.com')

    @staticmethod
    def init_app(app):
        """Initialize application with this configuration"""
        pass

class DevelopmentConfig(Config):
    """Development environment configuration"""
    DEBUG: bool = True
    TESTING: bool = False
    ENV = 'development'

class TestingConfig(Config):
    """Testing environment configuration"""
    DEBUG: bool = False
    TESTING: bool = True
    ENV = 'testing'

class ProductionConfig(Config):
    """Production environment configuration"""
    DEBUG: bool = False
    TESTING: bool = False
    ENV = 'production'
    # In production, use environment variable for secret key
    SECRET_KEY: str = os.environ.get('SECRET_KEY', 'production-needs-real-secret')
    # Restrict CORS in production to specific domains
    CORS_ORIGINS: List[str] = [os.environ.get('FRONTEND_URL', 'https://yourdomain.com')]

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        # Log to stderr in production
        import logging
        from logging.handlers import RotatingFileHandler

        file_handler = RotatingFileHandler('app.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s '
            '[in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)

# Dictionary to map environment names to configuration classes
config_by_name: Dict[str, Any] = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# Export the appropriate configuration based on FLASK_ENV
env = os.environ.get('FLASK_ENV', 'development')
current_config = config_by_name.get(env, DevelopmentConfig)
