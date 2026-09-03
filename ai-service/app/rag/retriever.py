import re
from typing import List, Dict, Any, Optional
from app.rag.indexer import vector_store
from app.utils.config import TOP_K_RETRIEVAL

class CivicRetriever:
  def __init__(self, top_k: int = TOP_K_RETRIEVAL):
    self.top_k = top_k

  def retrieve(
    self,
    query: str,
    context: Optional[Dict[str, Any]] = None,
    top_k: Optional[int] = None
  ) -> List[Dict[str, Any]]:
    """
    Retrieves top-K most relevant chunks based on semantic matching and issue context
    """
    if not vector_store.initialized or not vector_store.chunks:
      vector_store.index_civic_directory()

    k = top_k or self.top_k
    query_tokens = set(re.findall(r'\b[a-zA-Z]{3,}\b', query.lower()))
    if not query_tokens:
      return []

    scored_chunks = []
    category_hint = (context.get("category") or "").lower() if context else ""
    department_hint = (context.get("department") or "").lower() if context else ""
    status_hint = (context.get("status") or "").lower() if context else ""

    for chunk in vector_store.chunks:
      overlap = len(query_tokens.intersection(chunk["keywords"]))
      if overlap == 0:
        continue

      # Base relevance score
      score = overlap / (len(query_tokens) + 1.0)

      # Context Boost: if chunk matches the complaint's active category
      if category_hint and category_hint in chunk["content"].lower():
        score += 0.35

      # Context Boost: if chunk matches the department
      if department_hint and department_hint in chunk["department"].lower():
        score += 0.25

      # Context Boost: if asking about complaint lifecycle / status
      if status_hint and status_hint in chunk["content"].lower():
        score += 0.20

      scored_chunks.append({
        **chunk,
        "score": round(score, 3)
      })

    # Sort descending by relevance score
    scored_chunks.sort(key=lambda x: x["score"], reverse=True)
    return scored_chunks[:k]

retriever = CivicRetriever()
