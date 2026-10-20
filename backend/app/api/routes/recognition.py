"""
Sign Recognition Inference Routes.
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.recognition import RecognitionRequest, RecognitionResponse
from app.services.inference import ModelNotLoadedException, inference_service

router = APIRouter(prefix="/v1", tags=["Recognition"])


@router.post("/recognize", response_model=RecognitionResponse)
async def recognize_sign(request: RecognitionRequest) -> RecognitionResponse:
    """
    Ingests live webcam image frames (base64) or pre-extracted landmark sequence,
    runs the calibrated SVM classifier, evaluates uncertainty, and returns the predicted
    word with confidence scores and phrasebook matching.
    """
    if not inference_service.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Inference service is not ready. {inference_service.load_error or 'Model not loaded.'}",
        )

    try:
        return inference_service.predict(frames_data=request.frames, lang=request.lang or "fr")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}",
        )
