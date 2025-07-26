import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [{ sender: "bot", text: "Hello! How can I help you today?" }];
  });

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen3-235B-A22B-Instruct-2507-tput",
          messages: [
            {
              role: "system",
              content: `You are an academic chatbot that assists students and applicants of Coventry University in Kazakhstan. 
You provide clear, polite answers about:
- Bachelor's and Master's programmes
- Class schedules (e.g. lessons start at 9:00 AM, 90 minutes each, Monday to Friday)
- Admissions, tuition fees, dormitories, scholarships
- Student life and support services
If you're unsure, suggest visiting the official website or contacting university staff.`,
            },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Request failed");

      const botReply = data.choices?.[0]?.message?.content || "Empty response";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `❌ ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const confirmClearChat = () => {
    setMessages([{ sender: "bot", text: "Hello! How can I help you today?" }]);
    localStorage.removeItem("chatMessages");
    setConfirmClear(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      className={`fixed z-50 ${fullScreen ? "inset-0" : "bottom-4 right-4"}`}
      style={{ touchAction: "none" }} // чтобы избежать глитчей на тач-устройствах
    >
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition cursor-move"
        >
          💬 Have questions? Ask the chatbot
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`${
              fullScreen
                ? "w-full h-full max-w-full max-h-screen"
                : "w-80 max-h-[80vh]"
            } bg-white border rounded-lg shadow-xl flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-gray-100 p-2 border-b cursor-default">
              <span className="font-bold">Chat Assistant</span>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  🗑️ Clear
                </button>
                <button
                  onClick={() => setFullScreen((f) => !f)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {fullScreen ? "Minimize" : "Fullscreen"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-red-600 hover:underline"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-2 rounded-2xl whitespace-pre-wrap break-words shadow-sm ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-100 text-blue-900"
                      : "mr-auto bg-gray-200 text-gray-900"
                  }`}
                >
                  <ReactMarkdown
                    children={msg.text}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 pl-3 italic text-gray-600 my-2">
                          {children}
                        </blockquote>
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 leading-relaxed">{children}</p>
                      ),
                    }}
                  />
                </div>
              ))}
              {loading && (
                <div className="italic text-sm text-gray-400">
                  Chatbot is typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex border-t p-2 gap-2 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Type your question..."
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmation */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full"
            >
              <h2 className="text-lg font-bold mb-4">Clear chat history?</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to clear all chat messages?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearChat}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatBot;
