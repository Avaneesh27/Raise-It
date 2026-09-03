import os
import re
from pathlib import Path
from typing import List, Dict, Any
from app.utils.config import CIVIC_DOCS_DIR, CHROMA_DIR

# In-memory and persistent chunk store for lightning-fast RAG operations
class CivicVectorStore:
  def __init__(self):
    self.chunks: List[Dict[str, Any]] = []
    self.initialized = False

  def chunk_document(self, text: str, doc_name: str, doc_type: str = "Guidelines") -> List[Dict[str, Any]]:
    """
    Split markdown civic documents by sections and paragraphs (PRD Section 35)
    """
    sections = re.split(r'\n(?=##?\s+)', text)
    result = []

    # Extract Department if present in header metadata
    dept_match = re.search(r'\*\*Department:\*\*\s*(.+)', text)
    department = dept_match.group(1).strip() if dept_match else "Municipal Administration"

    for idx, sec in enumerate(sections):
      lines = sec.strip().split('\n')
      if not lines or not lines[0]:
        continue

      heading = lines[0].strip().replace('#', '').strip()
      body = "\n".join(lines[1:]).strip()
      if not body:
        body = heading

      result.append({
        "id": f"{doc_name}_{idx}",
        "document_name": doc_name,
        "department": department,
        "document_type": doc_type,
        "page_or_section": heading,
        "content": sec.strip(),
        "keywords": set(re.findall(r'\b[a-zA-Z]{3,}\b', sec.lower()))
      })

    return result

  def index_civic_directory(self, dir_path: Path = CIVIC_DOCS_DIR) -> int:
    """
    Indexes all markdown files in documents/civic/
    """
    self.chunks = []
    if not dir_path.exists():
      print(f"[RAG Indexer] Warning: Directory {dir_path} does not exist.")
      return 0

    count = 0
    for file_path in dir_path.glob("*.md"):
      try:
        with open(file_path, "r", encoding="utf-8") as f:
          content = f.read()

        doc_name = file_path.stem.replace("_", " ").title()
        doc_chunks = self.chunk_document(content, doc_name)
        self.chunks.extend(doc_chunks)
        count += len(doc_chunks)
      except Exception as e:
        print(f"[RAG Indexer] Error indexing {file_path.name}: {e}")

    self.initialized = True
    print(f"[RAG Indexer] Indexed {count} chunks across civic knowledge base.")
    return count

  def add_document(self, file_path: str, metadata: Dict[str, Any]) -> int:
    try:
      with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
      doc_name = metadata.get("name") or Path(file_path).stem.replace("_", " ").title()
      doc_type = metadata.get("documentType", "Guidelines")
      new_chunks = self.chunk_document(content, doc_name, doc_type)
      self.chunks.extend(new_chunks)
      return len(new_chunks)
    except Exception as e:
      print(f"[RAG Indexer] Failed to add document {file_path}: {e}")
      return 0

# Global vector store instance
vector_store = CivicVectorStore()
