'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import GameCard from '@/components/GameCard';
import { Gamepad2, Sparkles, Loader2 } from 'lucide-react';

interface GameInfo {
  id: string; // The game_name as stored in the DB
  title: string;
  description: string;
  image: string;
  href: string;
}

const ALL_GAMES: GameInfo[] = [
  {
    id: 'Stardew Valley',
    title: 'Stardew Valley AI:',
    description: 'Master farming, fishing, and town secrets.',
    image: 'https://shared.fastly.steamstatic.com/store_apps/413150/ss_49380962b9a7852c5c938f328f6f58473ba74d15.1920x1080.jpg',
    href: '/chat?game=Stardew%20Valley',
  },
  {
    id: 'Cyberpunk 2077',
    title: 'Cyberpunk 2077 AI:',
    description: 'Navigate Night City, quests, and builds.',
    image: 'https://shared.fastly.steamstatic.com/store_apps/1091500/ss_891e4835848c41f6874ba4167e717df3711915f0.1920x1080.jpg',
    href: '/chat?game=Cyberpunk%202077',
  },
  {
    id: 'Elden Ring',
    title: 'Elden Ring AI:',
    description: 'Conquer bosses, uncover lore, and find items.',
    image: 'https://shared.fastly.steamstatic.com/store_apps/1245620/ss_3d943b171f1e8f80459954a1a5b481944517b62e.1920x1080.jpg',
    href: '/chat?game=Elden%20Ring',
  },
  {
    id: 'Baldurs Gate 3',
    title: 'Baldur\'s Gate 3:',
    description: 'Master spells, companions, and turn-based tactics.',
    image: 'https://shared.fastly.steamstatic.com/store_apps/1086940/ss_75e8966601f0579e088d8b871c50e4860b73c482.1920x1080.jpg',
    href: '/chat?game=Baldurs%20Gate%203',
  },
  {
    id: 'The Witcher 3',
    title: 'The Witcher 3:',
    description: 'Hunt monsters, find Ciri, and explore the Continent.',
    image: 'https://shared.fastly.steamstatic.com/store_apps/292030/ss_728956903d606138676c8c4995f9a6e60b86a836.1920x1080.jpg',
    href: '/chat?game=The%20Witcher%203',
  },
  {
    id: 'Final Fantasy XIV',
    title: 'Final Fantasy XIV:',
    description: 'Raid bosses, level jobs, and save Eorzea.',
    image: 'https://shared.fastly.steamstatic.com/store_apps/39210/ss_cc179c3d9b1574e47f551c96934c9c748e64c126.1920x1080.jpg',
    href: '/chat?game=Final%20Fantasy%20XIV',
  },
];
export default function LandingPage() {
  const [availableGames, setAvailableGames] = useState<GameInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function filterGames() {
      try {
        const res = await fetch('/api/games');
        const data = await res.json();

        const dbGameNames = Array.isArray(data) ? data : [];

        // Filter the hardcoded list based on what's actually in Supabase
        const filtered = ALL_GAMES.filter(game => 
          dbGameNames.some(name => name.toLowerCase() === game.id.toLowerCase())
        );

        setAvailableGames(filtered);
      } catch (err) {
        console.error('Failed to filter games:', err);
      } finally {
        setLoading(false);
      }
    }
    filterGames();
  }, []);

  return (
    <div className="flex flex-col bg-[#05050a] min-h-screen text-white font-sans">
      {/* Top Header for Landing Page */}
      <header className="w-full py-6 px-8 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#05050a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Gamepad2 size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">GameAI</span>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-12 md:mt-20 mb-16 md:mb-24 relative max-w-6xl mx-auto">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-purple-600/10 blur-[80px] md:blur-[180px] rounded-full -z-10 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full -z-10 animate-pulse delay-700" />

          
          <div className="relative mb-12">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-[#0a0a14] border-2 border-purple-500/30 flex items-center justify-center relative overflow-hidden group shadow-[0_0_50px_rgba(168,85,247,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-50" />
              <Gamepad2 size={80} className="text-purple-400 relative z-10 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
              <div className="absolute inset-0 border-2 border-dashed border-purple-500/20 rounded-full animate-[spin_30s_linear_infinite]" />
            </div>
            <div className="absolute -top-6 -right-6 bg-[#121220] p-4 rounded-2xl border border-white/10 shadow-2xl animate-bounce duration-[4s]">
              <Sparkles size={24} className="text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Your Multi-Game AI Expert.<br />
            <span className="text-purple-500">Level Up Your Knowledge.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Get real-time, accurate answers for the games in your library. Start a chat now!
          </p>
        </section>

        {/* Game Grid */}
        <section className="max-w-7xl mx-auto mb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 size={48} className="text-purple-500 animate-spin" />
              <p className="text-gray-500 font-medium animate-pulse">Checking your game library...</p>
            </div>
          ) : availableGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableGames.map((game, index) => (
                <GameCard key={index} {...game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5 max-w-2xl mx-auto">
              <Gamepad2 size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
              <p className="text-gray-400 text-lg font-medium">No experts currently online.</p>
              <p className="text-gray-500 text-sm mt-2">
                Your database is empty. Please run the ingestion pipeline to activate game-specific AI experts.
              </p>
            </div>
          )}
        </section>

        <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
          <p>© 2026 GameAI Expert. Powered by Ollama & Supabase.</p>
        </footer>
      </main>
    </div>
  );
}
