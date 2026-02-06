'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, Power, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';

interface GameMenuProps {
  isAdmin: boolean;
  onEndGame: () => void;
  onLeaveGame?: () => void;
  gameFinished?: boolean;
}

export default function GameMenu({ isAdmin, onEndGame, onLeaveGame, gameFinished }: GameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    play('button');
    setIsOpen(!isOpen);
  };

  const handleEndGame = () => {
    play('button');
    setIsOpen(false);
    onEndGame();
  };

  const handleLeaveGame = () => {
    play('button');
    setIsOpen(false);
    onLeaveGame?.();
  };

  const btnBase = "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95";

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Desktop: inline buttons */}
      {(isAdmin || gameFinished) && (
        <div className="hidden md:flex items-center gap-2">
        {gameFinished ? (
          <button
            onClick={handleLeaveGame}
            className={cn(btnBase, "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20")}
          >
            <LogOut className="w-4 h-4" />
            <span>Leave</span>
          </button>
        ) : isAdmin ? (
          <button
            onClick={handleEndGame}
            className={cn(btnBase, "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20")}
          >
            <Power className="w-4 h-4" />
            <span>End Game</span>
          </button>
        ) : null}
        </div>
      )}

      {/* Mobile: dropdown menu */}
      {(isAdmin || gameFinished) && (
        <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className={cn(
            "p-2 rounded-xl transition-all border border-transparent hover:bg-white/10 active:scale-95",
            isOpen ? "bg-white/10 border-white/10 text-white" : "text-white/70 hover:text-white"
          )}
          aria-label="Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 origin-top-right">
            <div className="flex flex-col gap-1">
              {gameFinished ? (
                <button
                  onClick={handleLeaveGame}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Leave Game</span>
                </button>
              ) : isAdmin ? (
                <button
                  onClick={handleEndGame}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left text-sm font-medium"
                >
                  <Power className="w-4 h-4" />
                  <span>End Game</span>
                </button>
              ) : null}
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
