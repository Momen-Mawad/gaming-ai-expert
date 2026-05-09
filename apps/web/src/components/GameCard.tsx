'use client';

import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  accentColor?: string;
}

export default function GameCard({ title, description, image, href, accentColor = 'purple' }: GameCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-[#121220] border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121220] via-[#121220]/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-6 pt-2">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mb-6 line-clamp-2">
          {description}
        </p>
        
        <Link
          href={href}
          className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-500/80 to-purple-600/80 hover:from-cyan-500 hover:to-purple-600 shadow-[0_4px_20px_rgba(168,85,247,0.2)] hover:shadow-purple-500/40"
        >
          Chat Now
        </Link>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute -inset-px rounded-3xl border-2 border-transparent group-hover:border-purple-500/20 pointer-events-none transition-all duration-300" />
    </div>
  );
}
