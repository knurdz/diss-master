'use client';

import { useState } from 'react';
import { Game, Player } from '@/types/game';
import { validateClue, canGiveClue } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';
import { Send, Loader2, Minus, Plus } from 'lucide-react';

interface ClueInputProps {
  game: Game;
  currentPlayer: Player | null;
  onSubmitClue: (word: string, count: number) => void;
  isLoading: boolean;
}

import { useSound } from '@/hooks/useSound';

export default function ClueInput({ game, currentPlayer, onSubmitClue, isLoading }: ClueInputProps) {
  const { play } = useSound();
  const [clueWord, setClueWord] = useState('');
  const [clueCount, setClueCount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const canGive = currentPlayer ? canGiveClue(currentPlayer, game) : false;
  const isBlue = currentPlayer?.team === 'blue';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateClue(clueWord, game.tiles);
    if (!validation.valid) {
      setError(validation.error || 'Invalid clue');
      return;
    }
    
    play('button');
    setError(null);
    onSubmitClue(clueWord.trim(), clueCount);
    setClueWord('');
    setClueCount(1);
  };
  
  const incrementCount = () => {
    if (clueCount < 9) {
      play('button');
      setClueCount(c => c + 1);
    }
  };
  
  const decrementCount = () => {
    if (clueCount > 0) {
      play('button');
      setClueCount(c => c - 1);
    }
  };
  
  if (!canGive) {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto pointer-events-auto">
      <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 bg-[#18181b] p-1.5 sm:p-2 rounded-2xl border-2 border-[#27272a] shadow-2xl">
        
        {/* Input Field */}
        <div className="flex-1 relative group">
          <input
            type="text"
            value={clueWord}
            onChange={(e) => {
              setClueWord(e.target.value.replace(/\s/g, '').toUpperCase());
              setError(null);
            }}
            placeholder="TYPE YOUR CLUE..."
            disabled={isLoading}
            autoFocus
            className="w-full h-10 sm:h-12 md:h-14 bg-[#09090b] rounded-xl px-3 sm:px-4 font-extrabold text-xl sm:text-2xl tracking-wider text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 transition-all"
          />
        </div>
        
        {/* Controls Container */}
        <div className="flex items-center gap-2">
            {/* Number Selector */}
            <div className="h-10 sm:h-12 md:h-14 flex items-center bg-[#09090b] rounded-xl px-1 border border-white/5">
              <button
                type="button"
                onClick={decrementCount}
                disabled={clueCount <= 0 || isLoading}
                aria-label="Decrease count"
                className="w-10 h-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="w-8 text-center font-extrabold text-2xl text-white pt-1">
                {clueCount === 0 ? '∞' : clueCount}
              </div>
              
              <button
                type="button"
                onClick={incrementCount}
                disabled={clueCount >= 9 || isLoading}
                aria-label="Increase count"
                className="w-10 h-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !clueWord.trim()}
              className={cn(
                'h-10 sm:h-12 md:h-14 px-4 sm:px-6 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg text-sm sm:text-base',
                isBlue 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:translate-y-0.5'
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>GIVE</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
        </div>
      </div>
      
      {error && (
        <div className="absolute left-0 right-0 -top-12 flex justify-center pointer-events-none">
            <div className="bg-red-500 text-white text-sm font-bold py-1.5 px-4 rounded-full shadow-lg animate-bounce">
                {error}
            </div>
        </div>
      )}
    </form>
  );
}
