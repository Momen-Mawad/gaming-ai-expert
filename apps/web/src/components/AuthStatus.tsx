'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, LogOut, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthStatus() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  };

  if (loading) return <div className="h-10 w-full bg-white/5 animate-pulse rounded-xl" />;

  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <LogIn size={20} />
          <span className="font-medium">Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 bg-purple-500/10 border border-purple-500/20">
        <User size={20} />
        <span className="font-medium truncate text-sm">{user.email}</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full group"
      >
        <LogOut size={20} className="group-hover:text-red-400" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}
