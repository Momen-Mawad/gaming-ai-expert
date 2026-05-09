import sys
import os
import subprocess
from fetch_wiki import fetch_wikitext
from clean_data import clean_wikitext_to_markdown
from embed_data import embed_and_store

def process_page(page_title: str):
    """
    Runs the full pipeline for a single wiki page.
    """
    print(f"--- Processing Page: {page_title} ---")
    
    # 1. Fetch
    print("Step 1: Fetching Wikitext...")
    wikitext = fetch_wikitext(page_title)
    if not wikitext:
        print("Failed to fetch wikitext.")
        return

    # 2. Clean
    print("Step 2: Cleaning to Markdown via Gemini...")
    markdown = clean_wikitext_to_markdown(wikitext)
    if not markdown:
        print("Failed to clean markdown.")
        return

    # Save markdown locally for debugging/caching
    os.makedirs("data/markdown", exist_ok=True)
    safe_title = page_title.replace(" ", "_").replace("/", "_")
    md_path = f"data/markdown/{safe_title}.md"
    with open(md_path, "w") as f:
        f.write(markdown)
    print(f"Saved cleaned markdown to {md_path}")

    # 3. Chunk, Embed, and Store
    print("Step 3: Chunking, Embedding, and Storing in Supabase...")
    game_name = os.environ.get("GAME_NAME", "Stardew Valley")
    embed_and_store(markdown, page_title, {
        "source": "wiki", 
        "original_title": page_title,
        "game_name": game_name
    })
    
    print(f"--- Finished Processing: {page_title} ---")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_page.py <page_title>")
        sys.exit(1)
    
    title = " ".join(sys.argv[1:])
    process_page(title)
