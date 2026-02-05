'use client';

import { LogEntry } from '@/types/game';
import { cn } from '@/lib/utils';
import { ScrollText, Check } from 'lucide-react';
import Image from 'next/image';
function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
}

interface GameLogPanelProps {
  logs: LogEntry[];
}

export default function GameLogPanel({ logs = [] }: GameLogPanelProps) {

  // Helper to get initials (kept for fallback if needed, but unused generally)
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : '??';

  // Group consecutive guesses
  const groupedLogs = logs.reduce((acc: any[], log) => {
    const last = acc[acc.length - 1];
    
    // Check if we can group with the last entry
    // We group if:
    // 1. Current is a guess
    // 2. Last is a guess group OR a single guess (which we'll convert to group)
    // 3. Same team (and arguably same player, but for "one row" visual, same team is key)
    
    if (log.type === 'guess') {
        if (last && last.type === 'guessGroup' && last.team === log.team) {
            last.guesses.push(log);
            return acc;
        }
        
        // Start a new group
        acc.push({
            type: 'guessGroup',
            id: log.id,
            team: log.team,
            playerName: log.playerName,
            guesses: [log]
        });
        return acc;
    }
    
    // Not a guess, just push normal log
    acc.push(log);
    return acc;
  }, []);

  return (
    <div className="game-card flex flex-col max-h-96 bg-[#4a5568] backdrop-blur-sm border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-black/20 p-3 flex items-center justify-between cursor-default border-b border-white/5">
        <div className="flex-1 text-center">
           <h3 className="text-xl font-bold tracking-widest text-white/90 uppercase">
             GAME LOG
           </h3>
        </div>
        <ScrollText className="w-5 h-5 text-white/30" />
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar p-3 space-y-3">
        {logs.length === 0 ? (
            <div className="text-white/30 text-center py-8 text-sm italic">
                No activity yet.
            </div>
        ) : (
            <div className="relative space-y-4">
                {groupedLogs.map((item) => {
                    const isGroup = item.type === 'guessGroup';
                    const key = isGroup ? item.guesses[0].id : item.id;
                    
                    // Render guess group - pills with embedded avatars
                    if (isGroup) {
                        const allCorrect = item.guesses.every((g: LogEntry) => g.metadata?.isCorrect);
                        return (
                            <div key={key} className="animate-fade-in flex flex-wrap items-center gap-1.5 pl-1">
                                {item.guesses.map((g: LogEntry) => (
                                    <div key={g.id} className="relative">
                                        {/* Pill with embedded avatar */}
                                        <div className={cn(
                                           "pl-6 pr-2 py-1 rounded-md flex items-center gap-1 shadow-sm min-w-[60px]",
                                           // Background Color = TILE Identity
                                           g.metadata?.tileColor === 'blue' && "bg-[#38bdf8]",
                                           g.metadata?.tileColor === 'red' && "bg-[#f87171]",
                                           g.metadata?.tileColor === 'neutral' && "bg-[#C2B280]",
                                           g.metadata?.tileColor === 'black' && "bg-[#1f2937]",
                                        )}>
                                           {/* Small Avatar embedded in pill */}
                                           <div className="absolute left-0.5 top-1/2 -translate-y-1/2 flex flex-col items-center">
                                              <Image
                                                src={getAvatarUrl(g.playerOdId || g.playerName)}
                                                alt={g.playerName}
                                                width={20}
                                                height={20}
                                                unoptimized
                                                className="w-5 h-5 rounded-full border border-white/50 bg-black/20 shadow-sm"
                                              />
                                              {/* Name tag below avatar */}
                                              <span className="text-[5px] font-bold text-white bg-black/60 px-0.5 rounded -mt-0.5 relative z-10">
                                                {g.playerName}
                                              </span>
                                           </div>
                                           
                                           {/* Word */}
                                           <span className={cn(
                                             "font-bold text-[10px] uppercase tracking-wide",
                                             g.metadata?.tileColor === 'neutral' ? "text-[#4A3728]" : "text-white"
                                           )}>
                                             {g.metadata?.tileWord}
                                           </span>
                                        </div>
                                    </div>
                                ))}
                                {/* Green checkmark if all guesses are correct */}
                                {allCorrect && (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 shadow-md ml-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Render Clue bar (skip pass events entirely)
                    const log = item;
                    if (log.type === 'pass') return null;
                    
                    return (
                    <div key={log.id} className="animate-fade-in group relative z-10">
                        {/* ---------------- CLUE BAR STYLE ---------------- */}
                        {log.type === 'clue' && (
                          <div className="relative pl-10 mb-1">
                             {/* Avatar Circle (Floating Left) */}
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                                <Image
                                  src={getAvatarUrl(log.playerOdId || log.playerName)}
                                  alt={log.playerName}
                                  width={32}
                                  height={32}
                                  unoptimized
                                  className={cn(
                                    "w-8 h-8 rounded-full border-2 shadow-md bg-black/20",
                                    log.team === 'blue' ? "border-[#38bdf8]" : "border-[#f87171]"
                                  )}
                                />
                                {/* Name tag below avatar */}
                                <span className={cn(
                                  "text-[6px] font-bold px-1 py-0.5 rounded -mt-1 relative z-30 uppercase text-white",
                                  log.team === 'blue' ? "bg-[#38bdf8]" : "bg-[#f87171]"
                                )}>
                                  {log.playerName}
                                </span>
                             </div>

                             {/* The Bar */}
                             <div className={cn(
                               "h-7 w-full rounded-r-lg rounded-l-full flex items-center pl-3 pr-1 gap-1 shadow-md relative z-10",
                               log.team === 'blue' ? "bg-[#38bdf8]" : "bg-[#f87171]"
                             )}>
                                {/* The White Word Pill */}
                                <div className="flex-1 bg-white h-5 rounded flex items-center justify-center shadow-inner mx-0.5">
                                   <span className="font-sans font-bold text-xs uppercase text-black tracking-wide">
                                     {log.metadata?.word}
                                   </span>
                                </div>

                                {/* Count Circle */}
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 border border-gray-100">
                                   <span className="font-sans font-bold text-xs text-black">
                                     {log.metadata?.count === 0 ? '∞' : log.metadata?.count}
                                   </span>
                                </div>
                             </div>
                          </div>
                        )}
                    </div>
                    );
                })}

            </div>
        )}
      </div>
    </div>
  );
}
