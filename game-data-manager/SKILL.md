---
name: game-data-manager
description: Manage the multi-game RAG ingestion pipeline. Use this skill to configure new games, fetch wiki data, and update the vector databank for various gaming titles.
---

# Game Data Manager

This skill manages the cross-game ingestion pipeline for the Gaming AI Expert application.

## Multi-Game Configuration

To switch or add a new game, update the following in `.env`:
- `GAME_NAME`: The display name of the game (e.g., "Elden Ring").
- `WIKI_BASE_URL`: The MediaWiki API base URL (e.g., "https://eldenring.fandom.com").

## Ingestion Workflow

### 1. Fetching Data
Use `pipeline/scripts/fetch_wiki.py`. It pulls from the `WIKI_BASE_URL` defined in `.env`.
```bash
python3 pipeline/scripts/fetch_wiki.py "Page Name"
```

### 2. Cleaning Data
Use `pipeline/scripts/clean_data.py`. It uses the local LLM (`phi3:mini`) to convert raw wiki syntax into clean Markdown.

### 3. Embedding and Storage
Use `pipeline/scripts/embed_data.py`. It chunks the Markdown and stores it in the Supabase `documents` table.

### 4. Bulk Processing
Create a custom ingestion list in a script (like `bulk_ingest.py`) to process many pages automatically.

## Best Practices
- **Hyperlinking:** The AI automatically generates links using `WIKI_BASE_URL`. Ensure the URL format matches the wiki's structure.
- **Strict RAG:** The AI will only answer using data in Supabase. If you add a new game, you MUST ingest its data before the AI can answer questions about it.
- **Data Isolation:** Currently, all game data is stored in the `documents` table. For large-scale multi-game support, consider adding a `game_id` column to the Supabase schema and filtering queries in `route.ts`.
