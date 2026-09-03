import time
from typing import List, Dict, Any, Tuple
from app.models.schemas import RAGSource
from app.rag.gemini_client import gemini_client
from app.rag.prompt_templates import (
  CIVIC_RAG_SYSTEM_INSTRUCTION,
  build_rag_prompt,
  build_baseline_prompt
)

OUT_OF_CONTEXT_REPLY = (
  "I could not find sufficient information in the verified civic knowledge base "
  "to answer this question. The knowledge base contains municipal SOPs, grievance charters, "
  "and departmental SLAs for civic issues like road repairs, solid waste, water supply, and streetlights."
)

class CivicRAGGenerator:
  """
  RAG Generation Engine with Google Gemini integration.
  Synthesizes grounded civic answers from retrieved FAISS context or evaluates against baseline.
  """
  async def generate(
    self,
    question: str,
    chunks: List[Dict[str, Any]],
    context: Dict[str, Any] = None,
    use_rag: bool = True
  ) -> Tuple[str, List[RAGSource], Dict[str, Any]]:
    """
    Generates answer using Gemini.
    Returns: (answer_text, sources, telemetry_dict)
    """
    start_time = time.time()
    telemetry = {
      "use_rag": use_rag,
      "chunks_retrieved": len(chunks),
      "model": gemini_client.model,
      "llm_configured": gemini_client.is_configured()
    }

    # 1. BASELINE MODE (No RAG, direct LLM prompt for academic comparison)
    if not use_rag:
      prompt = build_baseline_prompt(question)
      llm_res = await gemini_client.generate_content(
        prompt=prompt,
        system_instruction="You are a helpful municipal assistant.",
        temperature=0.7
      )
      total_latency = round((time.time() - start_time) * 1000, 2)
      telemetry["total_latency_ms"] = total_latency
      telemetry["llm_latency_ms"] = llm_res.get("latency_ms", 0)
      return llm_res["text"], [], telemetry

    # 2. RAG MODE - Check for empty or low similarity (Out-of-context guard)
    if not chunks:
      total_latency = round((time.time() - start_time) * 1000, 2)
      telemetry["total_latency_ms"] = total_latency
      return OUT_OF_CONTEXT_REPLY, [], telemetry

    # Check top similarity score
    top_score = chunks[0].get("similarity_score", 0.0)
    telemetry["top_similarity_score"] = top_score

    # If the closest document has very low semantic similarity (< 0.25), it is out of scope
    if top_score < 0.25:
      total_latency = round((time.time() - start_time) * 1000, 2)
      telemetry["total_latency_ms"] = total_latency
      return OUT_OF_CONTEXT_REPLY, [], telemetry

    # Map verified sources
    sources: List[RAGSource] = []
    seen = set()
    for c in chunks:
      key = (c.get("document_name"), c.get("page_or_section"))
      if key not in seen:
        seen.add(key)
        sources.append(
          RAGSource(
            documentName=c.get("document_name", "Municipal Document"),
            department=c.get("department", "Municipal Administration"),
            pageOrSection=c.get("page_or_section", "General"),
            relevanceScore=c.get("similarity_score", 0.0)
          )
        )

    # 3. If Gemini is configured, invoke LLM with strict grounding prompt
    if gemini_client.is_configured():
      rag_prompt = build_rag_prompt(question, chunks, context_metadata=context)
      llm_res = await gemini_client.generate_content(
        prompt=rag_prompt,
        system_instruction=CIVIC_RAG_SYSTEM_INSTRUCTION,
        temperature=0.2
      )

      answer = llm_res["text"]
      telemetry["llm_latency_ms"] = llm_res.get("latency_ms", 0)
    else:
      # Deterministic local fallback if API key is not yet set
      top_chunk = chunks[0]
      content = top_chunk.get("content", "").strip()
      paragraphs = [p for p in content.split("\n\n") if p and not p.startswith("#")]
      summary = " ".join(paragraphs[:3]) if paragraphs else content

      answer = (
        f"**[Grounded in {top_chunk['document_name']} — {top_chunk.get('page_or_section', '')}]**\n\n"
        f"{summary}\n\n"
        f"*(Note: Provide `GEMINI_API_KEY` in `ai-service/.env` for dynamic generative synthesis)*"
      )
      telemetry["llm_latency_ms"] = 0

    total_latency = round((time.time() - start_time) * 1000, 2)
    telemetry["total_latency_ms"] = total_latency

    return answer, sources, telemetry

generator = CivicRAGGenerator()
