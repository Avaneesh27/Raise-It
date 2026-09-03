import os
import json
import faiss
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple

class FAISSVectorStore:
  """
  FAISS-based dense vector store with persistent storage and Cosine Similarity search.
  """
  def __init__(self, dimension: int = 384, storage_dir: Path = None):
    self.dimension = dimension
    self.index = faiss.IndexFlatIP(dimension) # Inner Product on normalized vectors = Cosine Similarity
    self.chunks: List[Dict[str, Any]] = []
    self.storage_dir = storage_dir or (Path(__file__).resolve().parent.parent.parent / "rag_data")
    self.storage_dir.mkdir(parents=True, exist_ok=True)
    self.index_file = self.storage_dir / "faiss_index.bin"
    self.metadata_file = self.storage_dir / "chunks_metadata.json"

  def add_documents(self, chunks: List[Dict[str, Any]], embeddings: np.ndarray):
    """
    Adds document chunks and their normalized embeddings to the FAISS index.
    """
    if len(chunks) != len(embeddings):
      raise ValueError("Number of chunks and embeddings must match.")

    # Ensure float32 and normalized
    vectors = np.ascontiguousarray(embeddings, dtype=np.float32)
    faiss.normalize_L2(vectors)

    self.index.add(vectors)
    self.chunks.extend(chunks)
    self.save()

  def search(self, query_vector: np.ndarray, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Performs cosine similarity search against indexed civic document chunks.
    Returns list of chunks with attached similarity_score (0.0 to 1.0).
    """
    if self.index.ntotal == 0:
      return []

    query = np.ascontiguousarray([query_vector], dtype=np.float32)
    faiss.normalize_L2(query)

    k = min(top_k, self.index.ntotal)
    distances, indices = self.index.search(query, k)

    results = []
    for rank in range(k):
      idx = indices[0][rank]
      if idx == -1:
        continue
      score = float(distances[0][rank])
      # Bound cosine similarity to [0.0, 1.0]
      normalized_score = max(0.0, min(1.0, (score + 1.0) / 2.0 if score < 0 else score))
      
      chunk_data = dict(self.chunks[idx])
      chunk_data["similarity_score"] = round(normalized_score, 4)
      chunk_data["raw_cosine"] = round(score, 4)
      results.append(chunk_data)

    return results

  def save(self):
    """
    Persists FAISS index binary and metadata JSON to disk.
    """
    try:
      faiss.write_index(self.index, str(self.index_file))
      with open(self.metadata_file, "w", encoding="utf-8") as f:
        json.dump(self.chunks, f, indent=2, ensure_ascii=False)
      print(f"[FAISSVectorStore] Persisted {self.index.ntotal} vectors to {self.storage_dir}")
    except Exception as e:
      print(f"[FAISSVectorStore] Error saving index: {e}")

  def load(self) -> bool:
    """
    Loads FAISS index and metadata if available on disk.
    """
    if self.index_file.exists() and self.metadata_file.exists():
      try:
        self.index = faiss.read_index(str(self.index_file))
        with open(self.metadata_file, "r", encoding="utf-8") as f:
          self.chunks = json.load(f)
        print(f"[FAISSVectorStore] Loaded {self.index.ntotal} vectors from cache.")
        return True
      except Exception as e:
        print(f"[FAISSVectorStore] Error loading cached index: {e}")
        return False
    return False

  def clear(self):
    self.index = faiss.IndexFlatIP(self.dimension)
    self.chunks = []
    if self.index_file.exists():
      self.index_file.unlink()
    if self.metadata_file.exists():
      self.metadata_file.unlink()

# Global FAISS vector store singleton
vector_store = FAISSVectorStore()
