import { useCallback } from 'react';

type SoundType = 'card-shuffle' | 'tile-flip' | 'correct' | 'wrong' | 'game-start' | 'assassin' | 'button';

const audioCache: Record<string, HTMLAudioElement> = {};

export function useSound() {
    // Initialize sounds lazily/synchronously if not already cached
    if (typeof window !== 'undefined' && Object.keys(audioCache).length === 0) {
        const sounds: Record<SoundType, string> = {
            'card-shuffle': '/sounds/card-shuffle.mp3',
            'tile-flip': '/sounds/tile-flip.mp3',
            'correct': '/sounds/correct.mp3',
            'wrong': '/sounds/wrong.mp3',
            'game-start': '/sounds/game-start.mp3',
            'assassin': '/sounds/assassin.mp3',
            'button': '/sounds/button.mp3',
        };

        Object.entries(sounds).forEach(([key, src]) => {
            const audio = new Audio(src);
            audio.preload = 'auto'; // Preload fully
            audio.volume = 0.4; // Default volume
            audioCache[key] = audio;
        });
    }

    const play = useCallback((sound: SoundType, volume = 0.4) => {
        const audio = audioCache[sound];
        if (audio) {
            audio.currentTime = 0; // Reset to start
            audio.volume = volume;
            audio.play().catch(err => {
                console.warn(`Audio play failed for "${sound}":`, err.name, err.message);
            });
        } else {
            console.warn(`Sound "${sound}" not found or not loaded.`);
        }
    }, []);

    return { play };
}
