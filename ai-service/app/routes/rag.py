from fastapi import APIRouter, Header, HTTPException
from app.models.schemas import RAGQueryRequest, RAGQueryResponse
from app.rag.retriever import retriever
from app.rag.generator import generator
from app.rag.indexer import indexer
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
  use_rag = True if payload.use_rag is None else payload.use_rag

  chunks = []
  retrieval_latency = 0.0
  if use_rag:
    chunks, retrieval_latency = retriever.retrieve(payload.question, context=context_dict)

  answer, sources, telemetry = await generator.generate(
    question=payload.question,
    chunks=chunks,
    context=context_dict,
    use_rag=use_rag
  )

  telemetry["retrieval_latency_ms"] = retrieval_latency

  return RAGQueryResponse(
    answer=answer,
    sources=sources,
    latencyMs=telemetry.get("total_latency_ms", 0.0),
    telemetry=telemetry
  )

@router.post("/reindex")
async def trigger_reindex(x_internal_key: str = Header(None)):
  if x_internal_key and x_internal_key != INTERNAL_KEY:
    raise HTTPException(status_code=403, detail="Unauthorized internal call")

  count = indexer.index_all_documents(force_reindex=True)
  return {
    "status": "success",
    "indexed_chunks": count
  }
