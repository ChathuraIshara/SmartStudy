import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Trash2, Bot, User, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatViewProps {
  context: string; // The extracted text from the PDF
  onBack: () => void;
}

const ChatView = ({ context, onBack }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I've analyzed your notes. Feel free to ask me any questions about the material you've uploaded." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          context: context 
        }),
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (question: string) => {
    setInput(question);
    // Optional: Auto send immediately
    // handleSend(); 
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared. What else would you like to know?" }]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col animate-in fade-in zoom-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:bg-blue-100 hover:text-blue-700 rounded-3xl px-3 py-2  font-medium transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl">
            <MessageSquare size={20} />
            <span className="font-semibold">Chat with Notes</span>
          </div>
        </div>
        <button onClick={clearChat} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm">
          <Trash2 size={16} /> Clear
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-600 text-white'}`}>
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-gray-400 text-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your notes..."
            className="w-full bg-white border border-gray-200 text-gray-700 placeholder-gray-400 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>

        {/* Suggested Chips */}
        <div className="flex flex-wrap gap-2 mt-4 px-2">
          {["What is the main topic?", "Summarize the key points", "List 3 definitions"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleChipClick(suggestion)}
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium border border-blue-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ChatView;