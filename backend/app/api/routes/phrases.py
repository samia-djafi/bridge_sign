"""
Phrasebook & Sequence Alignment Routes.
"""

from typing import Any, Dict, List
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.services.inference import inference_service

router = APIRouter(prefix="/v1", tags=["Phrases"])


class MatchRequest(BaseModel):
    signs: List[str] = Field(..., description="Ordered list of sign gloss tokens.")


@router.get("/phrases")
async def list_phrases() -> Dict[str, Any]:
    """Returns all 45 seed phrase templates and vocabulary coverage status."""
    if inference_service.phrase_service:
        return inference_service.phrase_service.list_phrases()
    return {"total_phrases": 0, "phrases": []}


@router.post("/match")
async def match_phrase(request: MatchRequest) -> Dict[str, Any]:
    """Matches a sequence of recognized signs against phrasebook templates."""
    if inference_service.phrase_service:
        matches = inference_service.phrase_service.match_signs(request.signs)
        return {"matches": matches}
    return {"matches": []}
