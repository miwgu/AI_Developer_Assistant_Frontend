import { useState, useRef, useEffect } from "react";
import { fetchChatLog, postQuery, ChatEntry } from "../api/chatApi";
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";


  // Load chat history on component mount
  useEffect(() => {
    loadChatLog();
  }, []);

  // Maintain chat scroll position
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

    const loadChatLog = async () => {
    try {
      const data = await fetchChatLog();
      const sorted = data.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setChatLog(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch chat log:", err);
    }
  };

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
      id: -Date.now(),
      question: userMessage,
      response: "",
      created_at: new Date().toISOString(),
    };

    setChatLog((prev) => [...prev, newEntry]);
    const index = chatLog.length;

    try {
      const stream = await postQuery(userMessage);
      const reader = stream.getReader();
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
      await loadChatLog();
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
