export interface LLMProvider {
  stream(prompt: string): AsyncGenerator<string>;
}
