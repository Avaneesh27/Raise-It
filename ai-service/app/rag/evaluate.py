import asyncio
import csv
import json
import time
from pathlib import Path
from typing import List, Dict, Any
from app.rag.indexer import indexer
from app.rag.retriever import retriever
from app.rag.generator import generator
from app.rag.vector_store import vector_store

# Comprehensive academic test suite covering core civic sectors and out-of-context questions
BENCHMARK_QUESTIONS = [
  {
    "id": "Q01",
    "question": "What is the statutory SLA timeline for clearing an overflowing garbage dump?",
    "expected_document": "Solid Waste Management Policy",
    "expected_category": "garbage",
    "is_out_of_context": False
  },
  {
    "id": "Q02",
    "question": "Who is the ward official assigned to investigate an overflowing dustbin complaint?",
    "expected_document": "Solid Waste Management Policy",
    "expected_category": "garbage",
    "is_out_of_context": False
  },
  {
    "id": "Q03",
    "question": "What is the emergency response timeline for a critical sinkhole or road cavity?",
    "expected_document": "Cpwd Road And Pavement Maintenance Manual",
    "expected_category": "pothole",
    "is_out_of_context": False
  },
  {
    "id": "Q04",
    "question": "What technical steps must road engineers follow when repairing a pothole?",
    "expected_document": "Cpwd Road And Pavement Maintenance Manual",
    "expected_category": "pothole",
    "is_out_of_context": False
  },
  {
    "id": "Q05",
    "question": "What happens if a citizen complaint remains unresolved after the SLA expires?",
    "expected_document": "Citizen Complaint And Escalation Charter",
    "expected_category": "escalation",
    "is_out_of_context": False
  },
  {
    "id": "Q06",
    "question": "What is the toll-free civic grievance helpline number in the national charter?",
    "expected_document": "Mohua Swachhata And Sanitation Sla Charter",
    "expected_category": "general",
    "is_out_of_context": False
  },
  {
    "id": "Q07",
    "question": "Who repairs potholes on National Highways passing through municipal limits?",
    "expected_document": "Cpwd Road And Pavement Maintenance Manual",
    "expected_category": "pothole",
    "is_out_of_context": False
  },
  {
    "id": "Q08",
    "question": "What is the resolution SLA for water supply pipe bursts and leakages?",
    "expected_document": "Water Supply And Leakage Guidelines",
    "expected_category": "water",
    "is_out_of_context": False
  },
  {
    "id": "Q09",
    "question": "What safety precautions are taken for open manholes and flooded sewers?",
    "expected_document": "Drainage And Monsoon Preparedness",
    "expected_category": "drainage",
    "is_out_of_context": False
  },
  {
    "id": "Q10",
    "question": "How soon must dark spots or broken streetlights be restored?",
    "expected_document": "Public Lighting And Electrical Sop",
    "expected_category": "streetlight",
    "is_out_of_context": False
  },
  # Negative / Out-of-Context Control Questions
  {
    "id": "Q11_OOC",
    "question": "What is the atmospheric composition and total population of Mars?",
    "expected_document": "NONE",
    "expected_category": "out_of_context",
    "is_out_of_context": True
  },
  {
    "id": "Q12_OOC",
    "question": "Who won the FIFA World Cup in 1998?",
    "expected_document": "NONE",
    "expected_category": "out_of_context",
    "is_out_of_context": True
  }
]

