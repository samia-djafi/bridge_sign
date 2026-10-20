"""
Local development server launcher for ConnectSign AI Backend.
"""

import os
import sys

# Ensure backend root in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import uvicorn

if __name__ == "__main__":
    print("Starting ConnectSign AI FastAPI server on http://127.0.0.1:8000 ...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, log_level="info")
