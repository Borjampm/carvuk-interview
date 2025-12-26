from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/sii-validation", tags=["sii-validation"])


class SiiValidationRequest(BaseModel):
    document_id: int


@router.post("/request-signature")
def validate_document(request: SiiValidationRequest):
    return {"ok": True}

