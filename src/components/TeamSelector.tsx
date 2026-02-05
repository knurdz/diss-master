'use client';

import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { Eye, Search, Check, Loader2 } from 'lucide-react';

interface TeamSelectorProps {
  players: Player[];
  currentPlayer: Player;
  onSelect: (team: 'blue' | 'red', role: 'spymaster' | 'operative') => void;
  isLoading: boolean;
}

import { useSound } from '@/hooks/useSound';

export default function TeamSelector({ players, currentPlayer, onSelect, isLoading }: TeamSelectorProps) {
  const { play } = useSound();
  const hasSelected = !!(currentPlayer.team && currentPlayer.role);
  
  // Check which positions are taken
  const isPositionTaken = (team: 'blue' | 'red', role: 'spymaster' | 'operative') => {
    return players.some(p => p.team === team && p.role === role && p.$id !== currentPlayer.$id);
  };
  
  const isCurrentPosition = (team: 'blue' | 'red', role: 'spymaster' | 'operative') => {
    return currentPlayer.team === team && currentPlayer.role === role;
  };
  
  const handleSelect = (team: 'blue' | 'red', role: 'spymaster' | 'operative') => {
    if (!isPositionTaken(team, role) && !isLoading) {
      play('button');
      onSelect(team, role);
    }
  };
  
  return (
    <div className="game-card p-4 md:p-6">
      <h3 className="text-base md:text-lg font-bold mb-2 text-center">Select Your Position</h3>
      <p className="text-white/50 text-sm text-center mb-6">
        {hasSelected ? 'Click another position to switch' : 'Choose a team and role'}
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Blue Team */}
        <div>
          <div className="text-center mb-3">
            <span className="text-blue-400 font-bold text-base md:text-lg">🔵 Blue Team</span>
          </div>
          
          <div className="space-y-2">
            <PositionButton
              team="blue"
              role="spymaster"
              icon={<Eye className="w-5 h-5" />}
              label="Spymaster"
              isTaken={isPositionTaken('blue', 'spymaster')}
              isSelected={isCurrentPosition('blue', 'spymaster')}
              isLoading={isLoading}
              onClick={() => handleSelect('blue', 'spymaster')}
            />
            <PositionButton
              team="blue"
              role="operative"
              icon={<Search className="w-5 h-5" />}
              label="Operative"
              isTaken={isPositionTaken('blue', 'operative')}
              isSelected={isCurrentPosition('blue', 'operative')}
              isLoading={isLoading}
              onClick={() => handleSelect('blue', 'operative')}
            />
          </div>
        </div>
        
        {/* Red Team */}
        <div>
          <div className="text-center mb-3">
            <span className="text-red-400 font-bold text-base md:text-lg">🔴 Red Team</span>
          </div>
          
          <div className="space-y-2">
            <PositionButton
              team="red"
              role="spymaster"
              icon={<Eye className="w-5 h-5" />}
              label="Spymaster"
              isTaken={isPositionTaken('red', 'spymaster')}
              isSelected={isCurrentPosition('red', 'spymaster')}
              isLoading={isLoading}
              onClick={() => handleSelect('red', 'spymaster')}
            />
            <PositionButton
              team="red"
              role="operative"
              icon={<Search className="w-5 h-5" />}
              label="Operative"
              isTaken={isPositionTaken('red', 'operative')}
              isSelected={isCurrentPosition('red', 'operative')}
              isLoading={isLoading}
              onClick={() => handleSelect('red', 'operative')}
            />
          </div>
        </div>
      </div>
      
      {/* Role descriptions */}
      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-white/40">
        <div className="flex items-start gap-2">
          <Eye className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white/60">Spymaster:</span> Gives clues to help your operative find the right words
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Search className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white/60">Operative:</span> Guesses words based on the spymaster&apos;s clues
          </div>
        </div>
      </div>
    </div>
  );
}

interface PositionButtonProps {
  team: 'blue' | 'red';
  role: 'spymaster' | 'operative';
  icon: React.ReactNode;
  label: string;
  isTaken: boolean;
  isSelected: boolean;
  isLoading: boolean;
  onClick: () => void;
}

function PositionButton({ team, role, icon, label, isTaken, isSelected, isLoading, onClick }: PositionButtonProps) {
  const isBlue = team === 'blue';
  
  return (
    <button
      onClick={onClick}
      disabled={isTaken || isLoading}
      className={cn(
        'w-full p-2 md:p-3 rounded-xl flex items-center gap-2 md:gap-3 transition-all',
        'border-2 font-semibold',
        // Selected state
        isSelected && isBlue && 'bg-blue-500/30 border-blue-400 text-blue-200',
        isSelected && !isBlue && 'bg-red-500/30 border-red-400 text-red-200',
        // Available state
        !isSelected && !isTaken && isBlue && 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50',
        !isSelected && !isTaken && !isBlue && 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50',
        // Taken state
        isTaken && 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed',
        // Loading
        isLoading && 'cursor-wait'
      )}
    >
      <div className={cn(
        'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0',
        isSelected && isBlue && 'bg-blue-500/30',
        isSelected && !isBlue && 'bg-red-500/30',
        !isSelected && !isTaken && isBlue && 'bg-blue-500/20',
        !isSelected && !isTaken && !isBlue && 'bg-red-500/20',
        isTaken && 'bg-white/10'
      )}>
        {isLoading && isSelected ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isSelected ? (
          <Check className="w-5 h-5" />
        ) : (
          icon
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="font-semibold text-sm md:text-base">{label}</div>
        <div className="text-[10px] md:text-xs opacity-60">
          {isTaken ? 'Taken' : isSelected ? 'Selected' : 'Available'}
        </div>
      </div>
    </button>
  );
}
