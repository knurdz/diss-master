export type Team = 'blue' | 'red';
export type Role = 'spymaster' | 'operative';
export type TileColor = 'blue' | 'red' | 'neutral' | 'black';
export type GameStatus = 'waiting' | 'selecting' | 'playing' | 'finished';
export type GamePhase = 'giving_clue' | 'guessing';

export interface Tile {
  id: number;
  word: string;
  color: TileColor; // The actual color (only visible to spymasters)
  revealed: boolean;
  revealedBy?: Team;
  tentativeBy?: string[]; // Array of player IDs who have tentatively selected this tile
  imageIndex?: number; // Unique image index for this tile (assigned at game creation)
}

export interface Clue {
  word: string;
  count: number;
  givenBy: Team;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'clue' | 'guess' | 'pass';
  team: Team;
  playerName: string;
  playerOdId?: string; // For consistent avatars
  message: string;
  metadata?: {
    word?: string;
    count?: number;
    tileWord?: string;
    tileColor?: TileColor;
    isCorrect?: boolean;
  };
}

export interface Player {
  $id: string;
  gameId: string;
  odId: string; // Unique identifier for the player in the game session
  username: string;
  team: Team | null;
  role: Role | null;
  isAdmin: boolean;
  joinedAt: string;
  meaningsUsed?: number;
}

export interface Game {
  $id: string;
  code: string; // Short game code for sharing
  status: GameStatus;
  currentTurn: Team;
  currentPhase: GamePhase;
  currentClue: Clue | null;
  guessesRemaining: number;
  tiles: Tile[];
  startingTeam: Team;
  winner: Team | null;
  adminPlayerId: string;
  blueScore: number;
  redScore: number;
  createdAt: string;
  enableMeanings?: boolean;
  maxMeaningsPerPlayer?: number;
  logs: LogEntry[];
}

export interface GameState {
  game: Game | null;
  players: Player[];
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
}

// Appwrite document types
export interface GameDocument {
  code: string;
  status: GameStatus;
  currentTurn: Team;
  currentPhase: GamePhase;
  currentClue: string | null; // JSON string
  guessesRemaining: number;
  tiles: string; // JSON string of Tile[]
  startingTeam: Team;
  winner: Team | null;
  adminPlayerId: string;
  blueScore: number;
  redScore: number;
  createdAt: string;
  enableMeanings: boolean;
  maxMeaningsPerPlayer: number;
  logs: string[]; // Array of JSON strings, each representing a LogEntry
}

export interface PlayerDocument {
  gameId: string;
  odId: string;
  username: string;
  team: Team | null;
  role: Role | null;
  isAdmin: boolean;
  joinedAt: string;
  meaningsUsed: number;
}
