import ollama
import os
import sys

def clean_wikitext_to_markdown(wikitext):
    """
    Passes raw Wikitext to local Ollama LLM to get clean, semantic Markdown.
    """
    model_name = os.environ.get("LOCAL_LLM_MODEL", "llama3")
    ollama_host = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
    
    # Configure client if using a remote host (e.g., in Docker)
    client = ollama.Client(host=ollama_host)
    
    system_prompt = (
        "You are an expert technical writer and Stardew Valley wiki specialist. "
        "Convert the provided raw MediaWiki text into clean, high-quality Markdown. "
        "Guidelines:\n"
        "1. Preserve headers, lists, and tables.\n"
        "2. Remove wiki-specific markup like [[File:...]] or [[Category:...]].\n"
        "3. Convert wiki-links [[Item Name]] to plain text 'Item Name'.\n"
        "4. Simplify complex infoboxes into clean Markdown tables or bulleted lists.\n"
        "5. Output ONLY the resulting Markdown. No preamble."
    )
    
    try:
        response = client.generate(
            model=model_name,
            system=system_prompt,
            prompt=wikitext
        )
        return response['response']
    except Exception as e:
        print(f"Error calling local Ollama API: {e}")
        return None

if __name__ == "__main__":
    # Read from stdin if no file provided
    if not sys.stdin.isatty():
        wikitext = sys.stdin.read()
    elif len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            wikitext = f.read()
    else:
        print("Usage: python clean_data.py <path_to_wikitext_file> OR echo 'text' | python clean_data.py")
        sys.exit(1)
        
    markdown = clean_wikitext_to_markdown(wikitext)
    if markdown:
        print(markdown)
