# Diss-Master Database Structure

## Database
**Name**: `Diss-Master Database`
**ID**: `diss-master-db`

---

## Collection: Games
**Name**: `Games`
**ID**: `games`

### Attributes
| Key | Type | Size | Required | Array | Default |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `code` | String | 6 | Yes | No | - |
| `status` | String | 20 | Yes | No | - |
| `currentTurn` | String | 10 | Yes | No | - |
| `currentPhase` | String | 20 | Yes | No | - |
| `currentClue` | String | 500 | No | No | - |
| `guessesRemaining` | Integer | - | Yes | No | 0 |
| `tiles` | String | 15000 | Yes | No | - |
| `startingTeam` | String | 10 | Yes | No | - |
| `winner` | String | 10 | No | No | - |
| `adminPlayerId` | String | 50 | Yes | No | - |
| `blueScore` | Integer | - | Yes | No | 0 |
| `redScore` | Integer | - | Yes | No | 0 |
| `createdAt` | String | 50 | Yes | No | - |
| `logs` | String | 1000 | No | Yes | - |
| `enableMeanings` | Boolean | - | No | No | false |
| `maxMeaningsPerPlayer` | Integer | - | No | No | 0 |

### Indexes
| Key | Type | Attributes |
| :--- | :--- | :--- |
| `code_index` | Key | `code` |

### Permissions
*   **Role**: `Any`
*   **Access**: Create, Read, Update

---

## Collection: Players
**Name**: `Players`
**ID**: `players`

### Attributes
| Key | Type | Size | Required | Array | Default |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `gameId` | String | 50 | Yes | No | - |
| `odId` | String | 50 | Yes | No | - |
| `username` | String | 20 | Yes | No | - |
| `team` | String | 10 | No | No | - |
| `role` | String | 20 | No | No | - |
| `isAdmin` | Boolean | - | Yes | No | false |
| `joinedAt` | String | 50 | Yes | No | - |
| `meaningsUsed` | Integer | - | No | No | 0 |

### Indexes
| Key | Type | Attributes |
| :--- | :--- | :--- |
| `gameId_index` | Key | `gameId` |

### Permissions
*   **Role**: `Any`
*   **Access**: Create, Read, Update, Delete
