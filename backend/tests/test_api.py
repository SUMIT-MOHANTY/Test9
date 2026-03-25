"""
Tests for API endpoints.
"""
import json
import pytest

def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'

def test_features_endpoint(client):
    """Test the features endpoint."""
    response = client.get('/api/features')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'features' in data
    assert len(data['features']) > 0

def test_contact_form_valid(client):
    """Test valid contact form submission."""
    response = client.post(
        '/api/contact',
        data=json.dumps({
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'This is a test message that is long enough.'
        }),
        content_type='application/json'
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True

def test_contact_form_invalid_email(client):
    """Test contact form with invalid email."""
    response = client.post(
        '/api/contact',
        data=json.dumps({
            'name': 'Test User',
            'email': 'invalid-email',
            'message': 'This is a test message.'
        }),
        content_type='application/json'
    )
    assert response.status_code == 400

def test_contact_form_missing_fields(client):
    """Test contact form with missing required fields."""
    response = client.post(
        '/api/contact',
        data=json.dumps({
            'name': 'Test User',
            # Missing email and message
        }),
        content_type='application/json'
    )
    assert response.status_code == 400
