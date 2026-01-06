'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, X, RotateCcw } from 'lucide-react';
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

const QUICK_ACTIONS: Record<string, Array<{ text: string; icon?: string }>> = {
  scope: [
    { text: 'What are the key features I should include?', icon: '✨' },
    { text: 'Help me define target users', icon: '👥' },
    { text: 'What use cases should I consider?', icon: '📋' },
    { text: 'How do I measure success?', icon: '🎯' },
    { text: 'Suggest MVP scope', icon: '🚀' },
    { text: 'Identify potential risks', icon: '⚠️' },
  ],
  stack: [
    { text: 'Recommend a frontend framework', icon: '⚛️' },
    { text: 'What backend should I use?', icon: '🔧' },
    { text: 'Which database fits my needs?', icon: '🗄️' },
    { text: 'Suggest deployment options', icon: '☁️' },
    { text: 'Check stack compatibility', icon: '🔍' },
    { text: 'Compare technology options', icon: '⚖️' },
  ],
  design: [
    { text: 'Generate architecture diagram', icon: '📐' },
    { text: 'Help design the API structure', icon: '🔌' },
    { text: 'What security considerations?', icon: '🔒' },
    { text: 'How should data flow?', icon: '🔄' },
    { text: 'Design component structure', icon: '🧩' },
    { text: 'Suggest design patterns', icon: '🎨' },
  ],
  build: [
    { text: 'Generate project structure', icon: '📁' },
    { text: 'Create core components', icon: '🧱' },
    { text: 'Set up configuration files', icon: '⚙️' },
    { text: 'Show me example code', icon: '💻' },
    { text: 'Generate API endpoints', icon: '🌐' },
    { text: 'Create database schema', icon: '🗃️' },
  ],
};

export default function ChatConsole({ projectId, phase, context }: ChatConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load conversation history from localStorage
  useEffect(() => {
    const storageKey = `chat_history_${projectId}_${phase}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const loadedMessages = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(loadedMessages);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, [projectId, phase]);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = `chat_history_${projectId}_${phase}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, projectId, phase]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (useStreaming) {
        // Use streaming API
        const response = await fetch('/api/studio/chat-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            projectId,
            phase,
            context,
            conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to get streaming response');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body');
        }

        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  fullContent += data.text;
                  setStreamingContent(fullContent);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent('');
      } else {
        // Use regular API
        const response = await fetch('/api/studio/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            projectId,
            phase,
            context,
            conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          }),
          signal: abortControllerRef.current.signal,
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
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // Request was aborted
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to connect to AI assistant'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  const clearHistory = () => {
    setMessages([]);
    setStreamingContent('');
    const storageKey = `chat_history_${projectId}_${phase}`;
    localStorage.removeItem(storageKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-white">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-1 text-gray-500 hover:text-white transition-colors"
              title="Clear history"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            {showQuickActions ? 'Hide' : 'Show'} Quick Actions
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {showQuickActions && !isLoading && QUICK_ACTIONS[phase] && (
        <div className="mb-3 space-y-1">
          <p className="text-xs text-gray-500 mb-1">Quick Actions:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ACTIONS[phase].map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.text)}
                className="text-xs px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-colors flex items-center gap-1.5"
              >
                {action.icon && <span>{action.icon}</span>}
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px] max-h-[400px] custom-scrollbar">
        {messages.length === 0 && !isLoading ? (
          <div className="text-center py-8 text-sm text-text-muted">
            <p>Start chatting with AI assistant...</p>
            <p className="text-xs mt-2 text-text-dim">Ask questions or use quick actions above</p>
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
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {/* Streaming content */}
        {isLoading && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <p className="whitespace-pre-wrap break-words text-text-muted">
                {streamingContent}
                <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse" />
              </p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !streamingContent && (
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
        <textarea
          ref={inputRef as any}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift+Enter for new line)"
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 resize-none min-h-[38px] max-h-[120px] overflow-y-auto custom-scrollbar"
          style={{ 
            height: 'auto',
            minHeight: '38px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
        <button
          onClick={() => {
            void handleSend();
          }}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-blue-500/20 border border-blue-500/30 rounded hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          title="Send message (Enter)"
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
