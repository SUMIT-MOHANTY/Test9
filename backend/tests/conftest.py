"""
Pytest configuration for testing the Flask application.
"""
import pytest
from backend.app import create_app

@pytest.fixture
def app():
    """Create a Flask app configured for testing."""
    app = create_app('testing')
    return app

@pytest.fixture
def client(app):
    """Create a test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Create a test CLI runner for the app."""
    return app.test_cli_runner()
