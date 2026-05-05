'use client';

import { useChat } from '@ai-sdk/react';
import { Send, User, Bot } from 'lucide-react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();

  console.log({ isLoading, input, error });

  return (
    <div className="flex flex-col w-full max-w-3xl py-10 mx-auto stretch h-screen px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-2">Stardew AI Expert</h1>
        <p className="text-stone-600">Your companion for everything Pelican Town</p>
      </header>

      <div className="flex-1 overflow-y-auto mb-8 space-y-6 pr-2 custom-scrollbar">
        {messages.length > 0 ? (
          messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start gap-4 ${
                m.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === 'user' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                }`}
              >
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  m.role === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-stone-400 py-20 border-2 border-dashed border-stone-200 rounded-3xl">
            Ask me anything about crops, villagers, or mining!
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex items-center"
      >
        <input
          className="w-full p-4 pr-12 text-stone-800 bg-white border border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={input}
          placeholder="Which crop is best for Spring Year 1?"
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
