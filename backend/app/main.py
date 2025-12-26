from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.health import router as health_router
from app.routes.user import router as user_router
from app.routes.sii_validation import router as sii_validation_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/webhooks/sii")
async def sii_webhook(payload: dict):
    # Esperado:
    # { "documentId": 1234, "status": "issued", "siiCode": "...", "pdfUrl": "..." }
    document_id = payload.get("documentId")
    status = payload.get("status")

    # if not document_id or not status:
    #     raise HTTPException(status_code=400, detail="Missing documentId/status")

    # TODO: actualizar tu DB con siiCode/pdfUrl/status
    return {"ok": True}

app.include_router(health_router)
app.include_router(user_router)
app.include_router(sii_validation_router)