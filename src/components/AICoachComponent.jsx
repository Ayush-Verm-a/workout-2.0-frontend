import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiClient } from "../api/axiosConfig";
import "../styles/ai-coach-page-style.scss";

const AICoachComponent = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI Fitness Coach. How can I help you today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { user } = useSelector((store) => store.user);
  const { workouts } = useSelector((store) => store.workout);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await apiClient.post("/chat/completions", {
        prompt: userMessage.content
      });
      
      const responseText = response.data;
      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="aicoach-page">
      <div className="aicoach__window">
          <div className="aicoach__header">
            <Bot size={24} />
            <div>
              <h3>AI Coach</h3>
              <p>Powered by AI</p>
            </div>
          </div>
          
          <div className="aicoach__messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`aicoach__message aicoach__message--${msg.role}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {isTyping && (
              <div className="aicoach__message aicoach__message--typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="aicoach__inputarea">
            <form onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Ask for advice..." 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" disabled={!inputMessage.trim() || isTyping}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
    </div>
  );
};

export default AICoachComponent;
