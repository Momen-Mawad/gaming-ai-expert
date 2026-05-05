import re
from typing import List, Dict

class MarkdownHeaderChunker:
    """
    Chunks Markdown text based on headers while preserving context.
    Each chunk will include its path (e.g., Page Title > Section > Subsection).
    """
    def __init__(self, max_chunk_size: int = 1500):
        self.max_chunk_size = max_chunk_size

    def chunk(self, text: str, page_title: str) -> List[Dict]:
        """
        Splits text by headers and returns a list of dictionaries with content and metadata.
        """
        lines = text.split('\n')
        chunks = []
        current_headers = {1: page_title, 2: "", 3: "", 4: "", 5: "", 6: ""}
        current_content = []
        
        # Regex to match Markdown headers: # Header
        header_pattern = re.compile(r'^(#{1,6})\s+(.+)$')

        def save_chunk(content_lines, headers):
            if not content_lines:
                return
            
            content = '\n'.join(content_lines).strip()
            if not content:
                return

            # Create context string: "Title > Section > Subsection"
            header_path = [headers[1]]
            for i in range(2, 7):
                if headers[i]:
                    header_path.append(headers[i])
                else:
                    break
            
            context_prefix = ' > '.join(header_path)
            full_content = f"Context: {context_prefix}\n\n{content}"
            
            # If the chunk is too large, we might need to split it further
            # For now, we'll just store it and note the header context
            chunks.append({
                "content": full_content,
                "metadata": {
                    "header_path": header_path,
                    "title": headers[1],
                    "section": headers[2] if headers[2] else headers[1]
                }
            })

        for line in lines:
            header_match = header_pattern.match(line)
            if header_match:
                # Save previous chunk
                save_chunk(current_content, current_headers)
                current_content = []
                
                level = len(header_match.group(1))
                title = header_match.group(2).strip()
                
                # Update current headers and reset sub-headers
                current_headers[level] = title
                for i in range(level + 1, 7):
                    current_headers[i] = ""
            else:
                current_content.append(line)
        
        # Save the last chunk
        save_chunk(current_content, current_headers)
        
        return chunks

if __name__ == "__main__":
    import sys
    import json
    
    if len(sys.argv) < 2:
        print("Usage: python chunk_data.py <path_to_markdown_file> [page_title]")
        sys.exit(1)
        
    filepath = sys.argv[1]
    title = sys.argv[2] if len(sys.argv) > 2 else "Unknown Page"
    
    with open(filepath, 'r') as f:
        content = f.read()
        
    chunker = MarkdownHeaderChunker()
    result = chunker.chunk(content, title)
    
    print(json.dumps(result, indent=2))
