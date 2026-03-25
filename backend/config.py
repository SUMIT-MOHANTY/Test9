"""
Configuration settings for the Flask application.

This module defines configuration classes for different environments
(development, testing, production) and loads environment variables.
"""

import os
from typing import List, Dict, Any, Union
from datetime import timedelta

class Config:
    """Base configuration class with common settings."""
    # Application settings
    VERSION = '1.0.0'
    ENVIRONMENT = os.environ.get('FLASK_ENV', 'development')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_key_for_development_only')
    DEBUG = False
    TESTING = False

    # API configuration
    API_TITLE = 'GenAI Landing Page API'
    API_VERSION = 'v1'
    API_PREFIX = '/api'

    # Application directories
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_FOLDER = os.path.join(BASE_DIR, 'static')
    TEMPLATES_FOLDER = os.path.join(BASE_DIR, 'templates')

    # Security settings
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    CORS_HEADERS = 'Content-Type'

    # Rate limiting
    ENABLE_RATE_LIMITING = True

    # Validation settings
    EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # Logging configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

    # Email configuration for contact form
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.example.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', True)
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'user@example.com')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'password')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@genai.com')

    @staticmethod
    def init_app(app):
        """Initialize app with this configuration."""
        pass

class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True
    TESTING = False
    ENV = 'development'
    ENABLE_RATE_LIMITING = False
    CORS_ORIGINS = '*'  # Allow all origins in development

    @staticmethod
    def init_app(app):
        """Initialize app with development configuration."""
        Config.init_app(app)
        app.logger.info('Development configuration loaded')

class TestingConfig(Config):
    """Testing environment configuration."""
    TESTING = True
    DEBUG = True
    ENV = 'testing'
    ENABLE_RATE_LIMITING = False

    @staticmethod
    def init_app(app):
        """Initialize app with testing configuration."""
        Config.init_app(app)
        app.logger.info('Testing configuration loaded')

class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG = False
    TESTING = False
    ENV = 'production'
    # In production, use environment variable for secret key
    SECRET_KEY = os.getenv('SECRET_KEY')  # Must be set in production
    # Restrict CORS in production to specific domains
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'https://yourdomain.com').split(',')

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        # Validate production configuration
        if app.config['SECRET_KEY'] == 'dev_key_for_development_only':
            app.logger.error('SECRET_KEY not configured for production!')

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
        app.logger.info('Production configuration loaded')

# Configuration dictionary mapping environment names to config classes
config_by_name: Dict[str, Any] = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# Export the appropriate configuration based on FLASK_ENV
env = os.environ.get('FLASK_ENV', 'development')
current_config = config_by_name.get(env, DevelopmentConfig)
