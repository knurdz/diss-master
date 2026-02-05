import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Game, Player, GameState, Team, Role, Clue } from '@/types/game';
import {
  createGame as createGameAPI,
  getGame,
  getGameByCode,
  updateGame,
  createPlayer as createPlayerAPI,
  getPlayer,
  getGamePlayers,
  updatePlayer,
  subscribeToGame,
  subscribeToPlayers,
  client,
  ID,
  deletePlayer,
} from '@/lib/appwrite';
import { generateTilesAsync, getRandomStartingTeam, processTileSelection, canStartGame } from '@/lib/gameLogic';
import type { LogEntry } from '@/types/game';

interface GameStore extends GameState {
  // Actions
  setGame: (game: Game | null) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Game actions
  createNewGame: (username: string, customWords?: string[], enableMeanings?: boolean, maxMeanings?: number) => Promise<{ gameId: string; code: string }>;
  joinGame: (code: string, username: string) => Promise<{ gameId: string }>;
  loadGame: (gameId: string) => Promise<void>;
  refreshGameSilent: (gameId: string) => Promise<void>;
  startGame: () => Promise<void>;

  // Meaning action
  getWordMeaning: (word: string) => Promise<string>;

  // Player actions
  selectTeamAndRole: (team: Team, role: Role) => Promise<void>;

  // Gameplay actions
  giveClue: (word: string, count: number) => Promise<void>;
  confirmGuess: (tileId: number) => Promise<void>;
  toggleTentativeGuess: (tileId: number) => Promise<void>;
  endTurn: () => Promise<void>;

  // Realtime
  subscribeToUpdates: () => () => void;

  // Reset
  reset: () => void;

  // Leave game
  leaveGame: () => Promise<void>;

  // Admin End Game
  endGame: () => Promise<void>;
}

const initialState: GameState & { pendingTentativeUpdate: boolean } = {
  game: null,
  players: [],
  currentPlayer: null,
  isLoading: false,
  error: null,
  pendingTentativeUpdate: false,
};

// Helper functions for per-game session persistence
const getSessionKey = (gameId: string) => `diss-master-session-${gameId}`;

const savePlayerSession = (gameId: string, playerId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getSessionKey(gameId), playerId);
  }
};

const getPlayerSession = (gameId: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(getSessionKey(gameId));
  }
  return null;
};

