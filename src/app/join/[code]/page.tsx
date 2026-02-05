'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import { Gamepad2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();
  
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { joinGame } = useGameStore();
  
  const handleJoinGame = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await joinGame(code, username.trim());
      router.push(`/game/${result.gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-xl">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="game-title text-3xl text-white mb-2">Join Game</h1>
          <div className="inline-block px-4 py-2 bg-white/10 rounded-full border border-white/20">
            <span className="text-white/50 text-sm">Game Code: </span>
            <span className="game-title text-xl tracking-[0.2em] text-purple-300">{code}</span>
          </div>
        </div>
        
        {/* Form Card */}
        <div className="game-card p-6 md:p-8 animate-bounce-in" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/50 mb-2 font-medium">Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="clue-input w-full"
                maxLength={20}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-500/20 rounded-xl py-2 px-4">{error}</p>
            )}
            
            <button
              onClick={handleJoinGame}
              disabled={isLoading}
              className="game-btn game-btn-green w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Join Game
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="game-btn w-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
