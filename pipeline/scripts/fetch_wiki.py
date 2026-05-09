import requests
import sys
import os
from dotenv import load_dotenv

# Load .env from project root
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(base_dir, ".env")
load_dotenv(env_path, override=True)

WIKI_BASE_URL = os.environ.get("WIKI_BASE_URL", "https://stardewvalleywiki.com")

def fetch_wikitext(page_title):
    """
    Fetches the raw Wikitext for a given page from the configured Wiki.
    """
    api_url = f"{WIKI_BASE_URL}/mediawiki/api.php"
    params = {
        "action": "query",
        "prop": "revisions",
        "titles": page_title,
        "rvslots": "main",
        "rvprop": "content",
        "format": "json",
        "redirects": 1
    }
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        pages = data.get("query", {}).get("pages", {})
        for page_id, page_data in pages.items():
            if page_id == "-1":
                print(f"Error: Page '{page_title}' not found.")
                return None
            
            revisions = page_data.get("revisions", [])
            if revisions:
                return revisions[0].get("slots", {}).get("main", {}).get("*")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None
            
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fetch_wiki.py <page_title>")
        sys.exit(1)
    
    title = sys.argv[1]
    content = fetch_wikitext(title)
    if content:
        print(content)
