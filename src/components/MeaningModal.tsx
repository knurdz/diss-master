'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Loader2, BookOpen, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Game, Player } from '@/types/game';

interface MeaningModalProps {
  word: string;
  onClose: () => void;
  game: Game;
  currentPlayer: Player;
}

export default function MeaningModal({ word, onClose, game, currentPlayer }: MeaningModalProps) {
  const [step, setStep] = useState<'confirm' | 'result'>('confirm');
  const [definition, setDefinition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getWordMeaning } = useGameStore();
  
  const used = currentPlayer.meaningsUsed || 0;
  const max = game.maxMeaningsPerPlayer || 0;
  const remaining = max - used;

  const handleReveal = async () => {
    if (remaining <= 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const def = await getWordMeaning(word);
      setDefinition(def);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get definition');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative game-card p-6 w-full max-w-sm animate-bounce-in">
        <button 
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <h3 className="game-title text-2xl text-white">{word}</h3>
        </div>

        {step === 'confirm' ? (
             <div className="space-y-4">
               {error && (
                 <div className="p-3 bg-red-500/20 text-red-400 text-sm rounded-lg text-center">
                    {error}
                 </div>
               )}
               
               <div className="text-center space-y-2">
                 <p className="text-white/80">Reveal meaning for this word?</p>
                 <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                    Checks remaining: <span className={remaining > 0 ? "text-green-400" : "text-red-400"}>{remaining}</span>/{max}
                 </div>
               </div>

               <div className="flex gap-3">
                 <button
                   onClick={onClose}
                   className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleReveal}
                   disabled={isLoading || remaining <= 0}
                   className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold flex justify-center items-center"
                 >
                   {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                 </button>
               </div>
             </div>
        ) : (
            <div className="space-y-6">
                <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                    <p className="text-lg italic text-white/90 leading-relaxed font-sans">
                      &ldquo;{definition}&rdquo;
                    </p>
                </div>
                
                 <button
                   onClick={onClose}
                   className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium"
                 >
                   Close
                 </button>
            </div>
        )}
      </div>
    </div>
  );
}
