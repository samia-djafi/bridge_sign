# LSA Bridge — API Contract & Service Specification

## 1. Overview

LSA Bridge operates on a decoupled adapter architecture. In MVP mode, client requests are routed through a client-side mock adapter or a backend AI inference service adhering to the contracts detailed below.

- **Base URL (REST):** `http://localhost:8000/v1` (configured via `VITE_API_BASE_URL`)
- **WebSocket URL:** `ws://localhost:8000/ws/recognize` (configured via `VITE_WS_URL`)
- **Content-Type:** `application/json`
- **Protocol SLA:** End-to-end inference latency $\le$ 200ms per window; WebSocket streaming latency $\le$ 80ms.

---

## 2. Authentication & Headers

Production endpoints require a Bearer token or device session header:

```http
Authorization: Bearer <JWT_OR_API_KEY>
X-Client-Version: 0.1.0
X-Device-Platform: web-pwa
```

---

## 3. REST Endpoints

### 3.1 Recognize Sign Sequence

**Endpoint:** `POST /v1/recognize`  
**Description:** Evaluates a sequence of normalized landmark frames and returns recognized LSA signs with confidence metrics.

#### Request Body
```json
{
  "contextId": "healthcare-pharmacy",
  "windowFrames": 48,
  "fps": 30,
  "landmarks": [
    {
      "frameIndex": 0,
      "timestamp": 1728420000123,
      "pose": [
        { "x": 0.512, "y": 0.342, "z": -0.012, "visibility": 0.99 }
      ],
      "leftHand": [
        { "x": 0.420, "y": 0.610, "z": -0.005 }
      ],
      "rightHand": [
        { "x": 0.580, "y": 0.450, "z": -0.020 }
      ]
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "timestamp": 1728420000500,
  "inferenceMs": 42.5,
  "results": [
    {
      "glossId": "HEADACHE",
      "label": {
        "fr": "Mal de tête / Céphalée",
        "ar": "صداع / ألم في الرأس",
        "en": "Headache"
      },
      "confidence": 0.942,
      "tier": "high",
      "timestampStart": 1728420000123,
      "timestampEnd": 1728420000450
    }
  ],
  "alternatives": [
    {
      "glossId": "FEVER",
      "confidence": 0.124
    }
  ]
}
```

---

### 3.2 Synthesize Sentence from Glosses

**Endpoint:** `POST /v1/generate`  
**Description:** Synthesizes a natural, grammatically correct spoken/written sentence from confirmed LSA glosses for a given context and target language.

#### Request Body
```json
{
  "glosses": ["HEADACHE", "PAIN_SEVERE", "MEDICINE_WANT"],
  "targetLanguage": "fr",
  "contextId": "healthcare-pharmacy",
  "tone": "polite"
}
```

#### Response (200 OK)
```json
{
  "sentence": "J'ai un violent mal de tête, avez-vous un médicament approprié ?",
  "language": "fr",
  "confidence": 0.96,
  "alternativeSentences": [
    "J'ai très mal à la tête et j'ai besoin d'un médicament."
  ],
  "latencyMs": 85.0
}
```

---

### 3.3 Text to Sign Gloss Sequence

**Endpoint:** `POST /v1/text-to-sign`  
**Description:** Translates spoken or typed natural language into an ordered sequence of LSA glosses, parsing dosage and duration metadata when present.

#### Request Body
```json
{
  "text": "Prenez deux comprimés par jour pendant 5 jours",
  "sourceLanguage": "fr",
  "contextId": "healthcare-pharmacy"
}
```

#### Response (200 OK)
```json
{
  "matched": true,
  "confidence": 0.98,
  "strategy": "pattern-extraction",
  "glossSequence": ["TAKE_PILL", "DOSE_TWO", "PER_DAY", "DURATION_FIVE_DAYS"],
  "signs": [
    {
      "glossId": "TAKE_PILL",
      "duration": 1800,
      "clipUrl": "/signs/take_pill.webm",
      "caption": {
        "fr": "Prendre le comprimé",
        "ar": "تناول القرص",
        "en": "Take pill"
      }
    },
    {
      "glossId": "DOSE_TWO",
      "duration": 1400,
      "clipUrl": "/signs/dose_two.webm",
      "caption": {
        "fr": "2 comprimés",
        "ar": "قرصان",
        "en": "2 pills"
      }
    }
  ]
}
```

---

## 4. WebSocket Streaming Protocol (`/ws/recognize`)

For real-time continuous tracking, the client establishes a bidirectional WebSocket channel.

### 4.1 Client Initialization
```json
{
  "type": "INIT_SESSION",
  "sessionId": "ses_01j7xyz...",
  "contextId": "healthcare-pharmacy",
  "modelTier": "edge-light",
  "fps": 30
}
```

### 4.2 Client Frame Packet (Every frame or keyframe)
```json
{
  "type": "FRAME_LANDMARKS",
  "seq": 1042,
  "timestamp": 1728420002100,
  "handsDetected": 2,
  "landmarks": {
    "pose": [[0.5, 0.3, 0.0], [0.52, 0.32, 0.01]],
    "leftHand": [[0.4, 0.6, 0.0]],
    "rightHand": [[0.6, 0.5, -0.01]]
  }
}
```

### 4.3 Server Recognition Stream Packet
```json
{
  "type": "RECOGNITION_EVENT",
  "seq": 1042,
  "status": "recognizing",
  "currentSign": {
    "glossId": "HEADACHE",
    "confidence": 0.91,
    "tier": "high"
  },
  "temporalSegment": {
    "isComplete": false,
    "elapsedMs": 1400
  }
}
```

### 4.4 Server Utterance Complete Packet
Triggered by 800ms of rest posture or explicit end gesture:
```json
{
  "type": "UTTERANCE_COMPLETE",
  "sessionId": "ses_01j7xyz...",
  "glossSequence": ["GREETING", "HEADACHE", "PAIN"],
  "proposedSentence": {
    "fr": "Bonjour, j'ai mal à la tête.",
    "ar": "مرحباً، لدي ألم في الرأس.",
    "en": "Hello, I have a headache."
  },
  "overallConfidence": 0.93
}
```

---

## 5. Error Code Catalog

| Error Code | HTTP Status | Description | User-Facing Action |
|---|---|---|---|
| `ERR-1001` | 400 | Invalid landmark vector dimensionality | Client resets MediaPipe vision pipeline |
| `ERR-1002` | 422 | Context ID unsupported or unknown | Client falls back to generic context |
| `ERR-2001` | 404 | Sign clip not found in manifest | SignPlayer renders animated fallback avatar |
| `ERR-3001` | 408 | WebSocket frame timeout (>2000ms silent) | Client attempts reconnection |
| `ERR-4001` | 429 | Rate limit exceeded (>60 FPS burst) | Client throttles frame decimation |
| `ERR-5001` | 503 | Inference engine warming up / unavailable | Client switches to local mock fallback |
| `CAM-001`  | N/A | Camera permission denied by user | Show permission guide modal |
| `CAM-002`  | N/A | Camera hardware in use by another app | Display device busy error |
| `CAM-003`  | N/A | Overconstrained video resolution | Re-negotiate down to 640x480 |
