'use client';

import { useState, useMemo } from 'react';
import { Tile, Player, Game } from '@/types/game';
import { canGuess, getShuffledTiles } from '@/lib/gameLogic';
import GameTile from './GameTile';
import MeaningModal from './MeaningModal';

interface GameBoardProps {
  tiles: Tile[];
  currentPlayer: Player | null;
  players: Player[];
  game: Game;
  onConfirmGuess: (tileId: number) => void;
  onToggleTentative: (tileId: number) => void;
}

export default function GameBoard({ 
  tiles, 
  currentPlayer, 
  players,
  game, 
  onConfirmGuess,
  onToggleTentative 
}: GameBoardProps) {
  const [meaningWord, setMeaningWord] = useState<string | null>(null);

  const isSpymaster = currentPlayer?.role === 'spymaster';
  const playerCanGuess = currentPlayer ? canGuess(currentPlayer, game, players) : false;
  
  // Determine display order
  // Spymasters see one order (original/consistent)
  // Operatives see a DIFFERENT shuffled order (consistent per game)
  const displayTiles = useMemo(() => {
    if (isSpymaster) {
      return tiles;
    } else {
      // Shuffle for operatives (using game ID as seed so it's consistent)
      return getShuffledTiles(tiles, game.$id);
    }
  }, [tiles, isSpymaster, game.$id]);
  
  return (
    <div className="game-card p-1 md:p-4 bg-opacity-90">
      {/* Tile Grid */}
      <div className="grid grid-cols-5 gap-1 md:gap-3">
        {displayTiles.map((tile, index) => (
          <div 
            key={tile.id} 
            className="animate-fall-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <GameTile
              tile={tile}
              isSpymaster={isSpymaster}
              canSelect={playerCanGuess}
              onToggle={() => onToggleTentative(tile.id)}
              onConfirm={() => onConfirmGuess(tile.id)}
              currentPlayerId={currentPlayer?.$id}
              enableMeanings={game.enableMeanings}
              onShowMeaning={() => setMeaningWord(tile.word)}
            />
          </div>
        ))}
      </div>
      
      {meaningWord && currentPlayer && (
        <MeaningModal
            word={meaningWord}
            onClose={() => setMeaningWord(null)}
            game={game}
            currentPlayer={currentPlayer}
        />
      )}
    </div>
  );
}
