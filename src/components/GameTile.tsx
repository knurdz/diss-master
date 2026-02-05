'use client';

import { Tile } from '@/types/game';
import { cn } from '@/lib/utils';
import { Skull, CheckCircle2, MousePointer2, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface GameTileProps {
  tile: Tile;
  isSpymaster: boolean;
  canSelect: boolean;
  onToggle: () => void;
  onConfirm: () => void;
  currentPlayerId?: string;
  enableMeanings?: boolean;
  onShowMeaning?: () => void;
}

export default function GameTile({ 
  tile, 
  isSpymaster, 
  canSelect, 
  onToggle, 
  onConfirm,
  currentPlayerId,
  enableMeanings,
  onShowMeaning
}: GameTileProps) {
  const { word, color, revealed, tentativeBy = [], imageIndex } = tile;
  
  const isTentativeSelf = currentPlayerId ? tentativeBy.includes(currentPlayerId) : false;
  const tentativeOthers = currentPlayerId ? tentativeBy.filter(id => id !== currentPlayerId) : tentativeBy;
  const hasTentativeOthers = tentativeOthers.length > 0;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canSelect && !revealed) {
      onToggle();
    }
  };
  
  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canSelect && !revealed) {
      onConfirm();
    }
  };

  const handleShowMeaning = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowMeaning?.();
  }
  
  // Use imageIndex from tile if available, otherwise fallback with word-based hash
  const getImagePath = () => {
    if (imageIndex !== undefined) {
      return `/card-images/${imageIndex}.jpg`;
    }
    // Fallback for old tiles without imageIndex - use word hash to reduce duplicates
    const wordHash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const uniqueId = (tile.id * 31 + wordHash) % 1000;
    
    if (color === 'red') {
      return `/card-images/${(uniqueId % 9) + 1}.jpg`;
    } else if (color === 'blue') {
      return `/card-images/${(uniqueId % 9) + 10}.jpg`;
    } else if (color === 'black') {
      return `/card-images/19.jpg`;
    } else {
      return `/card-images/${(uniqueId % 11) + 20}.jpg`;
    }
  };
  
  return (
    <div 
      className="relative aspect-[16/10] group"
      style={{ perspective: '1000px' }}
    >
      {/* Flip Container */}
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-500 ease-in-out",
          revealed && "animate-flip"
        )}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Face (Word Card) */}
        <button
          onClick={handleClick}
          disabled={revealed || !canSelect}
          className={cn(
            'absolute inset-0 w-full h-full flex flex-col overflow-hidden rounded-md transition-all duration-200 backface-hidden',
            'shadow-md hover:shadow-lg active:scale-95',
            
            // --- Spymaster View (Unrevealed) ---
            !revealed && isSpymaster && color === 'blue' && 'bg-[#0CAADC]',
            !revealed && isSpymaster && color === 'red' && 'bg-[#FF6D4D]',
            !revealed && isSpymaster && color === 'neutral' && 'bg-[#F2D7B6]',
            !revealed && isSpymaster && color === 'black' && 'bg-[#4C4C4C]',
            
            // --- Operative View (Unrevealed) ---
            !revealed && !isSpymaster && 'bg-[#F2D7B6] hover:bg-[#FFE4c4]',
            
            // Interactive Borders/Rings
            isTentativeSelf && !revealed && 'ring-4 ring-green-500 z-10',
            !isTentativeSelf && hasTentativeOthers && !revealed && 'ring-2 ring-white/50 ring-dashed z-10',
            
            // Hide when revealed (flipped)
            revealed && 'invisible'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Main Content Area */}
          <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
              {/* Word Text */}
              <span className={cn(
                "relative z-10 font-black text-[10px] xs:text-xs sm:text-base md:text-lg uppercase tracking-wider px-0.5 text-center leading-tight",
                
                // Text Colors
                isSpymaster && color !== 'neutral' ? 'text-white' : 'text-[#5C4033]',
                // Spymaster Neutral text
                isSpymaster && color === 'neutral' && 'text-[#8B5A2B]',
                // Unrevealed Text (Operative)
                !isSpymaster && 'text-[#5C4033]'
              )}>
                {word}
              </span>

               {/* Spymaster indicator for unrevealed tiles */}
               {isSpymaster && !revealed && (
                  <div className="absolute top-1 right-1 opacity-40">
                     {color === 'black' && <Skull className="w-3 h-3 text-white" />}
                  </div>
               )}
          </div>

          {/* Bottom Bar (Darker Shade) */}
          <div className={cn(
            "w-full h-3 sm:h-4",
            
            // --- Spymaster Bottom Bar ---
            isSpymaster && color === 'blue' && 'bg-[#008CB8]',
            isSpymaster && color === 'red' && 'bg-[#DE4A2D]',
            isSpymaster && color === 'neutral' && 'bg-[#D4B48C]',
            isSpymaster && color === 'black' && 'bg-[#333333]',

            // --- Operative Bottom Bar (Unrevealed) ---
            !isSpymaster && 'bg-[#D4B48C]',
          )} />

          {/* Tentative Indicators overlay */}
          {hasTentativeOthers && (
               <div className="absolute top-1 left-1 flex gap-1 z-20">
                 {tentativeOthers.map((pid) => (
                   <div key={pid} className="bg-black/40 p-1 rounded-full border border-white/20">
                     <MousePointer2 className="w-3 h-3 text-white" />
                   </div>
                 ))}
               </div>
          )}
        </button>

        {/* Back Face (Image) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-md overflow-hidden shadow-md backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <Image 
            src={getImagePath()}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 20vw, 15vw"
          />
        </div>
      </div>

      {/* Confirm Button */}
      {isTentativeSelf && !revealed && (
        <button
          onClick={handleConfirm}
          className="absolute -top-3 -right-3 z-20 bg-green-500 hover:bg-green-400 text-white p-2 rounded-full shadow-lg border-4 border-[#09090b] animate-bounce-in transition-transform hover:scale-110 active:scale-95"
          title="Confirm Guess"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
      )}

        {/* Meaning Button (Operative Only, Unrevealed) */}
        {!isSpymaster && !revealed && enableMeanings && (
            <button
                onClick={handleShowMeaning}
                className="absolute bottom-4 left-1 z-20 text-[#5C4033]/40 hover:text-[#5C4033] hover:scale-110 transition-all p-1"
                title="Word Meaning"
            >
                <BookOpen className="w-4 h-4" />
            </button>
        )}
    </div>
  );
}
