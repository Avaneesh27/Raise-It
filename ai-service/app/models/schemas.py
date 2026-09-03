from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ClassificationResponse(BaseModel):
  category: str
  confidence: float
  modelVersion: str = "VisionClassifier-v1.0"
  processingTimeMs: Optional[float] = None

class RAGContext(BaseModel):
  category: Optional[str] = None
  department: Optional[str] = None
  status: Optional[str] = None
  reportId: Optional[str] = None
  address: Optional[str] = None

class RAGQueryRequest(BaseModel):
  question: str
  context: Optional[RAGContext] = Field(default_factory=RAGContext)

class RAGSource(BaseModel):
  documentName: str
  department: Optional[str] = None
  pageOrSection: Optional[str] = None
  relevanceScore: Optional[float] = None

class RAGQueryResponse(BaseModel):
  answer: str
  sources: List[RAGSource] = Field(default_factory=list)

class IndexDocumentRequest(BaseModel):
  filePath: str
  metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
