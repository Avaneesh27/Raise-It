import time
from typing import List, Dict, Any, Optional, Tuple
from app.rag.embeddings import embedding_manager
from app.rag.vector_store import vector_store
from app.rag.indexer import indexer
from app.utils.config import TOP_K_RETRIEVAL

class CivicRetriever:
  """
  Dense vector retriever using all-MiniLM-L6-v2 embeddings and FAISS Cosine Similarity.
  """
  def __init__(self, default_top_k: int = TOP_K_RETRIEVAL):
    self.default_top_k = default_top_k

  def retrieve(
    self,
    query: str,
    context: Optional[Dict[str, Any]] = None,
    top_k: Optional[int] = None
  ) -> Tuple[List[Dict[str, Any]], float]:
    """
    Retrieves top-K most relevant chunks with similarity scores and measures retrieval latency.
    """
    start_time = time.time()

    # Ensure index is loaded
    if vector_store.index.ntotal == 0:
      indexer.index_all_documents()

    k = top_k or self.default_top_k
    if not query.strip():
      return [], 0.0

    # 1. Generate query embedding
    query_vector = embedding_manager.embed_query(query)

    # 2. Perform FAISS vector similarity search
    results = vector_store.search(query_vector, top_k=k)

    # 3. Contextual relevance boost (if query is asked within a specific complaint view)
    if context and results:
      category = (context.get("category") or "").lower()
      dept = (context.get("department") or "").lower()

      for item in results:
        chunk_dept = (item.get("department") or "").lower()
        chunk_cat = (item.get("category") or "").lower()
        chunk_content = item.get("content", "").lower()

        # Slight boost if chunk matches active ticket department or category
        if category and (category in chunk_cat or category in chunk_content):
          item["similarity_score"] = min(1.0, round(item["similarity_score"] + 0.05, 4))
        if dept and (dept in chunk_dept or dept in chunk_content):
          item["similarity_score"] = min(1.0, round(item["similarity_score"] + 0.03, 4))

      # Re-sort after context boosting
      results.sort(key=lambda x: x["similarity_score"], reverse=True)

    latency_ms = round((time.time() - start_time) * 1000, 2)
    return results, latency_ms

retriever = CivicRetriever()
