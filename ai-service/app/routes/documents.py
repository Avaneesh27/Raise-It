from fastapi import APIRouter, Header, HTTPException
from app.models.schemas import IndexDocumentRequest
from app.rag.indexer import vector_store
from app.utils.config import INTERNAL_KEY

router = APIRouter(prefix="/internal/rag", tags=["Document Indexing"])

@router.post("/index-document")
async def index_document(
  payload: IndexDocumentRequest,
  x_internal_key: str = Header(None)
):
  if x_internal_key and x_internal_key != INTERNAL_KEY:
    raise HTTPException(status_code=403, detail="Unauthorized internal call")

  count = vector_store.add_document(payload.filePath, payload.metadata)
  return {
    "status": "success",
    "chunksIndexed": count
  }
