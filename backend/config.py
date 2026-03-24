"""
Configuration settings for the Flask application.
This file contains different configuration classes for various environments.
"""
import os

class Config:
    """Base configuration class with common settings."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-for-genai-landing-page')
    DEBUG = False
    TESTING = False
    # Enable Cross-Origin Resource Sharing
    CORS_HEADERS = 'Content-Type'

class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True
    ENV = 'development'

class TestingConfig(Config):
    """Testing environment configuration."""
    DEBUG = True
    TESTING = True
    ENV = 'testing'

class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG = False
    ENV = 'production'
    # In production, use a secure secret key
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'production-key-should-be-set-as-env-var'

# Configuration dictionary to easily select environment
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
