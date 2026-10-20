"""
Tests for Phrasebook and Sequence Alignment Endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app

def test_list_phrases(client):
    """Verify GET /v1/phrases returns all seed phrases."""
    response = client.get("/v1/phrases")
    assert response.status_code == 200
    data = response.json()
    assert "total_phrases" in data
    assert "phrases" in data
    assert data["total_phrases"] >= 20


def test_match_phrases_exact(client):
    """Verify POST /v1/match finds exact match for single-sign sequence."""
    payload = {"signs": ["PAIN"]}
    response = client.post("/v1/match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "matches" in data
    assert len(data["matches"]) > 0
    assert data["matches"][0]["match_type"] == "EXACT"
    assert data["matches"][0]["phrase"]["id"] == "ph_pain"


def test_match_phrases_empty(client):
    """Verify POST /v1/match handles empty sequence safely."""
    payload = {"signs": []}
    response = client.post("/v1/match", json=payload)
    assert response.status_code == 200
    assert response.json()["matches"] == []
