# Project Context: Gaming AI Expert (Stardew Valley)

## Architecture: Local RAG (Retrieval-Augmented Generation)
This is a standalone AI Wiki application that uses a local AI engine (Ollama) to process data and answer queries based on the Stardew Valley Wiki.

### Tech Stack
- **Web App:** Next.js 16+ (App Router), Tailwind CSS, Vercel AI SDK.
- **AI Orchestration:** `@ai-sdk/react` + `ollama-ai-provider`.
- **Database:** Supabase (PostgreSQL + `pgvector` for vector storage).
- **Inference Engine:** Ollama (Dockerized).
  - LLM: `llama3` (for cleaning data and chat).
  - Embeddings: `nomic-embed-text` (768 dimensions).
- **Pipeline:** Python 3.12 (requests, ollama-python, supabase-py).

### Core Components
1. **Pipeline (`pipeline/scripts/`)**:
   - `fetch_wiki.py`: Pulls raw Wikitext from MediaWiki API.
   - `clean_data.py`: Uses local `llama3` to convert Wikitext to clean Markdown.
   - `chunk_data.py`: Semantic splitting using `MarkdownHeaderChunker`.
   - `embed_data.py`: Generates `nomic-embed-text` vectors and upserts to Supabase.
   - `process_page.py`: Master script orchestrating the full flow.
2. **Web App (`apps/web/`)**:
   - `src/app/api/chat/route.ts`: RAG-enabled API that performs similarity search in Supabase and streams responses from Ollama.
   - `src/app/page.tsx`: Modern chat UI.
3. **Database (`supabase/`)**:
   - `setup_vector_store.sql`: Enables `pgvector` and creates `documents` table.
   - `create_search_function.sql`: Defines `match_documents` RPC for similarity search.

### Current State
- **Docker:** Configured with `docker-compose.yml` for local development. `allowedDevOrigins` is configured for Cloud Shell.
- **Ingestion:** "Crops" has been ingested. "Villagers" ingestion was started.
- **Repo:** GitHub repository `Momen-Mawad/gaming-ai-expert` created and synced.

### Future Guidance
- Always use `OLLAMA_HOST=http://localhost:11434` for local scripts and `http://ollama:11434` inside Docker.
- Ensure the Supabase `match_documents` function matches the 768-dimension embeddings from `nomic-embed-text`.
- Prioritize GPU acceleration in `docker-compose.yml` if moving to a machine with NVIDIA hardware.
