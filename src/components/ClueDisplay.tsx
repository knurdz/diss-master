'use client';

import { Game, Player } from '@/types/game';
import { canGuess } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';
import { MessageCircle, SkipForward, Loader2, Target } from 'lucide-react';

interface ClueDisplayProps {
  game: Game;
  currentPlayer: Player | null;
  onEndTurn: () => void;
  isLoading: boolean;
}

import { useSound } from '@/hooks/useSound';

export default function ClueDisplay({ game, currentPlayer, onEndTurn, isLoading }: ClueDisplayProps) {
  const { play } = useSound();
  const { currentClue, guessesRemaining } = game;
  const playerCanGuess = currentPlayer ? canGuess(currentPlayer, game) : false;
  const isBlue = game.currentTurn === 'blue';
  
  const handleEndTurn = () => {
    play('button');
    onEndTurn();
  };
  
  if (!currentClue) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-[#18181b] border-2 border-[#27272a] rounded-2xl p-4 shadow-xl flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
          <span className="text-white/50 font-medium tracking-wide">WAITING FOR CLUE...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto pointer-events-auto">
      <div className={cn(
        "flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl border-2 shadow-2xl transition-all",
        "bg-[#18181b] border-[#27272a]"
      )}>
        
        {/* Clue Section */}
        <div className={cn(
          "flex-1 w-full sm:w-auto flex items-center justify-center gap-4 sm:gap-6 px-4 sm:px-8 py-2 sm:py-4 rounded-xl",
          isBlue ? "bg-blue-900/30" : "bg-red-900/30"
        )}>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 text-white mb-1">Current Clue</span>
            <span className={cn(
              "font-extrabold text-2xl sm:text-4xl tracking-wide leading-none drop-shadow-lg",
              isBlue ? "text-blue-400" : "text-red-400"
            )}>
              {currentClue.word.toUpperCase()}
            </span>
          </div>
          
          <div className="w-px h-12 bg-white/10" />
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 text-white mb-1">Count</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <span className="font-extrabold text-2xl text-white pt-1">
                {currentClue.count === 0 ? '∞' : currentClue.count}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        {playerCanGuess ? (
          <button
            onClick={handleEndTurn}
            disabled={isLoading}
            className={cn(
              "w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg whitespace-nowrap text-sm sm:text-base",
              "bg-[#27272a] hover:bg-[#3f3f46] text-white border border-white/10",
              "disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="text-sm">End Turn</span>
                <SkipForward className="h-4 w-4" />
              </>
            )}
          </button>
        ) : (
          // Status indicator for non-guessing players
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
             <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
               {currentPlayer?.team === game.currentTurn ? 'Teammate Guessing' : 'Opponent Guessing'}
             </span>
          </div>
        )}
      </div>
    </div>
  );
}
