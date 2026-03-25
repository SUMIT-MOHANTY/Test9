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

    # API settings
    API_PREFIX: str = '/api'

    # Validation settings
    EMAIL_REGEX: str = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # Logging settings
    LOG_LEVEL: str = os.environ.get('LOG_LEVEL', 'INFO')

class DevelopmentConfig(Config):
    """Development environment configuration"""
    DEBUG: bool = True
    TESTING: bool = False

class TestingConfig(Config):
    """Testing environment configuration"""
    DEBUG: bool = False
    TESTING: bool = True

class ProductionConfig(Config):
    """Production environment configuration"""
    DEBUG: bool = False
    TESTING: bool = False
    # In production, use environment variable for secret key
    SECRET_KEY: str = os.environ.get('SECRET_KEY', 'production-needs-real-secret')
    # Restrict CORS in production to specific domains
    CORS_ORIGINS: List[str] = [os.environ.get('FRONTEND_URL', 'https://yourdomain.com')]

# Dictionary to map environment names to configuration classes
config_by_name: Dict[str, Any] = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}

# Export the appropriate configuration based on FLASK_ENV
env = os.environ.get('FLASK_ENV', 'development')
current_config = config_by_name.get(env, DevelopmentConfig)
