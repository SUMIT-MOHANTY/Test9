"""
Configuration settings for the Flask application.

This module defines configuration classes for different environments
(development, testing, production) and loads environment variables.
"""

import os
from datetime import timedelta

class Config:
    """Base configuration class with common settings."""

    # General Flask config
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_key_for_development_only')
    DEBUG = False
    TESTING = False

    # API configuration
    API_TITLE = 'GenAI Landing Page API'
    API_VERSION = 'v1'

    # Security settings
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

    # CORS configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')

    # Rate limiting
    ENABLE_RATE_LIMITING = True

    # Logging configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

    @staticmethod
    def init_app(app):
        """Initialize app with this configuration."""
        pass

class DevelopmentConfig(Config):
    """Development environment configuration."""

    DEBUG = True
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
    ENABLE_RATE_LIMITING = False

    @staticmethod
    def init_app(app):
        """Initialize app with testing configuration."""
        Config.init_app(app)
        app.logger.info('Testing configuration loaded')

class ProductionConfig(Config):
    """Production environment configuration."""

    DEBUG = False
    SECRET_KEY = os.getenv('SECRET_KEY')  # Must be set in production
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'https://example.com,https://www.example.com').split(',')

    @staticmethod
    def init_app(app):
        """Initialize app with production configuration."""
        Config.init_app(app)

        # Validate production configuration
        if app.config['SECRET_KEY'] == 'dev_key_for_development_only':
            app.logger.error('SECRET_KEY not configured for production!')

        app.logger.info('Production configuration loaded')

# Configuration dictionary mapping environment names to config classes
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,

    # Default to development if not specified
    'default': DevelopmentConfig
}
