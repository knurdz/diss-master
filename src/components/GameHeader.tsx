'use client';

import { Game, Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { getTeamScore, getTeamTargetScore } from '@/lib/gameLogic';

interface GameHeaderProps {
  game: Game;
  currentPlayer: Player | null;
}

export default function GameHeader({ game, currentPlayer }: GameHeaderProps) {
  const isGivingClue = game.currentPhase === 'giving_clue';
  const isBlueTurn = game.currentTurn === 'blue';
  
  // Calculate scores for mobile display
  const tiles = game.tiles || [];
  const blueScore = getTeamScore(tiles, 'blue');
  const redScore = getTeamScore(tiles, 'red');
  const blueTarget = getTeamTargetScore(game, 'blue');
  const redTarget = getTeamTargetScore(game, 'red');
  
  // Simplified logic for header text
  let headerTitle = '';
  let headerSubtitle = '';

  if (isGivingClue) {
    if (game.currentTurn === currentPlayer?.team && currentPlayer?.role === 'spymaster') {
      headerTitle = 'GIVE A CLUE';
      headerSubtitle = 'Enter a one-word clue and number';
    } else {
      headerTitle = `${game.currentTurn.toUpperCase()} SPYMASTER`;
      headerSubtitle = 'is thinking of a clue...';
    }
  } else {
    // Guessing phase
    if (game.currentTurn === currentPlayer?.team && currentPlayer?.role === 'operative') {
      headerTitle = 'GUESS THE WORDS';
      headerSubtitle = `Clue: ${game.currentClue?.word} (${game.currentClue?.count})`;
    } else {
      headerTitle = `${game.currentTurn.toUpperCase()} TEAM`;
      headerSubtitle = `is guessing... Clue: ${game.currentClue?.word} (${game.currentClue?.count})`;
    }
  }

  return (
    <div className="text-center mb-4 sm:mb-8 relative z-10 md:mt-10">
      {/* Mobile Score Bar */}
      <div className="flex md:hidden items-center justify-center gap-4 mb-3 mt-12">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/40 rounded-xl border border-blue-500/30">
          <span className="text-blue-400 font-bold text-lg">{blueScore}</span>
          <span className="text-white/40 text-sm">/ {blueTarget}</span>
        </div>
        <div className="text-white/30 text-sm font-bold">VS</div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-900/40 rounded-xl border border-red-500/30">
          <span className="text-red-400 font-bold text-lg">{redScore}</span>
          <span className="text-white/40 text-sm">/ {redTarget}</span>
        </div>
      </div>

      <div className="inline-flex flex-col items-center">
        <h1 className={cn(
          "text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg transform transition-all",
          isBlueTurn ? "text-blue-400" : "text-red-400"
        )}>
          {headerTitle}
        </h1>
        
        <div className="flex items-center gap-2 mt-1 px-3 sm:px-4 py-1 sm:py-1.5 bg-black/30 rounded-full border border-white/10 backdrop-blur-md">
           {isGivingClue && <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />}
           <span className="text-xs sm:text-sm font-medium text-white/80 tracking-wide">
             {headerSubtitle}
           </span>
           {!isGivingClue && <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />}
        </div>
      </div>
    </div>
  );
}
