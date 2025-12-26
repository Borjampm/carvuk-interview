from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/sii-validation", tags=["sii-validation"])


class SiiValidationRequest(BaseModel):
    document_id: str


@router.post("")
def validate_document(request: SiiValidationRequest):
    return {"ok": True}

