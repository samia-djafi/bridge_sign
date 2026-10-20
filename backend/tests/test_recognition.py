"""
Tests for Recognition Prediction Endpoints and Uncertainty Rejection.
"""

from fastapi.testclient import TestClient
from app.main import app

def test_recognize_missing_frames(client):
    """Verify POST /v1/recognize rejects invalid payload lacking required 'frames'."""
    response = client.post("/v1/recognize", json={"lang": "fr"})
    assert response.status_code == 422


def test_recognize_empty_frames(client):
    """Verify POST /v1/recognize returns safe rejected result on empty frames list."""
    payload = {"lang": "fr", "frames": []}
    response = client.post("/v1/recognize", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["signs"] == []
    assert data["sequence"] == []
    assert data["overallConfidence"] == 0.0
    assert data["level"] == "low"
    assert data["isUncertain"] is True
    assert data["rejectionMessage"] == "Sign not recognized. Please try again."


def test_recognize_synthetic_landmarks(client):
    """Verify POST /v1/recognize with 16 synthetic LandmarkFrames returns valid response schema."""
    frames = [
        {
            "t": i * 60,
            "hands": [[{"x": 0.5 + 0.005 * j, "y": 0.5 + 0.005 * j, "z": 0.0} for j in range(21)]],
            "pose": [{"x": 0.5, "y": 0.3, "z": 0.0} for _ in range(33)],
        }
        for i in range(16)
    ]
    payload = {"lang": "fr", "frames": frames}
    response = client.post("/v1/recognize", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "overallConfidence" in data
    assert "level" in data
    assert "isUncertain" in data
    assert data["frames"] == 16
    assert data["adapter"] == "live"
    assert "topCandidates" in data
    assert "model" in data


def test_recognize_blank_base64_rejection(client):
    """Verify that 16 black/blank image frames with no hands are rejected with low confidence."""
    import base64
    import cv2
    import numpy as np

    frames = []
    for _ in range(16):
        img = np.zeros((120, 160, 3), dtype=np.uint8)
        _, buf = cv2.imencode(".jpg", img)
        b64 = "data:image/jpeg;base64," + base64.b64encode(buf).decode("ascii")
        frames.append(b64)

    payload = {"lang": "fr", "frames": frames}
    response = client.post("/v1/recognize", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["isUncertain"] is True
    assert data["level"] == "low"
    assert data["signs"] == []
    assert data["rejectionMessage"] == "Sign not recognized. Please try again."
