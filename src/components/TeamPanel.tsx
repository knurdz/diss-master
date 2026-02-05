'use client';

import { Player, Team, Game } from '@/types/game';
import { cn } from '@/lib/utils';
import { Eye, Search, Crown } from 'lucide-react';
import Image from 'next/image';

interface TeamPanelProps {
  team: Team;
  players: Player[];
  game: Game;
  currentPlayer: Player | null;
  score: number;
  targetScore: number;
}

export default function TeamPanel({ team, players, game, currentPlayer, score, targetScore }: TeamPanelProps) {
  const isCurrentTurn = game.currentTurn === team;
  const teamPlayers = players.filter(p => p.team === team);
  const isBlue = team === 'blue';
  const isMyTeam = currentPlayer?.team === team;
  
  const operative = teamPlayers.find(p => p.role === 'operative');
  const spymaster = teamPlayers.find(p => p.role === 'spymaster');
  
  const isSpymasterMe = spymaster?.$id === currentPlayer?.$id;
  const isOperativeMe = operative?.$id === currentPlayer?.$id;
  
  return (
    <div className={cn(
      'w-full rounded-3xl p-4 flex flex-col relative overflow-hidden transition-all duration-300',
      isBlue ? 'bg-gradient-to-br from-blue-900/80 to-blue-950/90 border-blue-500/30' : 'bg-gradient-to-br from-red-900/80 to-red-950/90 border-red-500/30',
      'border-2 shadow-xl backdrop-blur-sm',
      isCurrentTurn && (isBlue ? 'shadow-blue-500/20 ring-2 ring-blue-400/50' : 'shadow-red-500/20 ring-2 ring-red-400/50')
    )}>
      {/* Current Team Indicator */}
      {isMyTeam && (
        <div className={cn(
          "absolute top-0 inset-x-0 h-1",
          isBlue ? "bg-blue-400" : "bg-red-400"
        )} />
      )}

      {/* Team Header & Score */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs font-bold tracking-widest uppercase',
              isBlue ? 'text-blue-200' : 'text-red-200'
            )}>
              {isBlue ? 'BLUE TEAM' : 'RED TEAM'}
            </span>
            {isMyTeam && (
              <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">YOU</span>
            )}
          </div>
          {isCurrentTurn && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white w-fit animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              PLAYING
            </span>
          )}
        </div>
        
        {/* Big Score */}
        <div className={cn(
          'text-5xl font-black leading-none font-extrabold drop-shadow-lg',
          isBlue ? 'text-blue-400' : 'text-red-400'
        )}>
          {targetScore - score}
        </div>
      </div>
      
      {/* Roles Section */}
      <div className="space-y-3">
        <div className={cn(
          "relative group transition-all duration-300 rounded-xl",
          isSpymasterMe && "bg-white/5 ring-1 ring-white/10"
        )}>
          <div className="absolute inset-0 bg-black/20 rounded-xl" />
          <div className="relative p-2 flex items-center gap-3">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              isBlue ? 'text-blue-300 bg-blue-950/50' : 'text-red-300 bg-red-950/50',
              isSpymasterMe && "ring-2 ring-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
            )}>
              <Eye className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider flex items-center gap-2">
                Spymaster
                {isSpymasterMe && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />}
              </div>
              <PlayerName player={spymaster} currentPlayerId={currentPlayer?.$id} />
            </div>
          </div>
        </div>

        <div className={cn(
          "relative group transition-all duration-300 rounded-xl",
          isOperativeMe && "bg-white/5 ring-1 ring-white/10"
        )}>
          <div className="absolute inset-0 bg-black/20 rounded-xl" />
          <div className="relative p-2 flex items-center gap-3">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              isBlue ? 'text-blue-300 bg-blue-950/50' : 'text-red-300 bg-red-950/50',
              isOperativeMe && "ring-2 ring-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
            )}>
              <Search className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider flex items-center gap-2">
                Operative
                {isOperativeMe && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />}
              </div>
              <PlayerName player={operative} currentPlayerId={currentPlayer?.$id} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decorative Icon */}
      <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
        {team === 'blue' ? (
          <Eye className="w-32 h-32" />
        ) : (
          <Search className="w-32 h-32" />
        )}
      </div>
    </div>
  );
}

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
}

function PlayerName({ player, currentPlayerId }: { player?: Player, currentPlayerId?: string }) {
  if (!player) {
    return <div className="text-white/30 text-sm italic font-medium">Waiting...</div>;
  }
  
  const isMe = player.$id === currentPlayerId;
  
  return (
    <div className="flex items-center gap-2">
      <Image
        src={getAvatarUrl(player.odId)}
        alt={player.username}
        width={24}
        height={24}
        unoptimized
        className="w-6 h-6 rounded-full bg-black/20 ring-1 ring-white/10 flex-shrink-0"
      />
      <div className="flex items-center gap-1.5 truncate min-w-0">
        <span className={cn(
          "text-sm font-bold truncate",
          isMe ? "text-yellow-300" : "text-white"
        )}>
          {player.username}
        </span>
        {player.isAdmin && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
        {isMe && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 font-bold px-1.5 py-0.5 rounded ml-1 border border-yellow-500/30">YOU</span>}
      </div>
    </div>
  );
}
