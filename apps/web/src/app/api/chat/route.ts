import { createClient } from '@supabase/supabase-js';
import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';

// Initialize Ollama provider
const ollama = createOllama({
  baseURL: `${process.env.OLLAMA_HOST}/api`,
});

// Initialize Supabase (using service role key for vector search)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;
  console.log('--- Incoming Chat Request ---');
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
  console.log('Embedding generated.');

  // 2. Query Supabase
  console.log('Step 2: Querying Supabase...');
  const { data: documents, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.1, // Lowered threshold for testing
    match_count: 5,
  });

  if (error) {
    console.error('Vector search error:', error);
  }
  console.log(`Found ${documents?.length || 0} relevant context snippets.`);

  const contextText = documents
    ?.map((doc: any) => `[Title: ${doc.metadata.title}]\n${doc.content}`)
    .join('\n\n') || 'No relevant context found.';

  // 3. Build the RAG prompt
  const systemPrompt = `You are an AI expert on Stardew Valley. Use the following context from the game's wiki to answer the user's question. 
If the answer isn't in the context, use your internal knowledge but mention if you are unsure.
Always keep the tone helpful and friendly, like a fellow farmer.

CONTEXT:
${contextText}`;

  // 4. Stream the response
  console.log('Step 4: Streaming from local Ollama...');
  const result = await streamText({
    model: ollama(process.env.LOCAL_LLM_MODEL || 'llama3'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
