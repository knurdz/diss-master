// Datamuse API for dynamic word generation

interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
}

// Minimum frequency threshold - words must be common enough
const MIN_FREQUENCY = 15;

// Parse frequency from tags array (format: "f:123.456")
function getFrequency(tags?: string[]): number {
  if (!tags) return 0;
  const freqTag = tags.find(t => t.startsWith('f:'));
  if (freqTag) {
    return parseFloat(freqTag.substring(2)) || 0;
  }
  return 0;
}

// Fetch random words using pattern matching (5-8 letter words)
// Uses &md=f to get frequency data for filtering
async function fetchRandomWords(count: number): Promise<string[]> {
  const patterns = ['?????', '??????', '???????']; // 5, 6, 7 letter words
  const words: string[] = [];
  
  for (const pattern of patterns) {
    if (words.length >= count) break;
    
    try {
      // Fetch more words than needed since we'll filter by frequency
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${pattern}&max=${count * 3}&md=f`
      );
      
      if (response.ok) {
        const data: DatamuseWord[] = await response.json();
        const newWords = data
          .filter(w => {
            const freq = getFrequency(w.tags);
            return freq > MIN_FREQUENCY && isValidWord(w.word.toUpperCase());
          })
          .map(w => w.word.toUpperCase())
          .filter(w => !words.includes(w));
        words.push(...newWords);
      }
    } catch (error) {
      console.error('Failed to fetch random words:', error);
    }
  }
  
  return words.slice(0, count);
}

// Fetch related words for a given seed word
// Uses &md=f to get frequency data for filtering
async function fetchRelatedWords(seedWord: string, count: number): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(seedWord)}&max=${count * 3}&md=f`
    );
    
    if (response.ok) {
      const data: DatamuseWord[] = await response.json();
      return data
        .filter(w => {
          const freq = getFrequency(w.tags);
          // For related words, be slightly more lenient with frequency
          return freq > MIN_FREQUENCY / 2 && isValidWord(w.word.toUpperCase());
        })
        .map(w => w.word.toUpperCase())
        .filter(w => w !== seedWord.toUpperCase())
        .slice(0, count);
    }
  } catch (error) {
    console.error(`Failed to fetch related words for ${seedWord}:`, error);
  }
  
  return [];
}

