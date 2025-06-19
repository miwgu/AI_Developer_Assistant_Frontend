import { Ollama } from "langchain/llms/ollama";
import { LLMProvider } from "./interface";

export class OllamaLLM implements LLMProvider {
private model = new Ollama({
  model: process.env.OLLAMA_MODEL || "mistral", // "mistral"OR"tinyllama"
  baseUrl: process.env.OLLAMA_URL || "http://127.0.0.1:11434",
});

  async *stream(prompt: string): AsyncGenerator<string> {
  const stream = await this.model.stream(prompt);
  for await (const chunk of stream) {
    yield chunk;
  }
}
}