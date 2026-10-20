"""
Pytest configuration and fixtures for ConnectSign Backend tests.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="session")
def client():
    """Session-scoped test client that executes the FastAPI lifespan context."""
    with TestClient(app) as c:
        yield c
