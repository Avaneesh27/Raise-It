import os
import time
import httpx
from typing import Dict, Any, Optional
from dotenv import load_dotenv

def _reload_env():
  """
  Reload .env from disk. Tries multiple candidate paths so the server
  always picks up the key regardless of working directory.
  """
  # 1. cwd/.env  (uvicorn is run from ai-service/)
  cwd_env = os.path.join(os.getcwd(), ".env")
  # 2. __file__-relative: ai-service/app/rag/ -> ai-service/
  file_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

  for path in (cwd_env, file_env):
    if os.path.isfile(path):
      load_dotenv(dotenv_path=path, override=True)
      return
  # Last resort: let python-dotenv walk up from cwd
  load_dotenv(override=True)

class GeminiClient:
  """
  Unified Google Gemini API client for RAG synthesis.
  API key is resolved lazily via properties so a server restart
  is all that is needed after adding GEMINI_API_KEY to .env.
  """
  def __init__(self):
    self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

  @property
  def api_key(self) -> str:
    """Read API key fresh from .env on every access."""
    _reload_env()
    return os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY", "")

  @property
  def model(self) -> str:
    return os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

  def is_configured(self) -> bool:
    key = self.api_key
    return bool(key and len(key.strip()) > 10)

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
