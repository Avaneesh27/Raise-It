from fastapi import APIRouter, Header, HTTPException
from app.models.schemas import RAGQueryRequest, RAGQueryResponse
from app.rag.retriever import retriever
from app.rag.generator import generator
from app.utils.config import INTERNAL_KEY

router = APIRouter(prefix="/internal/rag", tags=["Civic RAG"])

@router.post("/query", response_model=RAGQueryResponse)
async def query_rag(
  payload: RAGQueryRequest,
  x_internal_key: str = Header(None)
):
  if x_internal_key and x_internal_key != INTERNAL_KEY:
    raise HTTPException(status_code=403, detail="Unauthorized internal call")

  context_dict = payload.context.model_dump() if payload.context else {}
  chunks = retriever.retrieve(payload.question, context=context_dict)
  answer, sources = generator.generate(payload.question, chunks, context=context_dict)

  return RAGQueryResponse(
    answer=answer,
    sources=sources
  )