const clearPlayerSession = (gameId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getSessionKey(gameId));
  }
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setGame: (game) => set({ game }),
      setPlayers: (players) => set({ players }),
      setCurrentPlayer: (player) => set({ currentPlayer: player }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading }),

      createNewGame: async (username, customWords = [], enableMeanings = false, maxMeanings = 0) => {
        set({ isLoading: true, error: null });
        try {
          const startingTeam = getRandomStartingTeam();

          // Fetch words dynamically from API (or use custom)
          const tiles = await generateTilesAsync(startingTeam, customWords);

          // Create a placeholder admin ID (will identify admin by isAdmin flag on player)
          const tempAdminId = 'pending';

          // Create the game first
          const game = await createGameAPI(tempAdminId, tiles, startingTeam, enableMeanings, maxMeanings);

          // Create the admin player
          const player = await createPlayerAPI(game.$id, username, true);

          set({
            game,
            currentPlayer: player,
            players: [player],
            isLoading: false,
          });

          // Save session for this game
          savePlayerSession(game.$id, player.$id);

          return { gameId: game.$id, code: game.code };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create game';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      joinGame: async (code, username) => {
        set({ isLoading: true, error: null });
        try {
          const game = await getGameByCode(code);
          if (!game) {
            throw new Error('Game not found');
          }

          // Allow joining if game is waiting, selecting OR playing (if not full)
          if (game.status === 'finished') {
            throw new Error('Game has finished');
          }

          const existingPlayers = await getGamePlayers(game.$id);
          if (existingPlayers.length >= 4) {
            throw new Error('Game is full');
          }

          // Create new player
          const player = await createPlayerAPI(game.$id, username, false);

          set({
            game,
            currentPlayer: player,
            players: [...existingPlayers, player],
            isLoading: false,
          });

          // Save session for this game
          savePlayerSession(game.$id, player.$id);

          return { gameId: game.$id };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to join game';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      loadGame: async (gameId) => {
        set({ isLoading: true, error: null });
        try {
          const game = await getGame(gameId);
          if (!game) {
            throw new Error('Game not found');
          }

          const players = await getGamePlayers(gameId);

          // Try to restore player session from localStorage
          let foundPlayer = null;
          const savedPlayerId = getPlayerSession(gameId);

          if (savedPlayerId) {
            foundPlayer = players.find(p => p.$id === savedPlayerId);
            if (!foundPlayer) {
              // Player was deleted or not found, clear stale session
              clearPlayerSession(gameId);
            }
          }

          // Fallback: check current player in Zustand state
          if (!foundPlayer) {
            const { currentPlayer } = get();
            if (currentPlayer) {
              foundPlayer = players.find(p => p.$id === currentPlayer.$id);
            }
          }

          set({
            game,
            players,
            currentPlayer: foundPlayer,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load game';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Silent refresh - doesn't show loading state (used for polling)
      refreshGameSilent: async (gameId) => {
        try {
          const game = await getGame(gameId);
          if (!game) return;

          const players = await getGamePlayers(gameId);

          // Check if current player exists in this game
          const { currentPlayer } = get();
          let foundPlayer = currentPlayer;

          if (currentPlayer) {
            foundPlayer = players.find(p => p.$id === currentPlayer.$id) || null;
          }

          set({
            game,
            players,
            currentPlayer: foundPlayer,
          });
        } catch {
          // Silently fail - don't show errors for background refresh
        }
      },

      startGame: async () => {
        const { game, players } = get();
        if (!game) throw new Error('No game loaded');

        const { canStart, error } = canStartGame(players);
        if (!canStart) {
          set({ error });
          throw new Error(error);
        }

        set({ isLoading: true, error: null });
        try {
          const updatedGame = await updateGame(game.$id, {
            status: 'playing',
            currentPhase: 'giving_clue',
          });

          set({ game: updatedGame, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to start game';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      selectTeamAndRole: async (team, role) => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) throw new Error('No game or player');

        // Fetch latest players to check for conflicts
        const latestPlayers = await getGamePlayers(game.$id);

        // Check if position is already taken
        const positionTaken = latestPlayers.some(
          p => p.$id !== currentPlayer.$id && p.team === team && p.role === role
        );

        if (positionTaken) {
          // Update local state with latest players
          set({ players: latestPlayers });
          throw new Error('This position is already taken');
        }

        set({ isLoading: true, error: null });
        try {
          const updatedPlayer = await updatePlayer(currentPlayer.$id, { team, role });

          // Update game status if waiting
          if (game.status === 'waiting') {
            await updateGame(game.$id, { status: 'selecting' });
          }

          // Fetch all players again to ensure consistency
          const refreshedPlayers = await getGamePlayers(game.$id);

          set({
            currentPlayer: updatedPlayer,
            players: refreshedPlayers,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to select position';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      giveClue: async (word, count) => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) throw new Error('No game or player');

        if (currentPlayer.role !== 'spymaster' || currentPlayer.team !== game.currentTurn) {
          throw new Error('Not your turn to give a clue');
        }

        set({ isLoading: true, error: null });
        try {
          const clue: Clue = {
            word: word.toUpperCase(),
            count,
            givenBy: currentPlayer.team!,
          };

          const updatedGame = await updateGame(game.$id, {
            currentClue: clue,
            guessesRemaining: count + 1, // Allow one extra guess

            currentPhase: 'guessing',
            logs: [
              ...(game.logs || []),
              {
                id: ID.unique(),
                timestamp: new Date().toISOString(),
                type: 'clue',
                team: currentPlayer.team!,
                playerName: currentPlayer.username,
                playerOdId: currentPlayer.odId,
                message: `gave clue "${word}" for ${count}`,
                metadata: { word, count }
              } as LogEntry
            ]
          });

          set({ game: updatedGame, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to give clue';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      confirmGuess: async (tileId) => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) throw new Error('No game or player');

        if (currentPlayer.role !== 'operative' || currentPlayer.team !== game.currentTurn) {
          throw new Error('Not your turn to guess');
        }

        set({ isLoading: true, error: null });
        try {
          const tile = game.tiles.find(t => t.id === tileId);
          if (!tile) throw new Error('Tile not found');

          const result = processTileSelection(game, tileId, currentPlayer.team!);

          // Clear tentative guesses for this tile since it's now revealed
          const updatedTiles = result.tiles.map(t => {
            if (t.id === tileId) {
              return { ...t, tentativeBy: undefined };
            }
            return t;
          });

          const updatedGame = await updateGame(game.$id, {
            tiles: updatedTiles,
            guessesRemaining: result.guessesRemaining,
            currentTurn: result.currentTurn,

            currentPhase: result.currentPhase,
            winner: result.winner,
            blueScore: result.blueScore,
            redScore: result.redScore,
            currentClue: result.currentPhase === 'giving_clue' ? null : game.currentClue,
            logs: [
              ...(game.logs || []),
              {
                id: ID.unique(),
                timestamp: new Date().toISOString(),
                type: 'guess',
                team: currentPlayer.team!,
                playerName: currentPlayer.username,
                playerOdId: currentPlayer.odId,
                message: `guessed "${tile.word}"`,
                metadata: {
                  tileWord: tile.word,
                  tileColor: tile.color,
                  isCorrect: tile.color === currentPlayer.team
                }
              } as LogEntry
            ]
          });

          set({ game: updatedGame, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to select tile';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      toggleTentativeGuess: async (tileId) => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) return; // Silent fail if no context

        // Only operatives can mark tentative guesses
        if (currentPlayer.role !== 'operative') return;

        // Set flag to prevent subscription overwrites during optimistic update
        set({ pendingTentativeUpdate: true } as any);

        // Optimistic update
        const updatedTiles = game.tiles.map(t => {
          if (t.id === tileId) {
            const currentTentative = t.tentativeBy || [];
            const isTentative = currentTentative.includes(currentPlayer.$id);

            let newTentative;
            if (isTentative) {
              newTentative = currentTentative.filter(id => id !== currentPlayer.$id);
            } else {
              newTentative = [...currentTentative, currentPlayer.$id];
            }

            return { ...t, tentativeBy: newTentative };
          }
          return t;
        });

        set({ game: { ...game, tiles: updatedTiles } });

        // Background update
        try {
          await updateGame(game.$id, {
            tiles: updatedTiles,
          });
        } catch (error) {
          // Revert on failure? Or just ignore for now as it's ephemeral
          console.error('Failed to update tentative guess', error);
        } finally {
          // Clear update flag after a short delay to allow subscription to catch up
          setTimeout(() => {
            set({ pendingTentativeUpdate: false } as any);
          }, 500);
        }
      },

      endTurn: async () => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) throw new Error('No game or player');

        if (currentPlayer.role !== 'operative' || currentPlayer.team !== game.currentTurn) {
          throw new Error('Not your turn');
        }

        set({ isLoading: true, error: null });
        try {
          const nextTurn: Team = game.currentTurn === 'blue' ? 'red' : 'blue';

          const updatedGame = await updateGame(game.$id, {
            currentTurn: nextTurn,
            currentPhase: 'giving_clue',
            guessesRemaining: 0,
            currentClue: null,
            logs: [
              ...(game.logs || []),
              {
                id: ID.unique(),
                timestamp: new Date().toISOString(),
                type: 'pass',
                team: game.currentTurn,
                playerName: currentPlayer.username,
                playerOdId: currentPlayer.odId,
                message: 'ended the turn',
              } as LogEntry,
            ],
          });

          set({ game: updatedGame, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to end turn';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      endGame: async () => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) throw new Error('No game or player');

        // Check if admin
        if (!currentPlayer.isAdmin && game.adminPlayerId !== currentPlayer.$id) {
          throw new Error('Only admin can end the game');
        }

        set({ isLoading: true, error: null });
        try {
          // Update game status to finished
          const updatedGame = await updateGame(game.$id, {
            status: 'finished',
            // No winner set implies manual stop/draw
            winner: null,
            logs: [
              ...(game.logs || []),
              {
                id: ID.unique(),
                timestamp: new Date().toISOString(),
                type: 'pass',
                team: game.currentTurn,
                playerName: currentPlayer.username,
                playerOdId: currentPlayer.odId,
                message: 'Admin ended the game manually',
              } as LogEntry,
            ],
          });

          set({ game: updatedGame, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to end game';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      subscribeToUpdates: () => {
        const { game } = get();
        if (!game) return () => { };

        const unsubGame = subscribeToGame(game.$id, (updatedGame) => {
          const { pendingTentativeUpdate, game: currentGame } = get() as any;

          // If we have a pending tentative update, preserve the local tentative selections
          if (pendingTentativeUpdate && currentGame) {
            const mergedTiles = updatedGame.tiles.map(tile => {
              const localTile = currentGame.tiles.find((t: any) => t.id === tile.id);
              if (localTile && localTile.tentativeBy && localTile.tentativeBy.length > 0) {
                // Keep local tentative selections
                return { ...tile, tentativeBy: localTile.tentativeBy };
              }
              return tile;
            });
            set({ game: { ...updatedGame, tiles: mergedTiles } });
          } else {
            set({ game: updatedGame });
          }
        });

        const unsubPlayers = subscribeToPlayers(game.$id, (players) => {
          set({ players });

          // Update current player if it exists in the list
          const { currentPlayer } = get();
          if (currentPlayer) {
            const updated = players.find(p => p.$id === currentPlayer.$id);
            if (updated) {
              set({ currentPlayer: updated });
            }
          }
        });

        return () => {
          unsubGame();
          unsubPlayers();
        };
      },


      getWordMeaning: async (word) => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) throw new Error('No game or player');

        if (!game.enableMeanings) throw new Error('Meanings are not enabled in this game');

        // Use default of 0 if undefined
        const used = currentPlayer.meaningsUsed || 0;
        const max = game.maxMeaningsPerPlayer || 0;

        if (used >= max) {
          throw new Error(`You have used all your ${max} meaning lookups.`);
        }

        try {
          // 1. Fetch meaning from free dictionary API
          const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
          if (!res.ok) throw new Error('Definition not found');
          const data = await res.json();

          // Extract first definition
          const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition found';

          // 2. Update usage count optimistically & in DB
          const newCount = used + 1;
          const updatedPlayer = { ...currentPlayer, meaningsUsed: newCount };
          set({ currentPlayer: updatedPlayer }); // Optimistic

          await updatePlayer(currentPlayer.$id, { meaningsUsed: newCount });

          return meaning;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch meaning');
        }
      },

      leaveGame: async () => {
        const { game, currentPlayer } = get();
        if (!game || !currentPlayer) return;

        try {
          // Delete player from database
          await deletePlayer(currentPlayer.$id);

          // Clear session from localStorage
          clearPlayerSession(game.$id);

          // Reset local state
          set({
            currentPlayer: null,
            game: null,
            players: [],
          });
        } catch (error) {
          console.error('Failed to leave game:', error);
          throw error;
        }
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'codenames-game',
      partialize: (state) => ({
        currentPlayer: state.currentPlayer,
      }),
    }
  )
);
