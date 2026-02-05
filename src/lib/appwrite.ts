import { Client, Databases, ID, Query } from 'appwrite';
import type {
  Game,
  Player,
  GameDocument,
  PlayerDocument,
  Tile,
  Team,
  Role,
  Clue,
  GameStatus,
  GamePhase
} from '@/types/game';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const databases = new Databases(client);
export { client, ID };

// Collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'diss-master-db';
const GAMES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_GAMES_COLLECTION_ID || 'games';
const PLAYERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID || 'players';

// Helper to convert Game document to Game object
function documentToGame(doc: GameDocument & { $id: string }): Game {
  return {
    $id: doc.$id,
    code: doc.code,
    status: doc.status,
    currentTurn: doc.currentTurn,
    currentPhase: doc.currentPhase,
    currentClue: doc.currentClue ? JSON.parse(doc.currentClue) : null,
    guessesRemaining: doc.guessesRemaining,
    tiles: JSON.parse(doc.tiles),
    startingTeam: doc.startingTeam,
    winner: doc.winner,
    adminPlayerId: doc.adminPlayerId,
    blueScore: doc.blueScore,
    redScore: doc.redScore,
    createdAt: doc.createdAt,
    enableMeanings: doc.enableMeanings || false,
    maxMeaningsPerPlayer: doc.maxMeaningsPerPlayer || 0,
    logs: doc.logs ? doc.logs.map((l: string) => JSON.parse(l)) : [],
  };
}

// Helper to convert Player document to Player object
function documentToPlayer(doc: PlayerDocument & { $id: string }): Player {
  return {
    $id: doc.$id,
    gameId: doc.gameId,
    odId: doc.odId,
    username: doc.username,
    team: doc.team,
    role: doc.role,
    isAdmin: doc.isAdmin,
    joinedAt: doc.joinedAt,
    meaningsUsed: doc.meaningsUsed || 0,
  };
}

// Game Functions
export async function createGame(adminPlayerId: string, tiles: Tile[], startingTeam: Team, enableMeanings: boolean = false, maxMeaningsPerPlayer: number = 0): Promise<Game> {
  // Generate a short game code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const gameData: Omit<GameDocument, '$id'> = {
    code,
    status: 'waiting',
    currentTurn: startingTeam,
    currentPhase: 'giving_clue',
    currentClue: null,
    guessesRemaining: 0,
    tiles: JSON.stringify(tiles),
    startingTeam,
    winner: null,
    adminPlayerId,
    blueScore: 0,
    redScore: 0,
    createdAt: new Date().toISOString(),
    enableMeanings,
    maxMeaningsPerPlayer,
    logs: [],
  };

  const doc = await databases.createDocument(
    DATABASE_ID,
    GAMES_COLLECTION_ID,
    ID.unique(),
    gameData
  );

  return documentToGame(doc as unknown as GameDocument & { $id: string });
}

export async function getGame(gameId: string): Promise<Game | null> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      GAMES_COLLECTION_ID,
      gameId
    );
    return documentToGame(doc as unknown as GameDocument & { $id: string });
  } catch {
    return null;
  }
}

export async function getGameByCode(code: string): Promise<Game | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      GAMES_COLLECTION_ID,
      [Query.equal('code', code.toUpperCase())]
    );
    if (response.documents.length === 0) return null;
    return documentToGame(response.documents[0] as unknown as GameDocument & { $id: string });
  } catch {
    return null;
  }
}

export async function updateGame(
  gameId: string,
  updates: Partial<{
    status: GameStatus;
    currentTurn: Team;
    currentPhase: GamePhase;
    currentClue: Clue | null;
    guessesRemaining: number;
    tiles: Tile[];
    winner: Team | null;
    blueScore: number;
    redScore: number;
    logs: unknown[]; // Using unknown[] to avoid circular dependency, but it's LogEntry[]
  }>
): Promise<Game> {
  const updateData: Partial<GameDocument> = {};

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.currentTurn !== undefined) updateData.currentTurn = updates.currentTurn;
  if (updates.currentPhase !== undefined) updateData.currentPhase = updates.currentPhase;
  if (updates.currentClue !== undefined) updateData.currentClue = updates.currentClue ? JSON.stringify(updates.currentClue) : null;
  if (updates.guessesRemaining !== undefined) updateData.guessesRemaining = updates.guessesRemaining;
  if (updates.tiles !== undefined) updateData.tiles = JSON.stringify(updates.tiles);
  if (updates.winner !== undefined) updateData.winner = updates.winner;
  if (updates.blueScore !== undefined) updateData.blueScore = updates.blueScore;
  if (updates.redScore !== undefined) updateData.redScore = updates.redScore;
  if (updates.logs !== undefined) updateData.logs = updates.logs.map(l => JSON.stringify(l));

  const doc = await databases.updateDocument(
    DATABASE_ID,
    GAMES_COLLECTION_ID,
    gameId,
    updateData
  );

  return documentToGame(doc as unknown as GameDocument & { $id: string });
}

