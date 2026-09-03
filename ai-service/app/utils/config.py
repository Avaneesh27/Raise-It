import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CIVIC_DOCS_DIR = BASE_DIR.parent / "documents" / "civic"
CHROMA_DIR = BASE_DIR / "chroma_data"

INTERNAL_KEY = os.getenv("AI_SERVICE_INTERNAL_KEY", "raiseit_internal_ai_secret_token")
TOP_K_RETRIEVAL = int(os.getenv("TOP_K_RETRIEVAL", "5"))
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "grounded_synthesis")
