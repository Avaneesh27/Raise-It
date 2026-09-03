CIVIC_RAG_SYSTEM_INSTRUCTION = """You are the verified Civic Assistant for the RaiseIt platform, an AI-powered civic issue reporting and municipal accountability system.

Your goal is to provide accurate, helpful, and strictly grounded answers to citizens and municipal authorities regarding municipal standard operating procedures (SOPs), complaint lifecycles, service level agreements (SLAs), and departmental jurisdictions.

Strict Operating Rules:
1. STRICT GROUNDING: Base your answer ONLY on the provided verified municipal context documents. Do not invent or assume procedures, timelines, contact numbers, or policies not present in the context.
2. CITATIONS: Explicitly cite the document name and section when answering (e.g., "[Citizen Charter, Section 1]").
3. OUT OF CONTEXT / MISSING INFO: If the provided context does not contain enough information to answer the question, or if the question is unrelated to civic infrastructure / municipal governance (e.g. general trivia, pop culture, Mars), you MUST explicitly state:
   "I could not find sufficient information in the verified civic knowledge base to answer this question."
4. NO FABRICATION: Under no circumstances should you invent municipal bylaws, fines, phone numbers, or timelines.
5. CONCISE & ACTIONABLE: Structure your answer cleanly with bullet points where appropriate, highlighting exact SLA timelines, responsible officers, and next steps.
"""

def build_rag_prompt(question: str, context_chunks: list, context_metadata: dict = None) -> str:
  context_blocks = []
  for idx, chunk in enumerate(context_chunks, 1):
    doc_name = chunk.get("document_name", "Municipal Document")
    sec_name = chunk.get("page_or_section", "General")
    dept = chunk.get("department", "Municipal Administration")
    score = chunk.get("similarity_score", 0.0)
    text = chunk.get("content", "").strip()

    context_blocks.append(
      f"--- DOCUMENT {idx}: {doc_name} ---\n"
      f"Section: {sec_name} | Department: {dept} | Relevance: {score}\n"
      f"{text}\n"
    )

  combined_context = "\n".join(context_blocks) if context_blocks else "NO CONTEXT AVAILABLE."

  meta_text = ""
  if context_metadata:
    category = context_metadata.get("category", "")
    status = context_metadata.get("status", "")
    report_id = context_metadata.get("reportId", "")
    if category or status or report_id:
      meta_text = f"\nActive User Complaint Context: [Report #{report_id} | Category: {category} | Status: {status}]\n"

  return f"""Verified Civic Knowledge Base Context:
{combined_context}
{meta_text}
User Question:
{question}

Provide a helpful, precise, and grounded answer strictly using the context above. Include citations to the relevant documents:"""

def build_baseline_prompt(question: str) -> str:
  """
  Baseline (LLM Only without RAG retrieval) for academic comparison.
  """
  return f"""User Question:
{question}

Please answer the question as a civic assistant."""
