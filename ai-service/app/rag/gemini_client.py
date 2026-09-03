import os
import time
import httpx
from typing import Dict, Any, Optional

class GeminiClient:
  """
  Unified Google Gemini API client for RAG synthesis.
  Calls the official Google Generative Language REST API endpoint.
  """
  def __init__(self):
    self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY", "")
    self.model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

  def is_configured(self) -> bool:
    return bool(self.api_key and len(self.api_key.strip()) > 10)

  async def generate_content(
    self,
    prompt: str,
    system_instruction: Optional[str] = None,
    temperature: float = 0.2,
    max_tokens: int = 1024
  ) -> Dict[str, Any]:
    """
    Sends prompt to Google Gemini and returns generated text with latency and token metrics.
    """
    start_time = time.time()

    if not self.is_configured():
      return {
        "text": (
          "⚠️ **Gemini API Key Required**\n\n"
          "To enable live LLM generation, set your `GEMINI_API_KEY` in `ai-service/.env`:\n"
          "```env\nGEMINI_API_KEY=your_gemini_api_key_here\n```\n"
          "The retrieval layer has successfully retrieved the relevant context above."
        ),
        "latency_ms": 0,
        "model": "unconfigured",
        "success": False
      }

    url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"

    # Build payload conforming to Gemini API v1beta
    contents = [
      {
        "role": "user",
        "parts": [{"text": prompt}]
      }
    ]

    payload: Dict[str, Any] = {
      "contents": contents,
      "generationConfig": {
        "temperature": temperature,
        "maxOutputTokens": max_tokens,
        "topP": 0.8
      }
    }

    if system_instruction:
      payload["systemInstruction"] = {
        "parts": [{"text": system_instruction}]
      }

    try:
      async with httpx.AsyncClient(timeout=25.0) as client:
        response = await client.post(url, json=payload)
        latency_ms = round((time.time() - start_time) * 1000, 2)

        if response.status_code == 200:
          data = response.json()
          candidates = data.get("candidates", [])
          if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            generated_text = "".join([p.get("text", "") for p in parts])
            return {
              "text": generated_text.strip(),
              "latency_ms": latency_ms,
              "model": self.model,
              "success": True
            }
          else:
            return {
              "text": "The LLM response was filtered or empty.",
              "latency_ms": latency_ms,
              "model": self.model,
              "success": False
            }
        else:
          error_detail = response.text
          try:
            err_json = response.json()
            error_detail = err_json.get("error", {}).get("message", response.text)
          except Exception:
            pass

          print(f"[GeminiClient] API Error ({response.status_code}): {error_detail}")
          return {
            "text": f"Error contacting Gemini API ({response.status_code}): {error_detail}",
            "latency_ms": latency_ms,
            "model": self.model,
            "success": False
          }

    except httpx.RequestError as exc:
      latency_ms = round((time.time() - start_time) * 1000, 2)
      print(f"[GeminiClient] Network Error: {exc}")
      return {
        "text": f"Network error communicating with Google Gemini: {str(exc)}",
        "latency_ms": latency_ms,
        "model": self.model,
        "success": False
      }

gemini_client = GeminiClient()
