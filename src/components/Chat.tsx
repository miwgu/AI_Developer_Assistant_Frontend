import { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
  const [message, setMessage] = useState('');     
  const [reply, setReply] = useState('');         
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  const [displayedReply, setDisplayedReply] = useState('');

  useEffect(() => {
  if (!reply) return;

  let i = 0;
  const interval = setInterval(() => {
    setDisplayedReply(reply.slice(0, i + 1));
    i++;
    if (i >= reply.length) clearInterval(interval);
  }, 40); // Adjust speed (ms per character)

  return () => clearInterval(interval);
}, [reply]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setError('');
    setReply('');

    try {
      const res = await axios.post('http://localhost:3000/api/chat', { message });
      setReply(res.data.reply);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Server returned an error');
      } else if (err.request) {
        setError('No response received from the server');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>AI Dev Assistant</h2>

      {/* Chat input form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your question..."
          style={{ padding: '0.5rem', width: '60%' }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: '1rem' }}>
          Send
        </button>
      </form>

      {/* Loading message */}
      {loading && <p>⏳ Loading...</p>}

      {/* Typing message */}
      {loading && <p>🤖 Typing...</p>}
      {displayedReply && <p>💡 {displayedReply}</p>}

      {/* AI response */}
      {reply && <p>💡 {reply}</p>}

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
    </div>
  );
};

export default Chat;