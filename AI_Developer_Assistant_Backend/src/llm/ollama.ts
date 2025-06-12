import { Ollama } from "langchain/llms/ollama";

const ollama = new Ollama({
  model: process.env.OLLAMA_MODEL || "mistral", // "mistral"OR"tinyllama"
  baseUrl: process.env.OLLAMA_URL || "http://127.0.0.1:11434",
});

export async function* getAIResponseStream(prompt: string): AsyncGenerator<string> {
  const stream = await ollama.stream(prompt);
  for await (const chunk of stream) {
    yield chunk;
  }
}