// Player Functions
export async function createPlayer(
  gameId: string,
  username: string,
  isAdmin: boolean
): Promise<Player> {
  // Generate unique player ID for this session
  const odId = ID.unique();

  const playerData: Omit<PlayerDocument, '$id'> = {
    gameId,
    odId,
    username,
    team: null,
    role: null,
    isAdmin,
    joinedAt: new Date().toISOString(),
    meaningsUsed: 0,
  };

  const doc = await databases.createDocument(
    DATABASE_ID,
    PLAYERS_COLLECTION_ID,
    ID.unique(),
    playerData
  );

  return documentToPlayer(doc as unknown as PlayerDocument & { $id: string });
}

export async function getPlayer(playerId: string): Promise<Player | null> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      PLAYERS_COLLECTION_ID,
      playerId
    );
    return documentToPlayer(doc as unknown as PlayerDocument & { $id: string });
  } catch {
    return null;
  }
}

export async function getGamePlayers(gameId: string): Promise<Player[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PLAYERS_COLLECTION_ID,
      [Query.equal('gameId', gameId)]
    );
    return response.documents.map(doc => documentToPlayer(doc as unknown as PlayerDocument & { $id: string }));
  } catch {
    return [];
  }
}

export async function updatePlayer(
  playerId: string,
  updates: Partial<{
    team: Team | null;
    role: Role | null;
    username: string;
    meaningsUsed: number;
  }>
): Promise<Player> {
  const doc = await databases.updateDocument(
    DATABASE_ID,
    PLAYERS_COLLECTION_ID,
    playerId,
    updates
  );

  return documentToPlayer(doc as unknown as PlayerDocument & { $id: string });
}

export async function deletePlayer(playerId: string): Promise<void> {
  await databases.deleteDocument(
    DATABASE_ID,
    PLAYERS_COLLECTION_ID,
    playerId
  );
}

// Realtime subscriptions
export function subscribeToGame(gameId: string, callback: (game: Game) => void) {
  const channel = `databases.${DATABASE_ID}.collections.${GAMES_COLLECTION_ID}.documents.${gameId}`;

  return client.subscribe(channel, (response) => {
    // Handle any event on this game document (create, update, delete)
    const eventTypes = [
      `databases.${DATABASE_ID}.collections.${GAMES_COLLECTION_ID}.documents.${gameId}.create`,
      `databases.${DATABASE_ID}.collections.${GAMES_COLLECTION_ID}.documents.${gameId}.update`,
    ];

    const hasRelevantEvent = response.events.some(event =>
      eventTypes.some(type => event.includes(type))
    );

    if (hasRelevantEvent && response.payload) {
      callback(documentToGame(response.payload as unknown as GameDocument & { $id: string }));
    }
  });
}

export function subscribeToPlayers(gameId: string, callback: (players: Player[]) => void) {
  // Subscribe to the entire players collection and filter by gameId
  const channel = `databases.${DATABASE_ID}.collections.${PLAYERS_COLLECTION_ID}.documents`;

  return client.subscribe(channel, async (response) => {
    // Check if this event is relevant to our game
    const payload = response.payload as unknown as PlayerDocument & { $id: string };

    // Handle create, update, and delete events
    const isRelevantEvent = response.events.some(event =>
      event.includes('.create') ||
      event.includes('.update') ||
      event.includes('.delete')
    );

    if (isRelevantEvent) {
      // Check if the payload belongs to this game, or if it's a delete event
      // For delete events, we might not have gameId in payload, so always refresh
      const isThisGame = payload?.gameId === gameId;
      const isDeleteEvent = response.events.some(event => event.includes('.delete'));

      if (isThisGame || isDeleteEvent) {
        // Fetch all players for this game to get the latest state
        const players = await getGamePlayers(gameId);
        callback(players);
      }
    }
  });
}

export { DATABASE_ID, GAMES_COLLECTION_ID, PLAYERS_COLLECTION_ID };
