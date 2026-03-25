"""
Configuration settings for the Flask application.
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file if present

class Config:
    """Base configuration class."""
    # Security settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-CHANGE-IN-PRODUCTION'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # CORS settings (restrict in production)
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

    # Rate limiting settings
    RATELIMIT_DEFAULT = "100 per minute"
    RATELIMIT_STORAGE_URL = "memory://"

    # Misc settings
    DEBUG = False
    TESTING = False
    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    # In production, require proper secret keys
    @classmethod
    def init_app(cls, app):
        # Validate critical config in production
        assert os.environ.get('SECRET_KEY'), "SECRET_KEY must be set in production"
        assert os.environ.get('JWT_SECRET_KEY'), "JWT_SECRET_KEY must be set in production"
        assert os.environ.get('CORS_ORIGINS'), "CORS_ORIGINS must be explicitly set in production"

        # Use secure cookies
        app.config['SESSION_COOKIE_SECURE'] = True
        app.config['SESSION_COOKIE_HTTPONLY'] = True
        app.config['REMEMBER_COOKIE_SECURE'] = True
        app.config['REMEMBER_COOKIE_HTTPONLY'] = True

        # More restrictive CORS in production
        if '*' in cls.CORS_ORIGINS:
            raise ValueError("Wildcard CORS origin not allowed in production")

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Returns the appropriate configuration based on environment."""
    env = os.environ.get('FLASK_ENV', 'default')
    return config.get(env, config['default'])
