import pytest
from app import app as flask_app
import json

@pytest.fixture
def app():
    return flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_endpoint(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'

def test_features_endpoint(client):
    """Test the features endpoint."""
    response = client.get('/api/features')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'features' in data
    assert len(data['features']) > 0

def test_demo_endpoint_valid(client):
    """Test the demo endpoint with valid data."""
    test_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'company': 'Test Company'
    }
    response = client.post(
        '/api/demo',
        data=json.dumps(test_data),
        content_type='application/json'
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True

def test_demo_endpoint_invalid(client):
    """Test the demo endpoint with invalid data."""
    test_data = {
        'name': 'Test User'
        # Missing required fields
    }
    response = client.post(
        '/api/demo',
        data=json.dumps(test_data),
        content_type='application/json'
    )
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] is False
