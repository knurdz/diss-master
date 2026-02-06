'use client';

import { ArrowLeft, Star, Github, Linkedin, Gamepad2, Heart, ExternalLink, Sparkles, BookOpen, PenLine, User } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen animated-bg flex flex-col p-4 md:p-8 text-white">
      {/* Top Navigation Links */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <Link
          href="/rules"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Rules
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          Home
        </Link>
      </div>

      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-red-500 mb-4 shadow-xl">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="game-title text-4xl md:text-5xl mb-2">
            <span className="text-blue-400">DISS</span>
            <span className="text-red-400">-MASTER</span>
          </h1>
          <p className="text-white/50">The ultimate word guessing game</p>
        </div>

        {/* About the Game */}
        <div className="game-card p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-blue-400" />
            About the Game
          </h2>
          <p className="text-white/70 leading-relaxed">
            Diss-Master is a real-time multiplayer word game inspired by{' '}
            <a
              href="https://codenames.game/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1"
            >
              Codenames
              <ExternalLink className="w-3 h-3" />
            </a>
            , the beloved board game designed by Vlaada Chv&aacute;til and published by
            Czech Games Edition.
          </p>
          <p className="text-white/70 leading-relaxed">
            Two teams compete to uncover their agents on a 5&times;5 grid of words. Each team&apos;s
            Spymaster gives one-word clues to guide their Operatives, while avoiding the
            dreaded assassin tile.
          </p>

          <div className="border-t border-white/10" />

          <h3 className="text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            What&apos;s Different from the Original?
          </h3>
          <p className="text-white/70 leading-relaxed text-sm">
            While Diss-Master stays true to the core Codenames gameplay, it introduces
            several features not found in the original:
          </p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
              <BookOpen className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">Word Meaning Finder</h3>
                <p className="text-white/50 text-sm">
                  Operatives can look up dictionary definitions for words on the board. The host
                  sets how many lookups each player gets, adding a strategic layer &mdash;
                  use them wisely.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
              <PenLine className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">100% Custom Words</h3>
                <p className="text-white/50 text-sm">
                  Unlike the original Codenames where custom words only partially replace the
                  default set, Diss-Master lets you play with a fully custom word list. Provide
                  25 or more words and the entire board uses your words &mdash; perfect for
                  themed games, study sessions, or inside jokes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="game-card p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Credits
          </h2>
          <div className="space-y-3 text-white/70">
            <p>
              The original{' '}
              <a
                href="https://codenames.game/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                Codenames
              </a>{' '}
              board game is created by <span className="text-white font-medium">Vlaada Chv&aacute;til</span> and
              published by{' '}
              <span className="text-white font-medium">Czech Games Edition</span>. All rights to the
              original game concept belong to their respective owners.
            </p>
            <p>
              This digital adaptation was built as part of a dissertation project with the aid of
              agentic AI and is intended for educational purposes only.
            </p>
          </div>
        </div>

        {/* Project & Developer */}
        <div className="game-card p-6 space-y-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Built by <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Knurdz</span>
          </h2>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white/40">Project</div>
            <a
              href="https://github.com/knurdz/diss-master"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium"
            >
              <Github className="w-4 h-4" />
              knurdz/diss-master
              <ExternalLink className="w-3 h-3 text-white/40" />
            </a>
          </div>

          <div className="border-t border-white/10" />

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white/40">Developer</div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/rkvishwa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                rkvishwa
              </a>
              <a
                href="https://www.linkedin.com/in/rkk-vishva"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 transition-all text-sm font-medium text-blue-300"
              >
                <Linkedin className="w-4 h-4" />
                rkk-vishva
              </a>
            </div>
          </div>
        </div>

        {/* Star on GitHub */}
        <div className="game-card p-6 text-center space-y-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <Star className="w-8 h-8 text-yellow-400 mx-auto" />
          <h2 className="text-xl font-bold">Enjoying Diss-Master?</h2>
          <p className="text-white/60 text-sm">
            If you like this project, consider giving it a star on GitHub!
          </p>
          <a
            href="https://github.com/knurdz/diss-master"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold transition-all shadow-lg hover:shadow-yellow-500/25 active:scale-95"
          >
            <Star className="w-5 h-5" />
            Star on GitHub
          </a>
        </div>

        {/* Tech Stack */}
        <div className="game-card p-6 space-y-4">
          <h2 className="text-xl font-bold">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Appwrite', 'Radix UI', 'Docker'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-sm font-medium text-white/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/30 text-sm pb-8 space-y-1">
          <p>
            Diss-Master &mdash; A dissertation project by{' '}
            <a href="https://github.com/rkvishwa" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/70 underline underline-offset-2">
              Knurdz
            </a>
          </p>
          <p>
            Inspired by{' '}
            <a href="https://codenames.game/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/70 underline underline-offset-2">
              Codenames
            </a>
            {' '}&copy; Czech Games Edition
          </p>
        </div>
      </div>
    </div>
  );
}
