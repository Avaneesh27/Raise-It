from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from app.models.schemas import ClassificationResponse
from app.services.vision_classifier import classifier
from app.utils.config import INTERNAL_KEY

router = APIRouter(prefix="/internal/ai", tags=["AI Vision"])

@router.post("/classify-image", response_model=ClassificationResponse)
async def classify_image(
  file: UploadFile = File(...),
  x_internal_key: str = Header(None)
):
  # Security check for internal service endpoint
  if x_internal_key and x_internal_key != INTERNAL_KEY:
    raise HTTPException(status_code=403, detail="Unauthorized internal call")

  contents = await file.read()
  if not contents:
    raise HTTPException(status_code=400, detail="Empty image file received")

  category, confidence, processing_time = classifier.classify(contents, file.filename)

  return ClassificationResponse(
    category=category,
    confidence=confidence,
    modelVersion=classifier.model_name,
    processingTimeMs=processing_time
  )
