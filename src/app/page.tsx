'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import { Plus, Users, Gamepad2, Sparkles, Loader2, ArrowRight, ArrowLeft, Info } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [username, setUsername] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Words State
  const [customWordsMode, setCustomWordsMode] = useState(false);
  const [customWordsInput, setCustomWordsInput] = useState('');
  
  // Meanings State
  const [enableMeanings, setEnableMeanings] = useState(false);
  const [maxMeanings, setMaxMeanings] = useState(3);
  
  const { createNewGame, joinGame } = useGameStore();
  
  const handleCreateGame = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let customWords: string[] = [];
      if (customWordsMode && customWordsInput.trim()) {
         customWords = customWordsInput
            .split(/[\n,]+/) // Split by newline or comma
            .map(w => w.trim())
            .filter(w => w.length > 0);
      }

      const result = await createNewGame(username.trim(), customWords, enableMeanings, maxMeanings);
      router.push(`/game/${result.gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
      setIsLoading(false);
    }
  };
  
  const handleJoinGame = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!gameCode.trim()) {
      setError('Please enter a game code');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await joinGame(gameCode.trim().toUpperCase(), username.trim());
      router.push(`/game/${result.gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      {/* Floating decorations removed for cleaner look, body background handles the gamey grid */ }

      
      <div className="relative w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-6 sm:mb-8 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-red-500 mb-3 sm:mb-4 shadow-xl">
            <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="game-title text-4xl sm:text-5xl md:text-6xl mb-2 whitespace-nowrap">
            <span className="text-blue-400">DISS</span>
            <span className="text-red-400">-MASTER</span>
          </h1>
          <p className="text-white/50 flex items-center justify-center gap-2 text-sm sm:text-base">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            The ultimate word game
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </p>
        </div>
        
        {/* Main Card */}
        <div className="game-card p-4 sm:p-6 md:p-8 animate-bounce-in [animation-delay:0.1s]">
          {mode === 'menu' && (
            <div className="space-y-4">
              <button
                onClick={() => setMode('create')}
                className="game-btn game-btn-blue w-full flex items-center justify-center gap-3 text-lg"
              >
                <Plus className="w-6 h-6" />
                Create Game
              </button>
              
              <button
                onClick={() => setMode('join')}
                className="game-btn game-btn-green w-full flex items-center justify-center gap-3 text-lg"
              >
                <Users className="w-6 h-6" />
                Join Game
              </button>
            </div>
          )}
          
          {mode === 'create' && (
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
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateGame()}
                  autoFocus
                />
              </div>

              {/* Word Source Toggle */}
              <div>
                 <label className="block text-sm text-white/50 mb-2 font-medium">Word Source</label>
                 <div className="flex bg-black/20 p-1 rounded-xl">
                    <button
                      onClick={() => setCustomWordsMode(false)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                        !customWordsMode ? "bg-white text-black shadow-lg" : "text-white/50 hover:text-white"
                      )}
                    >
                      Default
                    </button>
                    <button
                      onClick={() => setCustomWordsMode(true)}
                       className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                        customWordsMode ? "bg-blue-500 text-white shadow-lg" : "text-white/50 hover:text-white"
                      )}
                    >
                      Custom Words
                    </button>
                 </div>
              </div>

              {/* Custom Words Input */}
              {customWordsMode && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm text-white/50 mb-2 font-medium">
                        Enter Words (comma or newline separated)
                        <span className="block text-xs text-white/30 font-normal mt-0.5">
                           If {'>'} 25 words: 25 random will be picked. <br/>
                           If {'<'} 25 words: remaining will be auto-filled.
                        </span>
                    </label>
                    <textarea
                        value={customWordsInput}
                        onChange={(e) => setCustomWordsInput(e.target.value)}
                        placeholder="apple, banana, cherry..."
                        className="w-full h-32 bg-[#09090b] rounded-xl p-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none border border-white/5"
                    />
                  </div>
              )}

              {/* Meanings Settings */}
              <div className="bg-black/20 p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Enable Word Meanings</span>
                        <span className="text-xs text-white/50">Allow players to check word definitions</span>
                     </div>
                     <button
                        onClick={() => setEnableMeanings(!enableMeanings)}
                        aria-label="Toggle word meanings"
                        className={cn(
                           "w-12 h-6 rounded-full transition-colors relative",
                           enableMeanings ? "bg-green-500" : "bg-white/10"
                        )}
                     >
                        <div className={cn(
                           "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                           enableMeanings ? "translate-x-6" : "translate-x-0"
                        )} />
                     </button>
                  </div>
                  
                  {enableMeanings && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                         <label className="block text-sm text-white/50 mb-2 font-medium">Max Checks per Player</label>
                         <input
                           type="number"
                           min={1}
                           max={10}
                           value={maxMeanings}
                           onChange={(e) => setMaxMeanings(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                           aria-label="Max checks per player"
                           className="clue-input w-full"
                         />
                      </div>
                  )}
              </div>
              
              {error && (
                <p className="text-red-400 text-sm text-center bg-red-500/20 rounded-xl py-2 px-4 animate-bounce-in">{error}</p>
              )}
              
              <button
                onClick={handleCreateGame}
                disabled={isLoading}
                className="game-btn game-btn-blue w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Game
                  </>
                )}
              </button>
              
              <button
                onClick={() => { setMode('menu'); setError(null); }}
                className="game-btn w-full bg-white/10 hover:bg-white/20 text-white"
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </span>
              </button>
            </div>
          )}
          
          {mode === 'join' && (
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
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/50 mb-2 font-medium">Game Code</label>
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  placeholder="Enter game code"
                  className="clue-input w-full text-center tracking-[0.3em] font-bold"
                  maxLength={6}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
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
                    Join Game
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <button
                onClick={() => { setMode('menu'); setError(null); }}
                className="game-btn w-full bg-white/10 hover:bg-white/20 text-white"
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </span>
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-white/30 text-sm">
            2-4 players • Real-time multiplayer
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm font-medium transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            About &amp; Credits
          </Link>
        </div>
      </div>
    </div>
  );
}