async def run_academic_evaluation(output_dir: Path = None):
  out_dir = output_dir or (Path(__file__).resolve().parent.parent.parent / "evaluation_results")
  out_dir.mkdir(parents=True, exist_ok=True)

  print("===================================================================")
  print("STARTING RAISEIT RAG BENCHMARK & BASELINE EVALUATION")
  print("===================================================================")

  # 1. Ensure indexing is fresh
  chunk_count = indexer.index_all_documents()
  print(f"[Evaluation] Verified FAISS index with {chunk_count} document chunks.")

  eval_records = []
  retrieval_recalls = {"k1": 0, "k3": 0, "k5": 0, "mrr_sum": 0.0, "total_evaluable": 0}

  for item in BENCHMARK_QUESTIONS:
    q_id = item["id"]
    query = item["question"]
    expected_doc = item["expected_document"]
    is_ooc = item["is_out_of_context"]

    print(f"\n--- Testing [{q_id}]: '{query}' ---")

    # A. RETRIEVAL PHASE (Top-K = 5)
    chunks, ret_latency = retriever.retrieve(query, top_k=5)

    # Compute Retrieval Metrics for in-context questions
    rank_hit = None
    if not is_ooc:
      retrieval_recalls["total_evaluable"] += 1
      for idx, c in enumerate(chunks):
        doc_name = c.get("document_name", "").lower()
        if expected_doc.lower() in doc_name or doc_name in expected_doc.lower():
          rank_hit = idx + 1
          break

      if rank_hit is not None:
        if rank_hit == 1:
          retrieval_recalls["k1"] += 1
        if rank_hit <= 3:
          retrieval_recalls["k3"] += 1
        if rank_hit <= 5:
          retrieval_recalls["k5"] += 1
        retrieval_recalls["mrr_sum"] += (1.0 / rank_hit)
        print(f"  [Retrieval Hit] Rank #{rank_hit} (Score: {chunks[rank_hit-1]['similarity_score']})")
      else:
        print("  [Retrieval Miss] Target document not in top 5.")

    # B. RAG GENERATION (with retrieved context)
    rag_answer, rag_sources, rag_telemetry = await generator.generate(
      question=query,
      chunks=chunks,
      use_rag=True
    )

    # C. BASELINE GENERATION (LLM Only, zero retrieval context)
    baseline_answer, _, baseline_telemetry = await generator.generate(
      question=query,
      chunks=[],
      use_rag=False
    )

    top_chunk_name = chunks[0]["document_name"] if chunks else "None"
    top_score = chunks[0]["similarity_score"] if chunks else 0.0

    record = {
      "question_id": q_id,
      "question": query,
      "is_out_of_context": is_ooc,
      "expected_document": expected_doc,
      "retrieval_rank_hit": rank_hit,
      "top_retrieved_document": top_chunk_name,
      "top_similarity_score": top_score,
      "retrieval_latency_ms": ret_latency,
      "rag_answer": rag_answer.replace("\n", " "),
      "rag_sources": [s.documentName for s in rag_sources],
      "rag_total_latency_ms": rag_telemetry.get("total_latency_ms", 0.0),
      "baseline_answer": baseline_answer.replace("\n", " "),
      "baseline_latency_ms": baseline_telemetry.get("total_latency_ms", 0.0)
    }
    eval_records.append(record)

  # Calculate Aggregates
  total_evaluable = max(1, retrieval_recalls["total_evaluable"])
  recall_1 = round(retrieval_recalls["k1"] / total_evaluable, 4)
  recall_3 = round(retrieval_recalls["k3"] / total_evaluable, 4)
  recall_5 = round(retrieval_recalls["k5"] / total_evaluable, 4)
  mrr = round(retrieval_recalls["mrr_sum"] / total_evaluable, 4)

  summary = {
    "evaluation_timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "total_questions": len(BENCHMARK_QUESTIONS),
    "in_context_questions": total_evaluable,
    "out_of_context_controls": len(BENCHMARK_QUESTIONS) - total_evaluable,
    "retrieval_metrics": {
      "Recall@1": recall_1,
      "Recall@3": recall_3,
      "Recall@5": recall_5,
      "Mean_Reciprocal_Rank_MRR": mrr
    },
    "eval_records": eval_records
  }

  # Save JSON
  json_file = out_dir / "rag_evaluation_results.json"
  with open(json_file, "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2, ensure_ascii=False)

  # Save CSV
  csv_file = out_dir / "rag_evaluation_results.csv"
  if eval_records:
    keys = eval_records[0].keys()
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
      writer = csv.DictWriter(f, fieldnames=keys)
      writer.writeheader()
      writer.writerows(eval_records)

  print("\n===================================================================")
  print("[EVALUATION RESULTS SUMMARY]:")
  print(f"  Recall@1: {recall_1 * 100}%")
  print(f"  Recall@3: {recall_3 * 100}%")
  print(f"  Recall@5: {recall_5 * 100}%")
  print(f"  MRR (Mean Reciprocal Rank): {mrr}")
  print(f"  Results saved to:")
  print(f"   - {json_file}")
  print(f"   - {csv_file}")
  print("===================================================================")

  return summary

if __name__ == "__main__":
  asyncio.run(run_academic_evaluation())
