'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatConsoleProps {
  projectId: string;
  phase: string;
  context?: any;
}

export default function ChatConsole({ projectId, phase, context }: ChatConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/studio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          projectId,
          phase,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `错误: ${error.message || '无法连接到 AI 助手'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-sm text-text-muted">
            <p>开始与 Gemini 对话...</p>
            <p className="text-xs mt-2 text-text-dim">输入你的问题或想法</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30'
                      : 'bg-background text-text-muted border border-border'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p className="text-[10px] text-text-dim mt-1">
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-background border border-border rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          disabled={isLoading}
          className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-blue-500/20 border border-blue-500/30 rounded hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          ) : (
            <Send className="w-4 h-4 text-blue-400" />
          )}
        </button>
      </div>
    </div>
  );
}
