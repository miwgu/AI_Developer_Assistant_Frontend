import { useState, useRef, useEffect } from "react";
import "./Chat.css";

interface ChatEntry {
  id: number;
  question: string;
  response: string;
  created_at: Date;
}

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Load chat history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${url}/api/getchatlog`);
        const data = await res.json();
        //Older messages first
        const sorted = data.sort((a: ChatEntry, b: ChatEntry) => a.id - b.id);
        setChatLog(sorted);
      } catch (err) {
        console.error("❌ Failed to load history:", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setLoading(true);

    /* 
     Immediate on-screen display using a temporary ID and temporary creation time
     so that the user can see their question while the response is being generated
    */
    const newEntry: ChatEntry = {
      id: Date.now(),
      question: userMessage,
      response: "",
      created_at: new Date(),
    };
    setChatLog((prev) => [...prev, newEntry]);
    const index = chatLog.length;

    try {
      const response = await fetch(`${url}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.body) throw new Error("Stream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullReply = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          fullReply += chunk;

          // Update reply progressively
          setChatLog((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], response: fullReply };
            return updated;
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="background-image-layer"></div>
      <div className="chat-container">
        <div className="chat-messages">
          {chatLog.map((entry) => (
            <div key={entry.id}>
              <div className="message user">{entry.question}</div>
              <div className="message ai">{entry.response}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            rows={1}
          />
          
          <button
            type="submit"
            disabled={loading || !message.trim()}
            /* className={loading || !message.trim() ? "disabled" : ""} */
          >
            Send
          </button>

        </form>

        {error && <p className="error">⚠️ {error}</p>}
      </div>
      <footer className="chat-footer">© AI Developer Assistant 2025</footer>
      
    </>
  );
};

export default Chat;
