'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, Link, Share2 } from 'lucide-react';

interface ShareLinkProps {
  gameCode: string;
}

import { useSound } from '@/hooks/useSound';

export default function ShareLink({ gameCode }: ShareLinkProps) {
  const { play } = useSound();
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  useEffect(() => {
    setShareUrl(`${window.location.origin}/join/${gameCode}`);
  }, [gameCode]);
  
  const copyToClipboard = async () => {
    play('button');
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyGameCode = async () => {
    play('button');
    try {
      await navigator.clipboard.writeText(gameCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  const shareGame = async () => {
    play('button');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Diss-Master game!',
          text: `Join my Diss-Master game with code: ${gameCode}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };
  
  return (
    <div className="game-card p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Game Code */}
        <div className="flex items-center gap-3">
          <button 
            onClick={copyGameCode}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Click to copy game code"
          >
            {codeCopied ? <Check className="w-5 h-5 text-white" /> : <Link className="w-5 h-5 text-white" />}
          </button>
          <div>
            <div className="text-xs text-white/50 uppercase tracking-wider">Game Code</div>
            <div className="game-title text-2xl tracking-[0.2em] text-purple-300">{gameCode}</div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="hidden sm:block w-px h-12 bg-white/10" />
        
        {/* Actions */}
        <div className="flex-1 flex items-center gap-2">
          {/* URL Display */}
          <div className="flex-1 px-4 py-2 bg-white/5 rounded-xl border border-white/10 truncate text-white/70 text-sm">
            {shareUrl}
          </div>
          
          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className={cn(
              'game-btn flex items-center gap-2 px-4',
              copied ? 'game-btn-green' : 'bg-white/10 hover:bg-white/20 text-white'
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
          
          {/* Share Button (if native share is available) */}
          {'share' in navigator && (
            <button
              onClick={shareGame}
              className="game-btn game-btn-blue flex items-center gap-2 px-4"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
