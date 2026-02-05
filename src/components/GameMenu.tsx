'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, Info, Power, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSound } from '@/hooks/useSound';

interface GameMenuProps {
  isAdmin: boolean;
  onEndGame: () => void;
}

export default function GameMenu({ isAdmin, onEndGame }: GameMenuProps) {
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
  
  const handleLinkClick = () => {
    play('button');
    setIsOpen(false);
  }

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={cn(
          "p-2 rounded-xl transition-all border border-transparent hover:bg-white/10 active:scale-95",
          isOpen ? "bg-white/10 border-white/10 text-white" : "text-white/70 hover:text-white"
        )}
        aria-label="Menu"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 origin-top-right">
          <div className="flex flex-col gap-1">
             {/* About Link */}
            <Link 
              href="/about" 
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm sm:text-base"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button
                  onClick={handleEndGame}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left text-sm sm:text-base font-medium"
                >
                  <Power className="w-4 h-4" />
                  <span>End Game</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
