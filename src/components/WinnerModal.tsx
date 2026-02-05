'use client';

import { Game } from '@/types/game';
import { cn } from '@/lib/utils';
import { Trophy, Home, PartyPopper, Skull, Eye } from 'lucide-react';

interface WinnerModalProps {
  game: Game;
  onGoHome: () => void;
  onClose?: () => void;
}

import { useSound } from '@/hooks/useSound';

export default function WinnerModal({ game, onGoHome, onClose }: WinnerModalProps) {
  const { play } = useSound();
  const { winner } = game;
  const isBlueWinner = winner === 'blue';
  const isRedWinner = winner === 'red';
  const isDraw = !winner;
  
  // Check if won by assassin
  const blackTileRevealed = game.tiles.find(t => t.color === 'black' && t.revealed);
  const wonByAssassin = winner && blackTileRevealed?.revealedBy !== winner;
  
  const handleGoHome = () => {
    play('button');
    onGoHome();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ... (rest of the component) ... */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Confetti effect code omitted for brevity but preserved in DOM */}
      {!isDraw && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
             <div key={i} className="hidden" /> /* Placeholder to avoid rendering diff complexity, assume existing */
          ))}
          {/* Re-rendering full content to ensure correct replacement */}
        </div>
      )}
      {!isDraw && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-4 h-4 rounded-sm animate-float',
                i % 4 === 0 && 'bg-blue-500',
                i % 4 === 1 && 'bg-red-500',
                i % 4 === 2 && 'bg-yellow-500',
                i % 4 === 3 && 'bg-green-500'
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className={cn(
        'relative game-card p-8 md:p-12 max-w-lg w-full text-center',
        'animate-bounce-in'
      )}>
        {/* Icon */}
        <div className={cn(
          'w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg',
          isBlueWinner && 'bg-gradient-to-br from-blue-400 to-blue-600',
          isRedWinner && 'bg-gradient-to-br from-red-400 to-red-600',
          isDraw && 'bg-gradient-to-br from-gray-600 to-gray-800'
        )}>
          {wonByAssassin ? (
            <Skull className="w-12 h-12 text-white" />
          ) : isDraw ? (
            <div className="text-4xl">🛑</div>
          ) : (
            <Trophy className="w-12 h-12 text-white" />
          )}
        </div>
        
        {/* Title */}
        <h2 className={cn(
          'game-title text-4xl md:text-5xl mb-4',
          isBlueWinner && 'text-blue-400',
          isRedWinner && 'text-red-400',
          isDraw && 'text-white'
        )}>
          {isBlueWinner ? '🔵 BLUE WINS!' : isRedWinner ? '🔴 RED WINS!' : 'GAME ENDED'}
        </h2>
        
        {/* Subtitle */}
        <p className="text-white/70 text-lg mb-8">
          {wonByAssassin ? (
            <>
              <Skull className="inline w-5 h-5 mr-2 text-red-400" />
              The assassin was revealed!
            </>
          ) : isDraw ? (
            <>
               The game was ended by the admin.
            </>
          ) : (
            <>
              <PartyPopper className="inline w-5 h-5 mr-2 text-yellow-400" />
              All agents have been found!
            </>
          )}
        </p>
        
        {/* Score Summary */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{game.blueScore}</div>
            <div className="text-sm text-white/50">Blue Score</div>
          </div>
          <div className="text-3xl font-bold text-white/30">vs</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{game.redScore}</div>
            <div className="text-sm text-white/50">Red Score</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto w-full">
          {onClose && (
            <button
              onClick={() => {
                play('button');
                onClose();
              }}
              className="game-btn w-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              <span>View Board</span>
            </button>
          )}
          <button
            onClick={handleGoHome}
            className="game-btn game-btn-green w-full flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