// Check if a word is valid for the game (no spaces, reasonable length)
function isValidWord(word: string): boolean {
  return (
    word.length >= 3 &&
    word.length <= 12 &&
    !word.includes(' ') &&
    !word.includes('-') &&
    /^[A-Z]+$/.test(word)
  );
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Main function to generate 25 unique words for a game
// Strategy: Build thematic clusters of related words so spymasters
// can create interesting clue connections.
export async function generateGameWords(): Promise<string[]> {
  const allWords: Set<string> = new Set();

  // Diverse theme seeds – pick a random subset each game so boards vary
  const THEME_SEEDS = [
    // Nature & Geography
    'ocean', 'mountain', 'jungle', 'volcano', 'glacier', 'canyon', 'meadow',
    // Space & Science
    'planet', 'rocket', 'gravity', 'galaxy', 'telescope', 'satellite',
    // Food & Kitchen
    'chocolate', 'kitchen', 'spice', 'bakery', 'harvest', 'feast',
    // War & Conflict
    'sword', 'battle', 'siege', 'armor', 'cannon', 'fortress',
    // Music & Art
    'orchestra', 'canvas', 'melody', 'sculpture', 'theater', 'rhythm',
    // Sports & Games
    'stadium', 'marathon', 'trophy', 'champion', 'soccer', 'tournament',
    // Animals
    'predator', 'safari', 'swarm', 'herd', 'falcon', 'serpent',
    // Technology
    'circuit', 'software', 'antenna', 'engine', 'laser', 'signal',
    // Fantasy & Myth
    'dragon', 'wizard', 'phoenix', 'legend', 'quest', 'treasure',
    // City & Travel
    'harbor', 'airport', 'market', 'bridge', 'subway', 'carnival',
    // Weather & Elements
    'thunder', 'blizzard', 'tornado', 'flame', 'frost', 'shadow',
    // Body & Health
    'muscle', 'pulse', 'breath', 'skeleton', 'vision', 'reflex',
    // Professions
    'detective', 'surgeon', 'captain', 'architect', 'merchant', 'spy',
    // Emotions & Abstract
    'courage', 'mystery', 'revenge', 'silence', 'chaos', 'fortune',
  ];

  try {
    // Pick 5–7 diverse themes at random
    const themes = shuffleArray(THEME_SEEDS).slice(0, 6);

    // Fetch related words in parallel for speed
    const clusterPromises = themes.map(seed =>
      fetchRelatedWords(seed, 8).then(words => ({
        seed: seed.toUpperCase(),
        words,
      }))
    );

    const clusters = await Promise.all(clusterPromises);

    // Add the seed word itself + its related words
    for (const cluster of clusters) {
      if (isValidWord(cluster.seed)) {
        allWords.add(cluster.seed);
      }
      for (const w of cluster.words) {
        allWords.add(w);
        if (allWords.size >= 35) break; // collect extras for variety
      }
    }

    // If we still don't have enough (API issues), pad with random words
    if (allWords.size < 25) {
      const needed = 25 - allWords.size + 5;
      const randomWords = await fetchRandomWords(needed);
      randomWords.forEach(w => allWords.add(w));
    }

    // Shuffle and return exactly 25
    const wordArray = shuffleArray(Array.from(allWords));

    if (wordArray.length >= 25) {
      return wordArray.slice(0, 25);
    }

    // Fallback if API returned too few
    console.warn('Not enough words from API, using fallback');
    return getFallbackWords(25 - wordArray.length, wordArray);
  } catch (error) {
    console.error('Error generating game words:', error);
    return getFallbackWords(25, []);
  }
}

// Fallback words in case API fails – organized in thematic clusters
const FALLBACK_WORDS = [
  // Nature
  'OCEAN', 'RIVER', 'MOUNTAIN', 'FOREST', 'DESERT', 'GLACIER', 'VOLCANO', 'CANYON',
  // Fantasy
  'DRAGON', 'KNIGHT', 'WIZARD', 'PIRATE', 'PHOENIX', 'GRIFFIN', 'UNICORN', 'QUEST',
  // Materials & Gems
  'DIAMOND', 'SILVER', 'COPPER', 'CRYSTAL', 'PEARL', 'MARBLE', 'AMBER', 'RUBY',
  // Weather & Elements
  'THUNDER', 'SHADOW', 'FLAME', 'FROST', 'STORM', 'BLIZZARD', 'TORNADO', 'ECLIPSE',
  // Space
  'ROCKET', 'PLANET', 'COMET', 'GALAXY', 'NEBULA', 'ASTEROID', 'ORBIT', 'GRAVITY',
  // War & Combat
  'FORTRESS', 'CANNON', 'SHIELD', 'ARROW', 'SIEGE', 'ARMOR', 'SWORD', 'DAGGER',
  // Animals
  'FALCON', 'PANTHER', 'SERPENT', 'DOLPHIN', 'BUFFALO', 'SCORPION', 'JAGUAR', 'HAWK',
  // Places
  'PALACE', 'HARBOR', 'VILLAGE', 'KINGDOM', 'EMPIRE', 'TEMPLE', 'CASTLE', 'BRIDGE',
  // Objects & Tools
  'ANCHOR', 'COMPASS', 'LANTERN', 'SCROLL', 'TELESCOPE', 'WHISTLE', 'PENDULUM', 'LEVER',
  // Music & Art
  'SYMPHONY', 'CANVAS', 'RHYTHM', 'MELODY', 'TRUMPET', 'SCULPTURE', 'PORTRAIT', 'CHORUS',
];

function getFallbackWords(count: number, existingWords: string[]): string[] {
  const available = FALLBACK_WORDS.filter(w => !existingWords.includes(w));
  const shuffled = shuffleArray(available);
  return [...existingWords, ...shuffled.slice(0, count)].slice(0, 25);
}
