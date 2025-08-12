# Qdrant: Vector Database for Semantic Search and Caching

Qdrant is an open-source vector database built to store and search high-dimensional vectors efficiently. It’s designed for semantic search and retrieval-augmented generation (RAG) workloads, where you need to find the “most similar” items to a query based on vector similarity (cosine, dot, euclidean).

## Why Qdrant here
- We embed the tuple `(language :: topic :: numQuestions)` into a vector using an embedding model (Ollama embedding model by default).
- We store the generated questions response alongside that vector in Qdrant.
- For each generation request, we embed the same tuple and perform a nearest-neighbor search. If the top hit is similar enough (score threshold), we return the cached response instead of calling the LLM again.

This gives us a semantic caching strategy that avoids duplicate token spend even when inputs are very similar but not identical.

## Key concepts
- Collection: A logical container for points (vectors + payload). We use a collection like `questions_cache`.
- Point: A single record with an `id`, a `vector` (embedding), and a `payload` (arbitrary JSON). Our payload stores the generated questions JSON and metadata.
- Distance: Similarity metric. We use cosine distance for text embeddings.
- Upsert: Insert or update a point by ID.
- Search: Find top-k nearest vectors for a query vector.

## Setup
- Service URL: `QDRANT_URL` (default `http://localhost:6333`)
- API Key: `QDRANT_API_KEY` if your instance is secured
- Vector size: `QDRANT_VECTOR_SIZE` (must match your embedding model’s dimension)

In this codebase, see:
- `src/shared/infra/embeddings/ollama-embeddings.ts` – embeddings via Ollama
- `src/shared/infra/vector/qdrant/client.ts` – Qdrant client
- `src/shared/infra/vector/qdrant/questions-cache.ts` – cache upsert and search

## Operations we use
- On startup (first use), ensure collection exists with configured vector size.
- `upsertQuestionsCache(payload)` – compute embedding for cache key and upsert payload.
- `queryQuestionsCache(query)` – embed query key, search top-1, return payload if score passes threshold.

## Production notes
- Choose an embedding model with stable dimensions and good quality (e.g., `nomic-embed-text`).
- Set a conservative `minScore` threshold to avoid false positives.
- Periodically re-embed or expire old points if your embedding model changes.
- Monitor Qdrant resource usage; tune shard/replication as needed for scale.
