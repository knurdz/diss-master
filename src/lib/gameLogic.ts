import type { Tile, TileColor, Team, Game, Player } from '@/types/game';
import { generateGameWords } from './wordApi';
import { getRandomWords } from './words';

// Generate tiles for a new game (async - fetches words from API)
export async function generateTilesAsync(startingTeam: Team, customWords: string[] = []): Promise<Tile[]> {
  let finalWords: string[] = [];

  // Filter out empty strings and extensive whitespace just in case
  const cleanCustomWords = customWords.map(w => w.trim().toUpperCase()).filter(w => w.length > 0);

  if (cleanCustomWords.length >= 25) {
    // If we have enough custom words, pick 25 random ones
    finalWords = [...cleanCustomWords].sort(() => Math.random() - 0.5).slice(0, 25);
  } else {
    // If not enough, use all custom words and fill the rest
    const needed = 25 - cleanCustomWords.length;
    // We request 25 from API anyway to be safe, then slice what we need
    // Note: generateGameWords usually returns exactly 25, so we might need a way to get *more* or just take what we need.
    // Ideally we would ask api for `needed` words, but `generateGameWords` is parameterless currently. 
    // Let's assume it returns 25 distinct words.
    const apiWords = await generateGameWords();

    // Filter out any api words that might collide with custom words (unlikely but good practice)
    const uniqueApiWords = apiWords.filter(w => !cleanCustomWords.includes(w));

    finalWords = [...cleanCustomWords, ...uniqueApiWords.slice(0, needed)];
  }

  // Double check we have 25 (if api failed or something, we might be short, but unlikely given generateGameWords fallback)
  // shuffle the final combined list so custom words aren't always first
  finalWords = finalWords.sort(() => Math.random() - 0.5);

  const colors = generateTileColors(startingTeam);

  // Shuffle colors
  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

  // Pre-generate shuffled image indices for each color category
  // Red: 1-9, Blue: 10-18, Black: 19, Neutral: 20-30
  const redImageIndices = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const blueImageIndices = shuffle([10, 11, 12, 13, 14, 15, 16, 17, 18]);
  const blackImageIndices = [19];
  const neutralImageIndices = shuffle([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);

  // Counters for each color category
  let redIdx = 0, blueIdx = 0, blackIdx = 0, neutralIdx = 0;

  return finalWords.map((word, index) => {
    const color = shuffledColors[index];
    let imageIndex: number;

    if (color === 'red') {
      imageIndex = redImageIndices[redIdx++ % redImageIndices.length];
    } else if (color === 'blue') {
      imageIndex = blueImageIndices[blueIdx++ % blueImageIndices.length];
    } else if (color === 'black') {
      imageIndex = blackImageIndices[blackIdx++ % blackImageIndices.length];
    } else {
      imageIndex = neutralImageIndices[neutralIdx++ % neutralImageIndices.length];
    }

    return {
      id: index,
      word,
      color,
      revealed: false,
      imageIndex,
    };
  });
}

// Helper function to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Sync version using hardcoded words (fallback)
export function generateTiles(startingTeam: Team): Tile[] {
  const words = getRandomWords(25);
  const colors = generateTileColors(startingTeam);

  // Shuffle colors
  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

  // Pre-generate shuffled image indices for each color category
  const redImageIndices = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const blueImageIndices = shuffle([10, 11, 12, 13, 14, 15, 16, 17, 18]);
  const blackImageIndices = [19];
  const neutralImageIndices = shuffle([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);

  let redIdx = 0, blueIdx = 0, blackIdx = 0, neutralIdx = 0;

  return words.map((word, index) => {
    const color = shuffledColors[index];
    let imageIndex: number;

    if (color === 'red') {
      imageIndex = redImageIndices[redIdx++ % redImageIndices.length];
    } else if (color === 'blue') {
      imageIndex = blueImageIndices[blueIdx++ % blueImageIndices.length];
    } else if (color === 'black') {
      imageIndex = blackImageIndices[blackIdx++ % blackImageIndices.length];
    } else {
      imageIndex = neutralImageIndices[neutralIdx++ % neutralImageIndices.length];
    }

    return {
      id: index,
      word,
      color,
      revealed: false,
      imageIndex,
    };
  });
}

// Generate the color distribution for tiles
function generateTileColors(startingTeam: Team): TileColor[] {
  const colors: TileColor[] = [];

  // Starting team gets 9 tiles, other team gets 8
  const startingTeamCount = 9;
  const otherTeamCount = 8;
  const blackCount = 1;
  const neutralCount = 7; // 25 - 9 - 8 - 1 = 7

  // Add starting team colors
  for (let i = 0; i < startingTeamCount; i++) {
    colors.push(startingTeam);
  }

  // Add other team colors
  const otherTeam: Team = startingTeam === 'blue' ? 'red' : 'blue';
  for (let i = 0; i < otherTeamCount; i++) {
    colors.push(otherTeam);
  }

  // Add black tile
  for (let i = 0; i < blackCount; i++) {
    colors.push('black');
  }

  // Add neutral tiles
  for (let i = 0; i < neutralCount; i++) {
    colors.push('neutral');
  }

  return colors;
}

// Check if a team has won
export function checkWinner(tiles: Tile[]): Team | null {
  const blueRevealed = tiles.filter(t => t.color === 'blue' && t.revealed).length;
  const redRevealed = tiles.filter(t => t.color === 'red' && t.revealed).length;

  // Count total tiles for each team
  const blueTotal = tiles.filter(t => t.color === 'blue').length;
  const redTotal = tiles.filter(t => t.color === 'red').length;

  // Check if all tiles of a color are revealed
  if (blueRevealed === blueTotal) return 'blue';
  if (redRevealed === redTotal) return 'red';

  return null;
}

// Check if a player can perform an action
// Check if a player can perform an action
export function canGiveClue(player: Player, game: Game): boolean {
  if (game.status !== 'playing') return false;
  if (game.currentPhase !== 'giving_clue') return false;
  if (player.role !== 'spymaster') return false;
  if (player.team !== game.currentTurn) return false;
  return true;
}

export function canGuess(player: Player, game: Game, players: Player[] = []): boolean {
  if (game.status !== 'playing') return false;
  if (game.currentPhase !== 'guessing') return false;
  if (player.team !== game.currentTurn) return false;

  // Operatives can always guess
  if (player.role === 'operative') return true;

  // Spymasters can guess ONLY if they are the only player on their team (1v1 testing mode)
  if (player.role === 'spymaster') {
    const teamPlayers = players.filter(p => p.team === player.team);
    return teamPlayers.length === 1;
  }

  return false;
}

// Process a tile selection
export interface GuessResult {
  tiles: Tile[];
  guessesRemaining: number;
  currentTurn: Team;
  currentPhase: 'giving_clue' | 'guessing';
  winner: Team | null;
  blueScore: number;
  redScore: number;
  hitBlack: boolean;
  correct: boolean;
}

export function processTileSelection(
  game: Game,
  tileId: number,
  guessingTeam: Team
): GuessResult {
  const tiles = [...game.tiles];
  const tile = tiles.find(t => t.id === tileId);

  if (!tile || tile.revealed) {
    return {
      tiles,
      guessesRemaining: game.guessesRemaining,
      currentTurn: game.currentTurn,
      currentPhase: game.currentPhase,
      winner: game.winner,
      blueScore: game.blueScore,
      redScore: game.redScore,
      hitBlack: false,
      correct: false,
    };
  }

  // Reveal the tile
  tile.revealed = true;
  tile.revealedBy = guessingTeam;

  // Calculate scores
  let blueScore = tiles.filter(t => t.color === 'blue' && t.revealed).length;
  let redScore = tiles.filter(t => t.color === 'red' && t.revealed).length;

  // Check for black tile (instant loss)
  if (tile.color === 'black') {
    const winner: Team = guessingTeam === 'blue' ? 'red' : 'blue';
    return {
      tiles,
      guessesRemaining: 0,
      currentTurn: game.currentTurn,
      currentPhase: 'giving_clue',
      winner,
      blueScore,
      redScore,
      hitBlack: true,
      correct: false,
    };
  }

  // Check for win condition
  const winner = checkWinner(tiles);
  if (winner) {
    return {
      tiles,
      guessesRemaining: 0,
      currentTurn: game.currentTurn,
      currentPhase: 'giving_clue',
      winner,
      blueScore,
      redScore,
      hitBlack: false,
      correct: tile.color === guessingTeam,
    };
  }

  // Correct guess - same team's tile
  if (tile.color === guessingTeam) {
    const newGuessesRemaining = game.guessesRemaining - 1;

    // Can continue guessing if they have guesses left
    // They can also make one extra guess beyond the clue number
    if (newGuessesRemaining >= 0) {
      return {
        tiles,
        guessesRemaining: newGuessesRemaining,
        currentTurn: game.currentTurn,
        currentPhase: 'guessing',
        winner: null,
        blueScore,
        redScore,
        hitBlack: false,
        correct: true,
      };
    }
  }

  // Wrong guess (opponent's tile or neutral) - turn ends
  const nextTurn: Team = guessingTeam === 'blue' ? 'red' : 'blue';

  return {
    tiles,
    guessesRemaining: 0,
    currentTurn: nextTurn,
    currentPhase: 'giving_clue',
    winner: null,
    blueScore,
    redScore,
    hitBlack: false,
    correct: false,
  };
}

// Validate a clue
export function validateClue(clue: string, tiles: Tile[]): { valid: boolean; error?: string } {
  const trimmedClue = clue.trim().toUpperCase();

  if (!trimmedClue) {
    return { valid: false, error: 'Clue cannot be empty' };
  }

  if (trimmedClue.includes(' ')) {
    return { valid: false, error: 'Clue must be a single word' };
  }

  // Check if clue is one of the words on the board
  const wordsOnBoard = tiles.map(t => t.word.toUpperCase());
  if (wordsOnBoard.includes(trimmedClue)) {
    return { valid: false, error: 'Clue cannot be a word on the board' };
  }

  return { valid: true };
}

// Check if all required positions are filled
// Check if all required positions are filled
export function canStartGame(players: Player[]): { canStart: boolean; error?: string } {
  // Relaxed rules for easier starting/testing
  const bluePlayers = players.filter(p => p.team === 'blue');
  const redPlayers = players.filter(p => p.team === 'red');

  if (bluePlayers.length < 1) {
    return { canStart: false, error: 'Blue team needs at least 1 player' };
  }

  if (redPlayers.length < 1) {
    return { canStart: false, error: 'Red team needs at least 1 player' };
  }

  // Warn but allow start if not full (handled by UI generally, but here we just block invalid states)
  // We strictly require at least 1 per team.

  return { canStart: true };
}

// Determine starting team randomly
export function getRandomStartingTeam(): Team {
  return Math.random() < 0.5 ? 'blue' : 'red';
}

// Get the current score for a team (revealed tiles)
export function getTeamScore(tiles: Tile[], team: Team): number {
  return tiles.filter(t => t.color === team && t.revealed).length;
}

// Get the target score for a team (total tiles of that color)
export function getTeamTargetScore(game: Game, team: Team): number {
  return game.tiles.filter(t => t.color === team).length;
}

// Pseudo-random number generator for seeding
function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

// Deterministic shuffle using game ID as seed
export function getShuffledTiles(tiles: Tile[], seedString: string): Tile[] {
  // Create a seed from string
  let h = 1779033703 ^ seedString.length;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }

  const seed = function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };

  const rand = sfc32(seed(), seed(), seed(), seed());

  // Shuffle copy
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
