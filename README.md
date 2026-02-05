# Diss-Master

A real-time multiplayer word game inspired by Codenames. Two teams compete to identify their words on a 5x5 grid using one-word clues from their Spymaster.

**Live:** [diss-master.knurdz.org](https://diss-master.knurdz.org)

## Features

- **Real-time multiplayer** — Powered by Appwrite Realtime with polling fallback
- **No sign-up required** — Just enter a name and start playing
- **Shareable game codes** — 6-character codes for easy joining
- **Custom words** — Create games with your own word lists
- **Word meanings** — Optional dictionary lookups with configurable per-player limits
- **Tentative guesses** — Operatives can mark tiles before confirming
- **Sound effects** — Audio feedback for card flips, correct/wrong guesses, and more
- **Responsive design** — Works on desktop and mobile
- **Admin controls** — Game creator can force-end the game
- **Game log** — Full action history with player avatars and timestamps

## Tech Stack

| Layer            | Technology                          |
| :--------------- | :---------------------------------- |
| Framework        | Next.js 14 (App Router)             |
| Language         | TypeScript                          |
| Styling          | Tailwind CSS                        |
| UI Components    | Radix UI, Lucide React              |
| State Management | Zustand                             |
| Backend / DB     | Appwrite (Database + Realtime)      |
| Deployment       | Docker / Standalone Node.js         |

## Getting Started

### Prerequisites

- Node.js 18+
- An [Appwrite](https://appwrite.io) project (Cloud or self-hosted)

### 1. Clone and install

```bash
git clone https://github.com/knurdz/diss-master.git
cd diss-master
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Appwrite credentials:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=diss-master-db
NEXT_PUBLIC_APPWRITE_GAMES_COLLECTION_ID=games
NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID=players
```

### 3. Set up the Appwrite database

Follow the instructions in [`scripts/setup-appwrite.md`](scripts/setup-appwrite.md) to create the required database, collections, attributes, indexes, and permissions.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                |
| :-------------- | :------------------------- |
| `npm run dev`   | Start development server   |
| `npm run build` | Build for production       |
| `npm start`     | Start production server    |
| `npm run lint`  | Run ESLint                 |

## Docker

The project includes Docker support with a multi-stage build using Next.js standalone output.

```bash
# Using Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t diss-master .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1 \
  -e NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id \
  -e NEXT_PUBLIC_APPWRITE_DATABASE_ID=diss-master-db \
  -e NEXT_PUBLIC_APPWRITE_GAMES_COLLECTION_ID=games \
  -e NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID=players \
  diss-master
```

## How to Play

1. **Create a game** — Enter your name and click "Create Game". Optionally add custom words or enable word meanings.
2. **Share the code** — Send the 6-character game code to your friends.
3. **Pick teams** — Each player joins Blue or Red as either a Spymaster or Operative.
4. **Start the game** — The host starts once at least one player is on each team.
5. **Spymasters give clues** — A single word and a number indicating how many tiles match.
6. **Operatives guess** — Select tiles based on the clue. Correct guesses continue your turn; wrong guesses end it.
7. **Win** — Reveal all your team's tiles first, or survive if the other team hits the assassin tile.

## Project Structure

```
src/
  app/            # Next.js pages (home, game, join, about)
  components/     # React components (GameBoard, TeamPanel, ClueInput, etc.)
  hooks/          # Custom hooks (useSound)
  lib/            # Appwrite client, game logic, word generation
  store/          # Zustand game store
  types/          # TypeScript type definitions
public/
  card-images/    # Tile card artwork (30 images)
  sounds/         # Sound effect audio files
```

## Contributing

Contributions are welcome! See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines on how to get started, make changes, and submit pull requests.

## Built With Agentic AI

This project was built with the aid of agentic AI as part of a dissertation exploring AI-assisted software development.

## License

This project is for educational purposes as part of a dissertation. Inspired by [Codenames](https://codenames.game/) by Vlaada Chvatil / Czech Games Edition.
