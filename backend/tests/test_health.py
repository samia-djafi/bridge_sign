"""
Tests for Health and Readiness Check Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_health_endpoint(client):
    """Verify GET /health returns 200, valid structure, and honest model readiness."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()

    assert data["service"] == "ConnectSign AI Recognition API"
    assert "status" in data
    assert "model_loaded" in data
    assert "version" in data
    assert "timestamp" in data
    assert data["device"] == "cpu"

    if data["model_loaded"]:
        assert data["status"] == "ok"
        assert data["active_vocabulary_classes"] > 0
    else:
        assert data["status"] == "degraded"
        assert data["active_vocabulary_classes"] == 0


def test_root_endpoint(client):
    """Verify GET / is an alias for /health."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "ConnectSign AI Recognition API"
