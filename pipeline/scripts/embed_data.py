import os
import sys
from typing import List
from dotenv import load_dotenv
from supabase import create_client, Client
import ollama
from chunk_data import MarkdownHeaderChunker

# Load .env from project root
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(base_dir, ".env")
load_dotenv(env_path, override=True)

# Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print(f"Loading env from: {env_path}")
print(f"URL: {SUPABASE_URL}")
print(f"Key length: {len(SUPABASE_KEY) if SUPABASE_KEY else 0}")
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
EMBEDDING_MODEL = os.environ.get("LOCAL_EMBEDDING_MODEL", "nomic-embed-text") # 768 dimensions

def embed_and_store(content: str, page_title: str, additional_metadata: dict = None):
    """
    Chunks content using MarkdownHeaderChunker, generates embeddings via local Ollama, and stores in Supabase.
    """
    if not all([SUPABASE_URL, SUPABASE_KEY]):
        print("Error: Missing environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)")
        return

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    client = ollama.Client(host=OLLAMA_HOST)

    chunker = MarkdownHeaderChunker()
    chunks = chunker.chunk(content, page_title)
    print(f"Split content into {len(chunks)} semantic chunks.")

    for i, chunk_data in enumerate(chunks):
        chunk_text = chunk_data["content"]
        chunk_metadata = chunk_data["metadata"]
        
        if additional_metadata:
            chunk_metadata.update(additional_metadata)

        # Generate embedding
        try:
            response = client.embeddings(
                model=EMBEDDING_MODEL,
                prompt=chunk_text
            )
            embedding = response['embedding']

            # Prepare record
            record = {
                "content": chunk_text,
                "metadata": chunk_metadata,
                "embedding": embedding
            }

            # Insert into Supabase
            supabase.table("documents").insert(record).execute()
            print(f"Stored chunk {i+1}/{len(chunks)}: {chunk_metadata.get('header_path')}")
        except Exception as e:
            print(f"Error processing chunk {i}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python embed_data.py <path_to_markdown_file> [page_title]")
        sys.exit(1)

    filepath = sys.argv[1]
    title = sys.argv[2] if len(sys.argv) > 2 else os.path.basename(filepath).replace(".md", "")

    with open(filepath, 'r') as f:
        md_content = f.read()

    embed_and_store(md_content, title, {"source": "wiki", "filepath": filepath})
