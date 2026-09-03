import os
import re
from pathlib import Path
from typing import List, Dict, Any
from app.utils.config import CIVIC_DOCS_DIR
from app.rag.embeddings import embedding_manager
from app.rag.vector_store import vector_store

class CivicDocumentIndexer:
  """
  Loads municipal Markdown documents, performs semantic chunking, computes
  SentenceTransformer dense embeddings, and indexes them into FAISS.
  """
  def __init__(self, docs_dir: Path = CIVIC_DOCS_DIR):
    self.docs_dir = docs_dir

  def extract_metadata(self, text: str, filename: str) -> Dict[str, str]:
    dept_match = re.search(r'\*\*Department:\*\*\s*(.+)', text, re.IGNORECASE)
    auth_match = re.search(r'\*\*Issuing Authority:\*\*\s*(.+)', text, re.IGNORECASE)
    doc_id_match = re.search(r'\*\*Document ID:\*\*\s*(.+)', text, re.IGNORECASE)
    cat_match = re.search(r'\*\*Category:\*\*\s*(.+)', text, re.IGNORECASE)

    dept = dept_match.group(1).strip() if dept_match else (auth_match.group(1).strip() if auth_match else "Municipal Administration")
    doc_id = doc_id_match.group(1).strip() if doc_id_match else filename
    category = cat_match.group(1).strip() if cat_match else "General Civic"

    return {
      "department": dept,
      "document_id": doc_id,
      "category": category
    }

  def chunk_text(self, content: str, doc_name: str, meta: Dict[str, str]) -> List[Dict[str, Any]]:
    """
    Semantic chunking: divides document by primary/secondary headers (## Section),
    preserving section titles and metadata in every chunk.
    """
    sections = re.split(r'\n(?=##?\s+)', content)
    chunks = []

    for s_idx, sec in enumerate(sections):
      cleaned = sec.strip()
      if not cleaned or len(cleaned) < 20:
        continue

      lines = cleaned.split('\n')
      heading = lines[0].replace('#', '').strip()
      body = "\n".join(lines[1:]).strip() if len(lines) > 1 else heading

      # If a single section is very large (> 1500 chars), split into sub-chunks
      if len(cleaned) > 1500:
        paragraphs = [p.strip() for p in cleaned.split('\n\n') if p.strip()]
        curr_text = ""
        sub_idx = 1
        for p in paragraphs:
          if len(curr_text) + len(p) < 1200:
            curr_text += ("\n\n" if curr_text else "") + p
          else:
            if curr_text:
              chunks.append({
                "id": f"{doc_name}#{heading}#{sub_idx}",
                "document_name": doc_name,
                "department": meta["department"],
                "category": meta["category"],
                "page_or_section": f"{heading} (Part {sub_idx})",
                "content": curr_text
              })
              sub_idx += 1
            curr_text = p
        if curr_text:
          chunks.append({
            "id": f"{doc_name}#{heading}#{sub_idx}",
            "document_name": doc_name,
            "department": meta["department"],
            "category": meta["category"],
            "page_or_section": f"{heading} (Part {sub_idx})",
            "content": curr_text
          })
      else:
        chunks.append({
          "id": f"{doc_name}#{heading}#{s_idx}",
          "document_name": doc_name,
          "department": meta["department"],
          "category": meta["category"],
          "page_or_section": heading,
          "content": cleaned
        })

    return chunks

  def index_all_documents(self, force_reindex: bool = False) -> int:
    """
    Scans CIVIC_DOCS_DIR, chunks documents, embeds using SentenceTransformer,
    and loads into FAISS vector store.
    """
    # Check if index is already cached and valid
    if not force_reindex and vector_store.load():
      return len(vector_store.chunks)

    print(f"[RAG Indexer] Indexing civic knowledge base from: {self.docs_dir}")
    if not self.docs_dir.exists():
      print(f"[RAG Indexer] Directory not found: {self.docs_dir}")
      return 0

    all_chunks = []
    files = list(self.docs_dir.glob("*.md"))
    if not files:
      print(f"[RAG Indexer] No markdown files found in {self.docs_dir}")
      return 0

    for file_path in files:
      try:
        with open(file_path, "r", encoding="utf-8") as f:
          content = f.read()

        doc_name = file_path.stem.replace("_", " ").title()
        meta = self.extract_metadata(content, file_path.name)
        chunks = self.chunk_text(content, doc_name, meta)
        all_chunks.extend(chunks)
      except Exception as e:
        print(f"[RAG Indexer] Error reading {file_path.name}: {e}")

    if not all_chunks:
      print("[RAG Indexer] No chunks created.")
      return 0

    print(f"[RAG Indexer] Extracted {len(all_chunks)} semantic chunks. Generating dense embeddings...")
    texts_to_embed = [c["content"] for c in all_chunks]
    embeddings = embedding_manager.embed_texts(texts_to_embed)

    vector_store.clear()
    vector_store.add_documents(all_chunks, embeddings)
    print(f"[RAG Indexer] Successfully indexed {len(all_chunks)} chunks in FAISS vector store.")

    return len(all_chunks)

indexer = CivicDocumentIndexer()
