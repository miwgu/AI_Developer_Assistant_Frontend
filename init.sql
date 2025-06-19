CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(768)  -- Match embedding dimension
);

CREATE TABLE chat_logs ( 
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
