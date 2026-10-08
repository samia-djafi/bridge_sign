# LSA Bridge — Video Recording & Sign Asset Production Guide

This guide establishes the linguistic, ethical, and technical standards for recording Algerian Sign Language (LSA) video assets for integration into LSA Bridge.

---

## 1. Ethical Standards & Deaf Community Partnership

1. **Native Signer Collaboration:**
   - All recordings must feature native or fluent LSA signers from the Algerian Deaf community.
   - Do not use hearing actors mimicking signs.

2. **Regional Linguistic Consensus:**
   - LSA exhibits lexical variations across Algerian wilayas (e.g., Algiers, Oran, Constantine, Annaba).
   - Before recording medical terminology (e.g. "comprimé", "ordonnance", "urgence"), convene a panel of 3+ Deaf community consultants to agree upon the most widely recognized standard variant in Algerian healthcare contexts.

3. **Informed Consent & Fair Compensation:**
   - Signers must sign a bilingual (French/Arabic/LSA video format) informed consent agreement.
   - The consent form must specify: open civic distribution, non-exclusive license, educational and healthcare utility.
   - Signers must receive fair remuneration for studio time and consultation.

---

## 2. Visual & Studio Setup

### 2.1 Background & Environment
- **Backdrop:** Matte, non-reflective neutral grey (`#E2E8F0` or `#334155`) or solid navy blue.
- **Clothing:** Solid, unpatterned shirt contrasting against skin tone and backdrop (e.g., dark navy or charcoal for light backdrops). Long sleeves or rolled past the forearm to keep wrist joints distinct.
- **Accessories:** No distracting jewelry, rings, or wristbands that can interfere with hand landmark tracking. Nails kept natural and unpainted.

### 2.2 Lighting
- **Three-Point Setup:**
  - Key Light: Soft diffuse 45° off-axis.
  - Fill Light: Soft diffuse 45° opposite key light to eliminate deep shadows under the chin and nose.
  - Backlight / Hair Light: Subtle separation between signer and backdrop.
- Avoid harsh single overhead lights that cast deep shadows in the palm or under fingers.

### 2.3 Camera Framing & Spatial Geometry
- **Framing:** Medium shot (waist-up).
  - Headroom: 5–8% above head.
  - Lower boundary: Just below belt / hips.
  - Lateral boundary: Sufficient width so elbows and fingers never clip out of frame when extending outward during wide signs (e.g., "HOSPITAL", "EXAMINATION").
- **Camera Position:** Exactly eye-level with the signer. Never angled up (chin up) or down (distorts hand depth).
- **Resolution & Frame Rate:** 1080p at 60 FPS (preferred for capturing rapid finger articulations) or 720p at 30 FPS minimum.

---

## 3. Signing Performance Guidelines

1. **Neutral Start & End:**
   - Every sign clip must begin with 0.2 seconds in neutral resting posture (hands lightly relaxed at waist level, eyes looking directly at camera).
   - Conclude sign with a brief 0.2 second hold or gentle release.
   - Trimming must be tight: remove extraneous body shifts before and after the sign gesture.

2. **Non-Manual Markers (NMM):**
   - In LSA, facial expressions, head tilts, and mouth morphemes carry essential grammatical and emotional weight.
   - Instruct the signer to use natural medical expressions (e.g., furrowed brow for pain, questioning eyebrow raise for "avez-vous besoin...").

---

## 4. Video Encoding & File Specification

To achieve instant zero-buffer playback on mobile devices without exhausting local cache:

| Parameter | Primary Spec (WebM) | Universal Fallback (MP4) |
|---|---|---|
| **Container** | `.webm` | `.mp4` |
| **Video Codec** | VP9 / AV1 | H.264 (Baseline / Main) |
| **Resolution** | $960 \times 540$ (16:9) | $960 \times 540$ (16:9) |
| **Frame Rate** | 30 or 60 FPS constant | 30 FPS constant |
| **Bitrate** | 500 – 750 kbps | 600 – 800 kbps |
| **Audio** | No audio track (strip audio to save $\approx 25\%$ file size) | No audio track |
| **Pixel Format** | `yuv420p` | `yuv420p` |

### Recommended FFmpeg Command
```bash
ffmpeg -i raw_take.mov \
  -an \
  -vf "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -b:v 600k -crf 32 -deadline good -pix_fmt yuv420p \
  public/signs/headache.webm
```

---

## 5. Directory Registration & Manifest

1. Save the encoded video file into `public/signs/`:
   ```
   public/signs/
     manifest.json
     greeting.webm
     headache.webm
     take_pill.webm
     ...
   ```

2. Register the entry in `public/signs/manifest.json`:
   ```json
   {
     "id": "HEADACHE",
     "filename": "headache.webm",
     "durationMs": 1450,
     "category": "symptoms",
     "label": {
       "fr": "Mal de tête",
       "ar": "صداع في الرأس",
       "en": "Headache"
     }
   }
   ```
