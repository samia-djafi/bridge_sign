# ConnectSign AI — FastAPI Recognition Backend

A CPU-optimized, local-first inference backend for **ConnectSign — Every Hand Has a Voice**, enabling real-time recognition of Algerian Sign Language (LSA / لغة الإشارة الجزائرية) isolated signs directly from webcam input.

---

## 1. Architectural Overview

```
Frontend (Vite / React PWA)
  │ (16-frame webcam JPEG stream or LandmarkFrame[])
  ▼
FastAPI Backend (POST /v1/recognize)
  ├── Pydantic Input Validation (schemas/recognition.py)
  ├── LandmarkFeatureExtractor (MediaPipe Tasks Hand & Pose)
  ├── Calibrated LinearSVC Classifier (models/best_model.joblib)
  ├── Uncertainty Gating (Rejection threshold: 0.12)
  └── Phrasebook Matcher (services/phrase_service.py)
  │
  ▼
RecognitionResponse (Predicted Sign + Gloss + Confidence + Phrase)
```

- **Framework**: FastAPI + Uvicorn + Pydantic v2.
- **Hardware Optimization**: CPU-only inference on Intel i5 with 8 GB RAM on Windows.
- **Inference Latency**: Under 1 ms for classification; ~850 ms for full 16-frame spatio-temporal video decoding and landmark extraction.
- **Zero Fabrication**: Rejects uncertain predictions with `"Sign not recognized. Please try again."` rather than hallucinating unsupported words.

---

## 2. Directory Layout

```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── health.py        # GET /health, GET /
│   │       ├── phrases.py       # GET /v1/phrases, POST /v1/match
│   │       └── recognition.py   # POST /v1/recognize
│   ├── core/
│   │   └── config.py            # Pydantic BaseSettings, CORS, thresholds
│   ├── ml/                      # Self-contained ML inference package
│   │   ├── classifier.py        # SignClassifier wrapper (LinearSVC + Scaler)
│   │   ├── frame_sampler.py     # Deterministic temporal frame sampling
│   │   └── feature_extractor.py # LandmarkFeatureExtractor (MediaPipe Tasks + dicts)
│   ├── schemas/
│   │   └── recognition.py       # Pydantic schemas (Request, Response, Signs)
│   ├── services/
│   │   ├── inference.py         # Singleton model loading, decoding, prediction
│   │   └── phrase_service.py    # 45 seed phrases & gloss mappings
│   ├── __init__.py
│   └── main.py                  # FastAPI initialization & lifespan
├── models/
│   ├── best_model.joblib        # Calibrated LinearSVC classifier (833 KB)
│   ├── config.json              # Hyperparameters & target class names
│   ├── mvp_classes.json         # Numerical IDs to Arabic sign mappings
│   ├── hand_landmarker.task     # MediaPipe Hand landmark model (7.8 MB)
│   ├── pose_landmarker_lite.task# MediaPipe Pose landmark model (5.8 MB)
│   └── README.md                # Model provenance and specification
├── scripts/
│   └── inspect_model.py         # Standalone model inspector & verification tool
├── tests/
│   ├── test_deployment_integrity.py # CORS parsing, safety limits, model integrity
│   ├── test_health.py           # Automated health & readiness test
│   ├── test_phrases.py          # Automated phrase listing & matching tests
│   └── test_recognition.py      # Automated input validation & rejection tests
├── .env.example                 # Safe environment configuration template
├── .gitignore                   # Exclusions for virtualenvs, caches, logs
├── README.md                    # This documentation
├── render.yaml                  # Render Infrastructure Blueprint configuration
├── requirements.txt             # CPU-friendly production Python dependencies
└── requirements-dev.txt         # Dev and test dependencies (pytest, httpx)
```

---

## 3. Prerequisites

- **Python**: 3.10 – 3.14 (64-bit).
- **OS**: Windows 10/11, macOS, or Linux.
- **RAM**: Minimum 4 GB (8 GB recommended).
- **GPU**: Not required (all features and models execute on CPU).

---

## 4. Local Installation & Startup

### Step 1: Create or Activate Virtual Environment
From PowerShell in the `d:\Awal\backend` directory:

```powershell
cd d:\Awal\backend

# Using existing shared .venv or creating a new one:
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Step 2: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 3: Inspect Model Artifacts
```powershell
python scripts/inspect_model.py --model-dir models
```

### Step 4: Run Automated Tests
```powershell
pytest tests/ -v
```

### Step 5: Start the Backend Server
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 5. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Readiness probe. Returns API status, model loaded state, class count, and device. |
| `GET` | `/v1/phrases` | Returns the 45 healthcare seed phrases with vocabulary coverage analysis. |
| `POST` | `/v1/match` | Matches a sequence of sign tokens (e.g. `["PAIN"]`) against phrasebook templates. |
| `POST` | `/v1/recognize` | Ingests 16 webcam image frames (base64) or LandmarkFrames; returns detected sign, confidence, and matched phrase. |
| `GET` | `/docs` | Interactive Swagger / OpenAPI documentation UI. |
| `GET` | `/redoc` | Interactive ReDoc API specification. |

---

## 6. Target Vocabulary & Dataset Evidence

The backend supports **32 verified Algerian Sign Language classes** derived from the VDzSL benchmark (Zenodo DOI: `10.5281/zenodo.18209839`), including the **10 MVP Target Signs**:

1. **HELP** (`يساعد`) — 20 verified samples (4 signers $\times$ 5 cameras)
2. **PAIN** (`ألم`) — 20 verified samples
3. **EMERGENCY** (`خطر`) — 20 verified samples
4. **WATER** (`ماء`) — 20 verified samples
5. **THANK_YOU** (`شكرا`) — 20 verified samples
6. **FEVER** (`حرارة`) — 20 verified samples
7. **SICK** (`مريض`) — 20 verified samples
8. **HEAD / HEADACHE** (`رأس`) — 20 verified samples
9. **PLEASE** (`من فضلك`) — 20 verified samples
10. **YES** (`نعم`) — 20 verified samples

> **Linguistic Scope & Missing Signs**: The initial proposed signs *Doctor*, *Medicine*, *Pharmacy*, *Hospital*, and *Allergy* are absent from the VDzSL dataset. In accordance with medical communication safety rules, unrelated gestures are **never** relabeled as these concepts. The 5 missing signs are replaced by verified clinical signs present in Algerian Sign Language.

---

## 7. Known Limitations & Roadmap

1. **Isolated Signs Only**: The current model recognizes individual signs within a temporal window (16 frames, ~1.6 seconds). Continuous translation of multi-word sentences without pauses requires future CTC/HMM sequence segmentation models.
2. **Avatar Synthetic Gap**: The training dataset uses 3D animated avatars; real-world webcam conditions require consistent lighting and clear hand visibility.
3. **Communication Support Boundary**: The system is designed strictly for communication accessibility at pharmacy triage desks, not for autonomous medical diagnosis or dosage prescription.
