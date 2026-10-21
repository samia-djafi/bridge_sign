"""
ConnectSign Deployment Integrity and Production Readiness Tests.

Validates:
1. Self-contained ML inference without external repository dependencies.
2. Dynamic CORS configuration parsing from environment variables.
3. Payload safety limits (frame count limits and input rejection).
4. Unicode / Arabic label integrity across all 32 classes.
"""

import json
import pytest
from app.core.config import Settings
from app.schemas.recognition import RecognitionRequest
from app.services.inference import inference_service


def test_cors_settings_parsing():
    """Verify CORS_ORIGINS parses JSON lists, comma-separated strings, and single URLs."""
    # Comma-separated
    s_csv = Settings(CORS_ORIGINS="https://app.vercel.app, https://test.local")
    assert s_csv.CORS_ORIGINS == ["https://app.vercel.app", "https://test.local"]

    # JSON formatted
    s_json = Settings(CORS_ORIGINS='["https://app.vercel.app", "http://localhost:3000"]')
    assert s_json.CORS_ORIGINS == ["https://app.vercel.app", "http://localhost:3000"]

    # Single origin
    s_single = Settings(CORS_ORIGINS="https://connectsign.vercel.app")
    assert s_single.CORS_ORIGINS == ["https://connectsign.vercel.app"]

    # Native list
    s_list = Settings(CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"])
    assert s_list.CORS_ORIGINS == ["http://localhost:5173", "http://localhost:3000"]

    # Trailing slashes stripped
    s_slash = Settings(CORS_ORIGINS="https://app.vercel.app/, https://test.local/")
    assert s_slash.CORS_ORIGINS == ["https://app.vercel.app", "https://test.local"]

    # Quoted string elements stripped
    s_quotes = Settings(CORS_ORIGINS='"https://app.vercel.app", "http://localhost:3000"')
    assert s_quotes.CORS_ORIGINS == ["https://app.vercel.app", "http://localhost:3000"]

    # Scheme auto-prefixing for bare hostnames
    s_bare = Settings(CORS_ORIGINS="connect-sign-nine.vercel.app")
    assert "https://connect-sign-nine.vercel.app" in s_bare.CORS_ORIGINS

    # Empty string fallback to safe defaults
    s_empty = Settings(CORS_ORIGINS="")
    assert "http://localhost:5173" in s_empty.CORS_ORIGINS


def test_request_max_frames_validation(client):
    """Verify that requests exceeding 120 frames are rejected with 422 to prevent OOM."""
    large_payload = {
        "lang": "fr",
        "frames": [{"dummy": i} for i in range(125)],
    }
    response = client.post("/v1/recognize", json=large_payload)
    assert response.status_code == 422
    err_body = response.json()
    assert "detail" in err_body


def test_model_loaded_and_vocabulary_integrity(client):
    """Verify that the loaded model contains exactly 32 classes with verified Arabic labels."""
    assert inference_service.is_ready is True
    assert len(inference_service.target_names) == 32

    # Verify sample classes are valid Arabic strings
    assert "ألم" in inference_service.target_names
    assert "خطر" in inference_service.target_names
    assert "ماء" in inference_service.target_names
    assert "طبيب أسنان" in inference_service.target_names


def test_self_contained_classifier():
    """Verify the self-contained SignClassifier runs CPU inference on dummy features."""
    import numpy as np
    dummy_feat = np.random.randn(1, 3453).astype(np.float32)
    probs = inference_service.classifier.predict_proba(dummy_feat)[0]
    assert probs.shape == (32,)
    assert 0.999 <= float(np.sum(probs)) <= 1.001
