"""
Middleware functions for additional security and validation.
"""
from functools import wraps
from flask import request, abort, current_app
import re
import bleach
import logging

logger = logging.getLogger(__name__)

def sanitize_input(text):
    """Sanitize user input to prevent XSS attacks."""
    if text is None:
        return None
    return bleach.clean(str(text), strip=True)

def validate_request(f):
    """Decorator to validate and sanitize incoming request data."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.is_json:
            data = request.get_json()
            if isinstance(data, dict):
                # Sanitize each string value in the JSON
                for key, value in data.items():
                    if isinstance(value, str):
                        data[key] = sanitize_input(value)

        # Sanitize form data
        if request.form:
            for key, value in request.form.items():
                if isinstance(value, str):
                    request.form[key] = sanitize_input(value)

        # Sanitize query parameters
        if request.args:
            for key, value in request.args.items():
                if isinstance(value, str):
                    request.args[key] = sanitize_input(value)

        return f(*args, **kwargs)
    return decorated_function

def check_content_type(content_type):
    """Decorator to enforce specific Content-Type."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.content_type or content_type not in request.content_type:
                logger.warning(f"Invalid Content-Type: {request.content_type}")
                abort(415, description=f"Content-Type must be {content_type}")
            return f(*args, **kwargs)
        return decorated_function
    return decorator
