# Project Context: Gaming AI Expert

## Architecture: Multi-Game Local RAG
This is a modular AI application designed to provide expert wiki knowledge for multiple gaming titles using a local inference engine (Ollama) and a vector databank (Supabase).

### Tech Stack
- **Web App:** Next.js 16+ (App Router), Tailwind CSS, Vercel AI SDK.
- **AI Orchestration:** `@ai-sdk/react` + `ollama-ai-provider`.
- **Database:** Supabase (PostgreSQL + `pgvector` for vector storage).
- **Inference Engine:** Ollama (Dockerized).
  - LLM: `phi3:mini` (optimized for speed and accuracy in RAG).
  - Embeddings: `nomic-embed-text` (768 dimensions).
- **Pipeline:** Python 3.12 (requests, ollama-python, supabase-py).

### Core Components
1. **Generalized Pipeline (`pipeline/scripts/`)**:
   - `fetch_wiki.py`: Pulls raw Wikitext from any MediaWiki API defined in `.env`.
   - `clean_data.py`: Uses local LLM to convert Wikitext to clean Markdown.
   - `chunk_data.py`: Semantic splitting using `MarkdownHeaderChunker`.
   - `embed_data.py`: Generates vectors and upserts to Supabase.
   - `process_page.py`: Orchestrates the full pipeline for a page. **Now adds `game_name` to metadata.**
   - `bulk_ingest.py`: Orchestrates mass ingestion for the target game.

### Discovery & UI
- **Dynamic Game Discovery:** The landing page fetches available games via `/api/games`. It cross-references the database against a high-quality list of supported games to ensure only active experts are displayed.
- **Metadata Requirement:** All ingested documents MUST include `game_name` in their metadata for proper filtering in the UI.
2. **Web App (`apps/web/`)**:
   - `src/app/api/chat/route.ts`: Generic RAG-enabled API. Uses `GAME_NAME` and `WIKI_BASE_URL` for identity and hyperlinking.
   - `src/app/page.tsx`: Modern chat UI with Chrome AI aesthetic and markdown rendering.

### Current State
- **Docker:** Fully configured with `phi3:mini` and `nomic-embed-text`.
- **Target Game:** Currently configured for **Stardew Valley**.
- **Ingestion:** Core Stardew Valley databank complete (88+ pages).
- **Architecture:** Fully generalized. To add a new game, simply change the `.env` configuration and run the ingestion pipeline.

### Future Guidance
- **Adding a Game:** Use the `game-data-manager` skill. Update `GAME_NAME` and `WIKI_BASE_URL` in `.env`, then run the ingestion scripts.
- **Strict RAG:** Always maintain "Strict RAG Enforcement". The AI MUST only answer using the ingested context.
- **Model Selection:** `phi3:mini` is the preferred model for local inference speed.
- **Data Isolation:** If adding multiple games to the same database, consider adding a `game_id` column to the `documents` table.
