import { saveChatLog } from '../db/chatRepository';
import { OllamaLLM } from '../llm/ollama';

const ollama = new OllamaLLM();

export async function handleChatQuery(message: string): Promise<AsyncGenerator<string>> {
  const chunks: string[] = [];
  const stream = ollama.stream(message);

  const asyncStream = (async function* () {
    for await (const token of stream) {
      chunks.push(token);
      yield token;
    }

    const fullResponse = chunks.join('');
    try {
      console.log('💾 Saving to DB:', { message, fullResponse });
      await saveChatLog(message, fullResponse);
      console.log('✅ Saved successfully.');
    } catch (err) {
      console.error('❌ Failed to save to DB:', err);
    }
  })();

  return asyncStream;
}