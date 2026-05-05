-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Create a table for our document chunks
create table if not exists documents (
  id bigserial primary key,
  content text not null,          -- The actual text chunk
  metadata jsonb,                 -- Page title, section, source URL, etc.
  embedding vector(768)          -- Vector size depends on the model (768 for many Together/Gemini models)
);

-- Create an index for faster similarity search
create index on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Function to search for documents
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
