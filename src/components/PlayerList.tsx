'use client';

import { Player, Team, Role } from '@/types/game';
import Image from 'next/image';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
}

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
}

export default function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  const getTeamPlayers = (team: Team) => players.filter(p => p.team === team);
  const unassigned = players.filter(p => !p.team);
  
  return (
    <div className="w-full max-w-sm">
      {/* Blue Team */}
      <div className="mb-4">
        <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          Blue Team
        </h3>
        <div className="space-y-1">
          <PlayerSlot 
            role="spymaster" 
            player={getTeamPlayers('blue').find(p => p.role === 'spymaster')}
            currentPlayerId={currentPlayerId}
            team="blue"
          />
          <PlayerSlot 
            role="operative" 
            player={getTeamPlayers('blue').find(p => p.role === 'operative')}
            currentPlayerId={currentPlayerId}
            team="blue"
          />
        </div>
      </div>
      
      {/* Red Team */}
      <div className="mb-4">
        <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Red Team
        </h3>
        <div className="space-y-1">
          <PlayerSlot 
            role="spymaster" 
            player={getTeamPlayers('red').find(p => p.role === 'spymaster')}
            currentPlayerId={currentPlayerId}
            team="red"
          />
          <PlayerSlot 
            role="operative" 
            player={getTeamPlayers('red').find(p => p.role === 'operative')}
            currentPlayerId={currentPlayerId}
            team="red"
          />
        </div>
      </div>
      
      {/* Unassigned */}
      {unassigned.length > 0 && (
        <div className="mt-6">
          <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">
            Waiting to Join
          </h3>
          <div className="space-y-2">
            {unassigned.map(player => (
              <div 
                key={player.$id}
                className={cn(
                  "px-3 py-2 rounded-xl bg-[#18181b] border border-white/5 flex items-center gap-3 transition-all",
                  player.$id === currentPlayerId ? 'ring-1 ring-yellow-500/50 bg-yellow-500/5' : ''
                )}
              >
                <Image
                  src={getAvatarUrl(player.odId)}
                  alt={player.username}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex items-center gap-2">
                   <span className="text-white/80 font-medium truncate text-sm">
                      {player.username}
                   </span>
                   {player.isAdmin && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">Host</span>}
                   {player.$id === currentPlayerId && <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">You</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PlayerSlotProps {
  role: Role;
  player?: Player;
  currentPlayerId?: string;
  team: Team;
}

function PlayerSlot({ role, player, currentPlayerId, team }: PlayerSlotProps) {
  const roleLabel = role === 'spymaster' ? 'Spymaster' : 'Operative';
  const bgColor = team === 'blue' ? 'bg-blue-500/10' : 'bg-red-500/10';
  const borderColor = team === 'blue' ? 'border-blue-500/20' : 'border-red-500/20';
  const labelColor = team === 'blue' ? 'text-blue-300' : 'text-red-300';
  
  return (
    <div className={`
      px-3 py-2.5 rounded-xl border ${borderColor} ${bgColor}
      flex items-center justify-between min-h-[52px] transition-all
    `}>
      <span className={`text-xs uppercase tracking-wider font-bold ${labelColor} opacity-70`}>{roleLabel}</span>
      
      {player ? (
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5">
               {player.isAdmin && <span className="text-[10px] text-yellow-500">★</span>}
               <span className={`
                 text-sm font-bold
                 ${player.$id === currentPlayerId ? 'text-white' : 'text-white/90'}
               `}>
                 {player.username}
               </span>
             </div>
             {player.$id === currentPlayerId && <span className="text-[10px] text-green-400 font-medium tracking-wide">YOU</span>}
          </div>
          
          <Image
            src={getAvatarUrl(player.odId)}
            alt={player.username}
            width={32}
            height={32}
            unoptimized
            className="w-8 h-8 rounded-full bg-black/20 ring-2 ring-white/10"
          />
        </div>
      ) : (
        <span className="text-xs text-white/20 italic font-medium">Empty</span>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
