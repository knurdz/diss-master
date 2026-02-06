'use client';

import { ArrowLeft, BookOpen, Crown, Users, Target, Skull, Lightbulb, AlertTriangle, CheckCircle2, Shield, Gamepad2, Info } from 'lucide-react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="min-h-screen animated-bg flex flex-col p-4 md:p-8 text-white">
      {/* Top Navigation Links */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <Info className="w-3.5 h-3.5" />
          About
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
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="game-title text-4xl md:text-5xl mb-2">
            Game Rules
          </h1>
          <p className="text-white/50">Learn how to play Diss-Master</p>
        </div>

        {/* Game Overview */}
        <div className="game-card p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Game Overview
          </h2>
          <p className="text-white/70 leading-relaxed">
            Diss-Master is a team-based word guessing game played on a 5×5 grid of 25 words. Two teams, <span className="text-blue-400 font-semibold">Blue Team</span> and <span className="text-red-400 font-semibold">Red Team</span>, compete to identify all their team&apos;s words before the other team.
          </p>

          <div className="space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              Objective
            </h3>
            <p className="text-white/70 leading-relaxed text-sm">
              Be the first team to correctly identify all of your team&apos;s words on the board. The team that goes first has 9 words to find, while the second team has 8 words.
            </p>
          </div>

          <div className="border-t border-white/10" />

          <div className="space-y-3">
            <h3 className="text-base font-bold">Card Types</h3>
            <div className="space-y-2">
              <div className="flex gap-3 items-start p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="w-5 h-5 rounded bg-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-400">Blue Agent</h4>
                  <p className="text-white/50 text-sm">Words belonging to the Blue Team (8-9 words)</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="w-5 h-5 rounded bg-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-400">Red Agent</h4>
                  <p className="text-white/50 text-sm">Words belonging to the Red Team (8-9 words)</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="w-5 h-5 rounded bg-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-400">Innocent Bystander</h4>
                  <p className="text-white/50 text-sm">Neutral words (7 words) &mdash; ends your turn if chosen</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl bg-gray-500/10 border border-gray-500/20">
                <div className="w-5 h-5 rounded bg-gray-700 flex-shrink-0 mt-0.5" />
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-300">Assassin</h4>
                    <p className="text-white/50 text-sm">The deadly word (1 word) &mdash; instant loss if chosen!</p>
                  </div>
                  <Skull className="w-4 h-4 text-red-500 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10" />

          <div className="space-y-3">
            <h3 className="text-base font-bold">Turn Structure</h3>
            <ol className="space-y-2 text-white/70 text-sm list-decimal list-inside">
              <li>The Spymaster gives a one-word clue and a number</li>
              <li>Operatives discuss and select words they think match the clue</li>
              <li>Each correct guess reveals your team&apos;s color and lets you continue</li>
              <li>Choosing a bystander or opponent&apos;s word ends your turn</li>
              <li>Choosing the assassin ends the game &mdash; you lose!</li>
            </ol>
          </div>
        </div>

        {/* Spymaster Rules */}
        <div className="game-card p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Spymaster Rules
          </h2>
          <p className="text-white/70 leading-relaxed">
            The Spymaster is the only player who can see which words belong to which team. They guide their Operatives by giving clues.
          </p>

          <div className="space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Giving Clues
            </h3>
            <div className="space-y-2 text-white/70 text-sm">
              <p>A clue consists of <span className="text-white font-semibold">one word</span> and <span className="text-white font-semibold">one number</span>.</p>
              <p className="pl-4">
                <span className="text-blue-400 font-semibold">Example:</span> &quot;Animal: 3&quot; suggests that 3 words on the board relate to animals.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10" />

          <div className="space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Valid Clues
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Must be <strong className="text-white">one word</strong> (no hyphens or compound phrases)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Can be any part of speech (noun, adjective, verb, etc.)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Should relate to words on the board conceptually</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>The number indicates how many words the clue relates to</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>You can say &quot;0&quot; to indicate the clue relates to none of your remaining words (advanced)</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-white/10" />

          <div className="space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Invalid Clues
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex gap-2">
                <span className="text-red-400">✗</span>
                <span>Cannot use any word visible on the board</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">✗</span>
                <span>Cannot use any form or variant of a board word (e.g., &quot;running&quot; if &quot;run&quot; is on the board)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">✗</span>
                <span>Cannot use acronyms or abbreviations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">✗</span>
                <span>Cannot give clues in other languages (unless agreed upon by all players)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">✗</span>
                <span>Cannot use gestures, emphasis, or additional hints beyond the word and number</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-white/10" />

          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-white/70 text-sm">
              <strong className="text-yellow-400">Pro Tip:</strong> Be strategic! Avoid giving clues that might lead your team to the assassin or the opponent&apos;s words. Think carefully about associations.
            </p>
          </div>
        </div>

        {/* Operatives Rules */}
        <div className="game-card p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Operatives Rules
          </h2>
          <p className="text-white/70 leading-relaxed">
            Operatives are the team members who guess which words on the board match the Spymaster&apos;s clue.
          </p>

          <div className="space-y-3">
            <h3 className="text-base font-bold">Making Guesses</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Discuss the clue with your teammates (but the Spymaster cannot participate)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Click on a word to reveal its type</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>You can make as many guesses as the number in the clue, plus one extra</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>If you guess correctly, you can continue guessing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>If you guess incorrectly (bystander or opponent&apos;s word), your turn ends</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>You can choose to end your turn early to be safe</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-white/10" />

          <div className="space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-400" />
              Word Meaning Finder
            </h3>
            <p className="text-white/70 text-sm">
              If enabled by the host, you have a limited number of dictionary lookups to check the meaning of words on the board. Use them wisely!
            </p>
          </div>

          <div className="border-t border-white/10" />

          <div className="space-y-3">
            <h3 className="text-base font-bold">Strategy Tips</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex gap-2">
                <span className="text-green-400">💡</span>
                <span>Think about multiple meanings and associations of the clue word</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">💡</span>
                <span>Remember past clues &mdash; they can help narrow down remaining words</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">💡</span>
                <span>If unsure, it&apos;s often better to pass than risk choosing the assassin</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">💡</span>
                <span>Communicate with your team! Share your reasoning before clicking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">💡</span>
                <span>Track which words have been revealed to avoid confusion</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-white/10" />

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-white/70 text-sm flex items-start gap-2">
              <Skull className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-red-400">Warning:</strong> Choosing the assassin word instantly loses the game for your team. Always be cautious and think twice before clicking!
              </span>
            </p>
          </div>
        </div>

        {/* Winning the Game */}
        <div className="game-card p-6 space-y-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Winning the Game
          </h2>
          <div className="space-y-3 text-white/70 text-sm">
            <p>A team wins by:</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Correctly identifying all of their team&apos;s words</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>The opposing team selecting the assassin word (instant win)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/30 text-sm pb-8">
          <p>
            Ready to play?{' '}
            <Link href="/" className="text-white/50 hover:text-white/70 underline underline-offset-2">
              Return to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
