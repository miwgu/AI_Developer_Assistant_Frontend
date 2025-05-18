import { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReply('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${url}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulated = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          accumulated += decoder.decode(value, { stream: true });
          setReply(accumulated); // update UI progressively
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Dev Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your question..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !message}>
          Send
        </button>
      </form>

      {loading && <p>⏳ Loading...</p>}
      {reply && <p>💡 {reply}</p>}
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
    </div>
  );
};

export default Chat;