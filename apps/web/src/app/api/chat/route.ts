import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { createClient } from '@/lib/supabase/server';

// Initialize Ollama provider
const ollama = createOllama({
  baseURL: `${process.env.OLLAMA_HOST}/api`,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;
  
  // Initialize Supabase Client (Server-side)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log('--- Incoming Chat Request ---');
  console.log('User:', user?.email || 'Guest');
  console.log('Question:', lastMessage);

  // 1. Generate embedding
  console.log('Step 1: Generating embedding...');
  const embeddingResponse = await fetch(`${process.env.OLLAMA_HOST}/api/embeddings`, {
    method: 'POST',
    body: JSON.stringify({
      model: process.env.LOCAL_EMBEDDING_MODEL || 'nomic-embed-text',
      prompt: lastMessage,
    }),
  });
  
  const embeddingData = await embeddingResponse.json();
  const embedding = embeddingData.embedding;

  // 2. Query Supabase (using the client with potentially restricted permissions)
  console.log('Step 2: Querying Supabase...');
  const { data: documents, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.1,
    match_count: 3,
  });

  if (error) {
    console.error('Vector search error:', error);
  }
  console.log(`Found ${documents?.length || 0} relevant context snippets.`);

  const contextText = documents
    ?.map((doc: any) => `[Title: ${doc.metadata.title}]\n${doc.content}`)
    .join('\n\n') || 'No relevant context found.';

  // 3. Build the RAG prompt
  const gameName = process.env.GAME_NAME || 'Game';
  const wikiUrl = process.env.WIKI_BASE_URL || 'https://stardewvalleywiki.com';

  const systemPrompt = `You are the ${gameName} Wiki Assistant, a digital tool designed to provide factual information about the game ${gameName}. You are NOT a character from the game.

RULES:
1. IDENTITY: If asked "Who are you?", identify yourself as the "${gameName} Wiki Assistant". Do NOT adopt the name or personality of any character mentioned in the context.
2. Provide only the facts. Do not use personal anecdotes, opinions, or conversational filler.
3. HYPERLINKING: Automatically hyperlink important ${gameName} keywords to the official wiki.
   - Format: [Keyword](${wikiUrl}/Keyword)
4. STRICT RAG ENFORCEMENT: You MUST ONLY use the information provided in the CONTEXT to answer gameplay questions. If the question cannot be answered using the CONTEXT, state: "I do not have information about that in my databank yet."
5. Format the output for quick reading.

CONTEXT:
${contextText}`;

  // 4. Stream the response
  console.log('Step 4: Streaming from local Ollama...');
  const result = await streamText({
    model: ollama(process.env.LOCAL_LLM_MODEL || 'phi3:mini'),
    system: systemPrompt,
    messages,
    maxTokens: 500,
  });

  return result.toDataStreamResponse();
}
