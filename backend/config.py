import os

class Config:
    """Base configuration class for the Flask application"""
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

    # Application directories
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_FOLDER = os.path.join(BASE_DIR, 'static')
    TEMPLATES_FOLDER = os.path.join(BASE_DIR, 'templates')

    # CORS settings - allow frontend to communicate with backend
    CORS_HEADERS = 'Content-Type'

    # Email configuration for contact form (to be implemented)
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
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

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

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
