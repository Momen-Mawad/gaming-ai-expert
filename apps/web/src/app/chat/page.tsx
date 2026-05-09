'use client';

import { useChat } from '@ai-sdk/react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from '@/components/Sidebar';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex bg-[#05050a] min-h-screen text-white font-sans">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 flex flex-col h-screen max-w-5xl mx-auto lg:border-x border-white/5 bg-[#0a0a14] relative">
        {/* Chrome AI-style Header */}
        <header className="p-4 md:p-6 border-b border-white/5 flex items-center gap-3 mt-12 lg:mt-0">
          <div className="bg-purple-600/20 p-2 rounded-lg text-purple-400 border border-purple-500/20">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Stardew AI</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Expert Wiki Assistant</p>
          </div>
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scroll-smooth custom-scrollbar">
          {messages.length > 0 ? (
            messages.map(m => (
              <div
                key={m.id}
                className="flex items-start gap-5 group"
              >
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border ${
                    m.role === 'user' 
                      ? 'bg-white/5 border-white/10 text-gray-400' 
                      : 'bg-purple-600/10 border-purple-500/20 text-purple-400 shadow-sm'
                  }`}
                >
                  {m.role === 'user' ? <User size={18} /> : <Sparkles size={18} fill="currentColor" />}
                </div>
                <div className="flex-1 pt-1 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {m.role === 'user' ? 'You' : 'Stardew AI'}
                  </p>
                  <div className="text-[15px] leading-relaxed text-gray-200">
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({node, ...props}) => <ul className="list-disc ml-5 my-3 space-y-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-5 my-3 space-y-2" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                          a: ({node, ...props}) => (
                            <a 
                              className="text-purple-400 font-medium underline underline-offset-4 hover:text-purple-300 transition-colors" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              {...props} 
                            />
                          ),
                          strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                          code: ({node, ...props}) => <code className="bg-white/5 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono border border-white/5" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                <Sparkles size={48} className="text-gray-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-400">How can I help you today?</p>
                <p className="text-sm text-gray-500">Search the Stardew Valley Wiki using AI</p>
              </div>
            </div>
          )}
          
          {/* Loading Animation */}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex items-start gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border bg-purple-600/10 border-purple-500/20 text-purple-400 shadow-sm animate-pulse">
                <Sparkles size={18} fill="currentColor" />
              </div>
              <div className="flex-1 pt-1 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stardew AI</p>
                <div className="flex gap-1.5 pt-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chrome AI-style Input */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto relative group"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Sparkles size={18} className="text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input
              className="w-full pl-12 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:bg-[#121220] focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all shadow-sm group-hover:bg-white/10 group-focus-within:border-purple-500/30"
              value={input}
              placeholder="Ask anything about Stardew Valley..."
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-0 disabled:scale-95 shadow-lg shadow-purple-500/20"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-medium">
            GameAI can make mistakes. Check the official wiki for critical information.
          </p>
        </div>
      </main>
    </div>
  );
}

