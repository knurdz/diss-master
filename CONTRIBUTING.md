# Contributing to Diss-Master

Thanks for your interest in contributing! This project was built as part of a dissertation, but contributions are welcome to improve the game.

## Getting Started

1. **Fork the repository** at [github.com/knurdz/diss-master](https://github.com/knurdz/diss-master)
2. **Clone your fork**

   ```bash
   git clone https://github.com/<your-username>/diss-master.git
   cd diss-master
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your Appwrite credentials. See [`scripts/setup-appwrite.md`](scripts/setup-appwrite.md) for database setup instructions.

5. **Start the development server**

   ```bash
   npm run dev
   ```

## Making Changes

1. Create a new branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they pass linting:

   ```bash
   npm run lint
   ```

3. Test your changes locally by running the dev server.

4. Commit with a clear, descriptive message:

   ```bash
   git commit -m "Add: brief description of your change"
   ```

5. Push to your fork and open a pull request against `main`.

## What You Can Contribute

- **Bug fixes** — Found something broken? Fix it and submit a PR.
- **UI/UX improvements** — Better layouts, animations, or accessibility.
- **New features** — Have an idea? Open an issue first to discuss it.
- **Documentation** — Improvements to the README, setup guides, or code comments.
- **Performance** — Optimizations to reduce load times or improve responsiveness.

## Guidelines

- Keep PRs focused on a single change or feature.
- Follow the existing code style (TypeScript, Tailwind CSS classes, component structure).
- Do not commit `.env.local` or any files containing secrets.
- Run `npm run lint` before submitting to catch any issues.
- Be respectful and constructive in discussions.

## Reporting Issues

If you find a bug or have a suggestion, [open an issue](https://github.com/knurdz/diss-master/issues) with:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## Project Structure

```
src/
  app/            # Next.js pages (home, game, join, about)
  components/     # React components
  hooks/          # Custom hooks
  lib/            # Appwrite client, game logic, word generation
  store/          # Zustand game store
  types/          # TypeScript type definitions
```

## License

This project is for educational purposes as part of a dissertation. By contributing, you agree that your contributions fall under the same terms.
