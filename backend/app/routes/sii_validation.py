import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings


router = APIRouter(prefix="/sii-validation", tags=["sii-validation"])


class SiiValidationRequest(BaseModel):
    document_id: int


class SiiCallbackPayload(BaseModel):
    documentId: int
    status: str
    siiCode: str | None = None
    pdfUrl: str | None = None


@router.post("/request-signature")
async def validate_document(request: SiiValidationRequest):
    callback_url = f"{settings.CALLBACK_URL}/sii-validation/callback"
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.SII_API_URL,
            json={
                "callbackUrl": callback_url,
                "documentId": request.document_id,
            },
        )
    print(response.text)
    
    if response.status_code >= 400:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error calling SII API",
        )
    
    return {"ok": True}


@router.post("/callback")
async def sii_callback(payload: SiiCallbackPayload):
    print(f"Received SII callback: documentId={payload.documentId}, status={payload.status}")
    
    # TODO: actualizar tu DB con siiCode/pdfUrl/status
    
    return {"ok": True}
