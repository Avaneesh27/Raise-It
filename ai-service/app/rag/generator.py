import os
from typing import List, Dict, Any, Tuple
from app.models.schemas import RAGSource

HALLUCINATION_FALLBACK = (
  "I couldn't find sufficient information in the available verified civic documents "
  "to answer this question reliably."
)

class CivicRAGGenerator:
  def __init__(self):
    self.api_key = os.getenv("LLM_API_KEY", "")

  def generate(
    self,
    question: str,
    chunks: List[Dict[str, Any]],
    context: Dict[str, Any]
  ) -> Tuple[str, List[RAGSource]]:
    """
    Synthesizes grounded civic response strictly based on retrieved documents.
    Enforces anti-hallucination rules (PRD Section 39 & 66).
    """
    if not chunks:
      return HALLUCINATION_FALLBACK, []

    # Map sources
    sources: List[RAGSource] = []
    seen = set()
    for c in chunks:
      key = (c["document_name"], c["page_or_section"])
      if key not in seen:
        seen.add(key)
        sources.append(
          RAGSource(
            documentName=c["document_name"],
            department=c.get("department"),
            pageOrSection=c.get("page_or_section"),
            relevanceScore=c.get("score")
          )
        )

    # Context values
    status = (context.get("status") or "").upper()
    category = (context.get("category") or "").title()
    dept = context.get("department") or ""

    # Synthesize grounded answer
    top_chunk = chunks[0]
    content = top_chunk["content"]

    # Extract key actionable sentences from top matching chunk
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip() and not p.strip().startswith('#')]
    summary_text = " ".join(paragraphs[:3]) if paragraphs else content

    intro = ""
    if status and category:
      intro = f"Regarding your **{category}** report currently in **{status}** status:\n\n"
    elif category:
      intro = f"According to official guidelines for **{category}**:\n\n"
    else:
      intro = f"According to verified municipal documents ({top_chunk['document_name']}):\n\n"

    answer = f"{intro}{summary_text}"

    return answer, sources

generator = CivicRAGGenerator()
