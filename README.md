# Stardew AI Expert (Local RAG)

A standalone AI expert for Stardew Valley built with a Retrieval-Augmented Generation (RAG) architecture. Powered by local LLMs (Ollama) and Supabase.

## 🚀 Features
- **Fully Local AI:** No API costs. Uses Ollama for LLM and Embeddings.
- **Wikitext Pipeline:** Fetches directly from Stardew Valley Wiki, cleans with AI, and stores in a vector database.
- **RAG Chat:** Answer queries using specific game context from the wiki.
- **Dockerized:** Easy orchestration of UI and AI services.

## 🛠 Tech Stack
- **Frontend:** Next.js 16, Tailwind CSS, Vercel AI SDK
- **Backend/Vector Store:** Supabase (pgvector)
- **AI Engine:** Ollama (Llama 3, Nomic Embed)
- **Data Pipeline:** Python 3.12

## 📦 Setup Instructions

### 1. Prerequisites
- [Docker](https://www.docker.com/)
- [Python 3.12+](https://www.python.org/)
- [Ollama](https://ollama.com/) (Installed locally or via Docker)

### 2. Database Setup
- Create a project on [Supabase](https://supabase.com/).
- Run the SQL files in `supabase/` in your Supabase SQL Editor:
  1. `setup_vector_store.sql`
  2. `create_search_function.sql`

### 3. Environment Variables
Create a `.env` file in the root directory:
```bash
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OLLAMA_HOST=http://localhost:11434
LOCAL_LLM_MODEL=llama3
LOCAL_EMBEDDING_MODEL=nomic-embed-text
```

### 4. Start the Application
```bash
# Pull AI models into Ollama
ollama pull llama3
ollama pull nomic-embed-text

# Start the web app and local services
docker compose up
```

### 5. Ingest Data
```bash
pip install -r pipeline/requirements.txt
python pipeline/scripts/process_page.py "Crops"
```

## 📂 Structure
- `apps/web`: Next.js frontend application.
- `pipeline/scripts`: Python logic for data extraction and embedding.
- `supabase`: Database migrations and RPC functions.
- `data/markdown`: Local cache of cleaned wiki content.
