'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';
import ClueInput from '@/components/ClueInput';
import ClueDisplay from '@/components/ClueDisplay';
import TeamPanel from '@/components/TeamPanel';
import TeamSelector from '@/components/TeamSelector';
import ShareLink from '@/components/ShareLink';
import WinnerModal from '@/components/WinnerModal';
import GameLogPanel from '@/components/GameLogPanel';
import { canStartGame, getTeamScore, getTeamTargetScore } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';
import { Users, Play, Loader2, ArrowLeft, Crown, Gamepad2, BookOpen, Info, Menu, X } from 'lucide-react';
import Image from 'next/image';

import { useSound } from '@/hooks/useSound';
import ConfirmationModal from '@/components/ConfirmationModal';
import GameMenu from '@/components/GameMenu';
function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
}

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const { play } = useSound();
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const {
    game,
    players,
    currentPlayer,
    isLoading,
    error,
    loadGame,
    refreshGameSilent,
    startGame,
    selectTeamAndRole,
    giveClue,
    confirmGuess,
    toggleTentativeGuess,
    endTurn,
    endGame,
    subscribeToUpdates,
    setError,
    leaveGame,
  } = useGameStore();

  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState('');
  const { joinGame } = useGameStore();
  
  // Silent refresh for polling (doesn't trigger loading state)
  const refreshGame = useCallback(() => {
    if (gameId) {
      refreshGameSilent(gameId);
    }
  }, [gameId, refreshGameSilent]);
  
  // Load game on mount
  useEffect(() => {
    loadGame(gameId).catch(() => {
      router.push('/');
    });
  }, [gameId, loadGame, router]);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (game) {
      const unsubscribe = subscribeToUpdates();
      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.$id, subscribeToUpdates]);
  
  // Polling fallback for real-time updates (every 2 seconds)
  useEffect(() => {
    if (game && game.status !== 'finished') {
      const interval = setInterval(refreshGame, 2000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.status, refreshGame]);
  
  // Check if player needs to join
  useEffect(() => {
    if (game && !currentPlayer && !showUsernamePrompt) {
      setShowUsernamePrompt(true);
    }
  }, [game, currentPlayer, showUsernamePrompt]);
  
  const handleJoinAsPlayer = async () => {
    if (!username.trim() || !game) return;
    
    try {
      await joinGame(game.code, username.trim());
      setShowUsernamePrompt(false);
      play('game-start');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
    }
  };
  
  const handleStartGame = async () => {
    try {
      play('game-start');
      play('card-shuffle', 0.5); // Play shuffle during user gesture so it isn't blocked by autoplay policy
      await startGame();
    } catch {
      // Error is already set in the store
    }
  };
  
  const handleSelectTeamAndRole = async (team: 'blue' | 'red', role: 'spymaster' | 'operative') => {
    try {
      await selectTeamAndRole(team, role);
    } catch {
      // Error is already set in the store
    }
  };
  
  const handleGiveClue = async (word: string, count: number) => {
    try {
      await giveClue(word, count);
    } catch {
      // Error is already set in the store
    }
  };
  
  const handleConfirmGuess = async (tileId: number) => {
    if (!game) return;
    
    const tile = game.tiles.find(t => t.id === tileId);
    if (!tile) return;

    // Determine sound based on result (even before server confirms)
    play('tile-flip');
    
    // Slight delay for result sound so flip happens first
    setTimeout(() => {
      if (tile.color === 'black') {
         play('assassin');
      } else if (tile.color === game.currentTurn) {
         play('correct');
      } else {
         play('wrong'); // Neutral or opponent color
      }
    }, 300);

    try {
      await confirmGuess(tileId);
    } catch {
      // Error is already set in the store
    }
  };
  
  const handleToggleTentative = async (tileId: number) => {
    try {
      await toggleTentativeGuess(tileId);
    } catch {
      // Error is already set in the store
    }
  };
  
  const handleEndTurn = async () => {
    try {
      await endTurn();
    } catch {
      // Error is already set in the store
    }
  };

  const handleEndGameClick = () => {
    play('button');
    setShowEndGameConfirm(true);
  };

  const handleConfirmEndGame = async () => {
    setShowEndGameConfirm(false);
    try {
      await endGame();
    } catch {
      // Error is already set in the store
    }
  };
  
  const isAdmin = currentPlayer?.isAdmin || (game && currentPlayer?.$id === game.adminPlayerId);
  const isGamePlaying = game?.status === 'playing';
  const { canStart, error: startError } = canStartGame(players);
  
  // Loading state
  if (!game) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">        {/* Top Navigation Links */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          <a
            href="/rules"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Rules
          </a>
          <a
            href="/about"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
          >
            <Info className="w-3.5 h-3.5" />
            About
          </a>
        </div>
        <div className="text-center animate-bounce-in">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-float" />
          <p className="text-white/70 text-lg">Loading game...</p>
        </div>
      </div>
    );
  }
  
  // Username prompt for new players
  if (showUsernamePrompt && !currentPlayer) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center p-4">
        {/* Top Navigation Links */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          <a
            href="/rules"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Rules
          </a>
          <a
            href="/about"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
          >
            <Info className="w-3.5 h-3.5" />
            About
          </a>
        </div>

        <div className="game-card p-8 w-full max-w-md animate-bounce-in">
          <div className="text-center mb-6">
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-blue-400" />
            <h2 className="game-title text-3xl text-white">Join Game</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-white/50 mb-2 font-medium">Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="clue-input w-full"
              maxLength={20}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinAsPlayer()}
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border-2 border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            onClick={handleJoinAsPlayer}
            disabled={!username.trim() || isLoading}
            className="game-btn game-btn-green w-full mb-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Joining...
              </>
            ) : (
              'Join Game'
            )}
          </button>
          
          <button
            onClick={() => {
              play('button');
              router.push('/');
            }}
            className="game-btn w-full bg-white/10 hover:bg-white/20 text-white"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </span>
          </button>
        </div>
      </div>
    );
  }
  
  // Waiting/Selection phase (Lobby) OR Playing phase but user unassigned
  if ((game.status === 'waiting' || game.status === 'selecting') || 
      (game.status === 'playing' && currentPlayer && (!currentPlayer.team || !currentPlayer.role))) {
    
    // For joining mid-game, we don't show the "Start Game" button or "Waiting for host" text if game is already playing
    
    return (
      <div className="min-h-screen animated-bg p-4 md:p-8 relative">
        {/* Leave Game Button (Top Left) */}
        <button
          onClick={async () => {
            play('button');
            await leaveGame();
            router.push('/');
          }}
          className="absolute top-4 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all duration-200 active:scale-95 animate-bounce-in"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Leave</span>
        </button>

        {/* Top Right Navigation - Desktop */}
        {currentPlayer && (
          <div className="hidden md:flex absolute top-4 right-4 md:top-8 md:right-8 z-50 items-center gap-3 animate-bounce-in">
            <a
              href="/rules"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Rules
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
            >
              <Info className="w-3.5 h-3.5" />
              About
            </a>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white/80">{currentPlayer.username}</span>
              <Image
                src={getAvatarUrl(currentPlayer.odId)}
                alt={currentPlayer.username}
                width={40}
                height={40}
                unoptimized
                className="w-10 h-10 rounded-full bg-black/30 ring-2 ring-white/20 shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Top Right Navigation - Mobile (Dropdown) */}
        {currentPlayer && (
          <div className="md:hidden absolute top-4 right-4 z-50 animate-bounce-in">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm transition-all"
            >
              <Image
                src={getAvatarUrl(currentPlayer.odId)}
                alt={currentPlayer.username}
                width={32}
                height={32}
                unoptimized
                className="w-8 h-8 rounded-full bg-black/30 ring-2 ring-white/20"
              />
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            
            {showMobileMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-gray-900/95 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-white/10">
                  <p className="text-sm font-bold text-white">{currentPlayer.username}</p>
                  {currentPlayer.isAdmin && (
                    <p className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                      <Crown className="w-3 h-3" /> Host
                    </p>
                  )}
                </div>
                <div className="p-2">
                  <a
                    href="/rules"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <BookOpen className="w-4 h-4" />
                    Rules
                  </a>
                  <a
                    href="/about"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Info className="w-4 h-4" />
                    About
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Start Game Button Below Profile (Desktop) */}
        {currentPlayer && (
          <div className="hidden md:block absolute top-20 right-4 md:top-24 md:right-8 z-50 animate-bounce-in">
            {isAdmin && !isGamePlaying && (
              <button
                onClick={handleStartGame}
                disabled={!canStart || isLoading}
                className={cn(
                  'relative overflow-hidden group',
                  'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500',
                  'text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:shadow-emerald-500/25',
                  'transform transition-all duration-200 active:scale-95',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
                  'border border-emerald-400/20 text-sm'
                )}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                <div className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>STARTING...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span className="tracking-wider">START GAME</span>
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        )}
        <div className="max-w-4xl mx-auto pt-16 md:pt-0">
          {/* Header */}
          <div className="text-center mb-8 animate-bounce-in">
            <h1 className="game-title text-4xl md:text-5xl mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 text-transparent bg-clip-text">
              {isGamePlaying ? 'JOIN GAME IN PROGRESS' : 'GAME LOBBY'}
            </h1>
            
            <p className="text-white/50 relative z-10">
              {isGamePlaying ? 'Select an available position to join the game' : 'Waiting for players to join and select positions'}
              {!isGamePlaying && isAdmin && !canStart && (
                  <span className="block text-yellow-400/80 text-sm mt-2 font-medium animate-pulse">
                     {startError}
                  </span>
              )}
            </p>

            {/* Mobile Start Game Button */}
            {currentPlayer && isAdmin && !isGamePlaying && (
              <button
                onClick={handleStartGame}
                disabled={!canStart || isLoading}
                className={cn(
                  'md:hidden relative overflow-hidden group w-full max-w-xs mx-auto mt-6',
                  'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500',
                  'text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/25',
                  'transform transition-all duration-200 active:scale-95',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
                  'border border-emerald-400/20 text-base flex items-center justify-center gap-2'
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>STARTING GAME...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    <span className="tracking-wider">START GAME</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Share Link */}
          <div className="mb-8">
            <ShareLink gameCode={game.code} />
          </div>
          
          {/* Main content */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Team Selector */}
            {currentPlayer && (
              <div className="order-1 md:order-2">
                <TeamSelector
                  players={players}
                  currentPlayer={currentPlayer}
                  onSelect={handleSelectTeamAndRole}
                  isLoading={isLoading}
                />
              </div>
            )}
            
            {/* Game Log (Lobby) */}
            <div className="order-3 md:order-3 md:col-span-2 mt-4">
               <GameLogPanel logs={game.logs || []} />
            </div>
            
            {/* Players Overview */}
            <div className="game-card p-6 order-2 md:order-1">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Players</span>
                <span className="text-sm font-normal text-white/50">({players.length}/4)</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Blue Team */}
                <div>
                  <div className="text-blue-400 text-sm font-bold mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    Blue Team
                  </div>
                  <div className="space-y-2">
                    <LobbyPlayerSlot 
                      role="Spymaster" 
                      player={players.find(p => p.team === 'blue' && p.role === 'spymaster')} 
                      currentPlayerId={currentPlayer?.$id}
                      color="blue"
                    />
                    <LobbyPlayerSlot 
                      role="Operative" 
                      player={players.find(p => p.team === 'blue' && p.role === 'operative')} 
                      currentPlayerId={currentPlayer?.$id}
                      color="blue"
                    />
                  </div>
                </div>
                
                {/* Red Team */}
                <div>
                  <div className="text-red-400 text-sm font-bold mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    Red Team
                  </div>
                  <div className="space-y-2">
                    <LobbyPlayerSlot 
                      role="Spymaster" 
                      player={players.find(p => p.team === 'red' && p.role === 'spymaster')} 
                      currentPlayerId={currentPlayer?.$id}
                      color="red"
                    />
                    <LobbyPlayerSlot 
                      role="Operative" 
                      player={players.find(p => p.team === 'red' && p.role === 'operative')} 
                      currentPlayerId={currentPlayer?.$id}
                      color="red"
                    />
                  </div>
                </div>
              </div>
              
              {/* Unassigned players */}
              {players.filter(p => !p.team).length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-white/40 text-sm mb-2">Waiting to join:</div>
                  <div className="flex flex-wrap gap-2">
                    {players.filter(p => !p.team).map(p => (
                      <div key={p.$id} className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2',
                        'bg-white/10 border-2',
                        p.$id === currentPlayer?.$id 
                          ? 'border-yellow-500/50 text-yellow-400' 
                          : 'border-white/20 text-white/70'
                      )}>
                        <Image
                          src={getAvatarUrl(p.odId)}
                          alt={p.username}
                          width={20}
                          height={20}
                          unoptimized
                          className="w-5 h-5 rounded-full bg-black/20 flex-shrink-0"
                        />
                        {p.username}
                        {p.isAdmin && <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border-2 border-red-500/30 rounded-xl text-red-400 text-center">
              {error}
            </div>
          )}
          

          
          {!isAdmin && !isGamePlaying && (
            <div className="mt-8 text-center text-white/40 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
              Waiting for the host to start the game...
            </div>
          )}
          
        </div>
      </div>
    );
  }
  
  // Playing phase - Main game UI
  const tiles = game.tiles || [];
  const blueScore = getTeamScore(tiles, 'blue');
  const redScore = getTeamScore(tiles, 'red');
  const blueTarget = getTeamTargetScore(game, 'blue');
  const redTarget = getTeamTargetScore(game, 'red');
  
  return (
    <div className="min-h-screen animated-bg flex flex-col overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col p-2 sm:p-4 pb-32 sm:pb-40 md:pb-48 max-w-[1400px] mx-auto w-full h-full relative">
        
        {/* Header */}
        <GameHeader game={game} currentPlayer={currentPlayer} />
        
        {/* Game Menu with Rules and About Links (Top Right) */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50 flex items-center gap-2">
          <a
            href="/rules"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rules</span>
          </a>
          <a
            href="/about"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About</span>
          </a>
          <GameMenu
            isAdmin={!!isAdmin}
            onEndGame={handleEndGameClick}
            gameFinished={game.status === 'finished'}
            onLeaveGame={async () => {
              await leaveGame();
              router.push('/');
            }}
          />
        </div>

        <ConfirmationModal
          isOpen={showEndGameConfirm}
          onConfirm={handleConfirmEndGame}
          onCancel={() => setShowEndGameConfirm(false)}
          title="End Game?"
          message="Are you sure you want to forcibly end the game? This will end the current round immediately with no winner declared."
          confirmText="Yes, End Game"
          variant="danger"
        />
        
        {/* Game Layout Grid */}
        <div className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-center gap-6 lg:gap-12 min-h-0">
          
          {/* Left Panel - Blue Team (Hidden on mobile) */}
          <div className="hidden md:flex w-64 flex-shrink-0 flex-col justify-start pt-4 order-1">
             <TeamPanel 
               team="blue" 
               players={players} 
               currentPlayer={currentPlayer}
               game={game}
               score={blueScore}
               targetScore={blueTarget}
             />
          </div>
          
          {/* Center - Game Board */}
          <div className="flex-1 w-full max-w-3xl flex flex-col justify-center order-1 md:order-2 min-h-0">
            <GameBoard
              tiles={tiles}
              game={game}
              players={players}
              currentPlayer={currentPlayer}
              onConfirmGuess={handleConfirmGuess}
              onToggleTentative={handleToggleTentative}
            />
            
            {/* Game Log (Mobile Only) */}
            <div className="md:hidden mt-6 w-full">
              <GameLogPanel logs={game.logs || []} />
            </div>
          </div>
          
          {/* Right Panel - Red Team (Hidden on mobile) */}
          <div className="hidden md:flex w-64 flex-shrink-0 flex-col justify-start pt-4 order-3 gap-4">
             <TeamPanel 
               team="red" 
               players={players} 
               currentPlayer={currentPlayer}
               game={game}
               score={redScore}
               targetScore={redTarget}
             />
             
             {/* Game Log (Desktop Only) */}
             <div className="mt-auto">
                <GameLogPanel logs={game.logs || []} />
             </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 p-3 bg-red-500/20 border-2 border-red-500/30 rounded-xl text-red-400 text-center max-w-md mx-auto z-50 backdrop-blur-md">
              {error}
            </div>
        )}
      </div>
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 z-40 pointer-events-none flex justify-center pb-4 sm:pb-8 md:pb-12">
          {game.currentPhase === 'giving_clue' ? (
            currentPlayer?.role === 'spymaster' && currentPlayer?.team === game.currentTurn ? (
              <ClueInput
                game={game}
                currentPlayer={currentPlayer}
                onSubmitClue={handleGiveClue}
                isLoading={isLoading}
              />
            ) : null
          ) : (
            <div className="pointer-events-auto">
               <ClueDisplay
                 game={game}
                 currentPlayer={currentPlayer}
                 onEndTurn={handleEndTurn}
                 isLoading={isLoading}
               />
            </div>
          )}
      </div>
      
      {/* Winner Modal */}
      {game.status === 'finished' && showWinnerModal && (
        <WinnerModal
          game={game}
          onGoHome={async () => {
            await leaveGame();
            router.push('/');
          }}
          onClose={() => setShowWinnerModal(false)}
        />
      )}
    </div>
  );
}

// Lobby player slot component
function LobbyPlayerSlot({ role, player, currentPlayerId, color }: { role: string; player?: { $id: string; username: string; isAdmin: boolean; odId: string }; currentPlayerId?: string; color: 'blue' | 'red' }) {
  const isCurrentUser = player?.$id === currentPlayerId;
  
  return (
    <div className={cn(
      'px-3 py-2 rounded-xl text-sm border-2',
      player ? 'bg-white/5' : 'bg-white/5 border-dashed',
      color === 'blue' ? 'border-blue-500/30' : 'border-red-500/30',
      isCurrentUser && 'border-yellow-500/50'
    )}>
      <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">{role}</div>
      {player ? (
        <div className={cn('font-semibold flex items-center gap-2', isCurrentUser ? 'text-yellow-400' : 'text-white/90')}>
          <Image
            src={getAvatarUrl(player.odId)}
            alt={player.username}
            width={24}
            height={24}
            unoptimized
            className="w-6 h-6 rounded-full bg-black/20 ring-1 ring-white/10 flex-shrink-0"
          />
          {player.username}
          {player.isAdmin && <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />}
        </div>
      ) : (
        <div className="text-white/30 italic">Empty</div>
      )}
    </div>
  );
}
