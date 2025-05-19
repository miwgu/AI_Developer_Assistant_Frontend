import {useChat} from "../hooks/useChats";
import "./Chat.css";

const Chat = () => {
  const {
    message,
    setMessage,
    chatLog,
    loading,
    error,
    chatEndRef,
    sendMessage,
  } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
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
