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
export async function generateGameWords(): Promise<string[]> {
  const allWords: Set<string> = new Set();
  
  try {
    // Step 1: Get random seed words (get more than needed for variety)
    const randomWords = await fetchRandomWords(15);
    randomWords.forEach(w => allWords.add(w));
    
    // Step 2: Pick 3-4 random seed words to get related words
    const seedWords = shuffleArray(randomWords).slice(0, 4);
    
    // Step 3: Fetch related words for each seed
    for (const seed of seedWords) {
      if (allWords.size >= 30) break; // Get a few extra in case of duplicates
      
      const related = await fetchRelatedWords(seed, 5);
      related.forEach(w => allWords.add(w));
    }
    
    // Step 4: If we still don't have enough, fetch more random words
    if (allWords.size < 25) {
      const moreRandom = await fetchRandomWords(25 - allWords.size + 5);
      moreRandom.forEach(w => allWords.add(w));
    }
    
    // Step 5: Shuffle and return exactly 25 words
    const wordArray = shuffleArray(Array.from(allWords));
    
    if (wordArray.length >= 25) {
      return wordArray.slice(0, 25);
    }
    
    // Fallback: if API failed, use backup words
    console.warn('Not enough words from API, using fallback');
    return getFallbackWords(25 - wordArray.length, wordArray);
    
  } catch (error) {
    console.error('Error generating game words:', error);
    // Return fallback words if API completely fails
    return getFallbackWords(25, []);
  }
}

// Fallback words in case API fails
const FALLBACK_WORDS = [
  'OCEAN', 'RIVER', 'MOUNTAIN', 'FOREST', 'DESERT',
  'CASTLE', 'BRIDGE', 'TOWER', 'GARDEN', 'TEMPLE',
  'DRAGON', 'KNIGHT', 'WIZARD', 'PIRATE', 'NINJA',
  'DIAMOND', 'SILVER', 'COPPER', 'CRYSTAL', 'PEARL',
  'THUNDER', 'SHADOW', 'FLAME', 'FROST', 'STORM',
  'ROCKET', 'PLANET', 'COMET', 'GALAXY', 'NEBULA',
  'PHOENIX', 'SPHINX', 'GRIFFIN', 'UNICORN', 'HYDRA',
  'ANCHOR', 'COMPASS', 'LANTERN', 'SCROLL', 'DAGGER',
  'FALCON', 'PANTHER', 'SERPENT', 'DOLPHIN', 'BUFFALO',
  'PALACE', 'HARBOR', 'VILLAGE', 'KINGDOM', 'EMPIRE',
];

function getFallbackWords(count: number, existingWords: string[]): string[] {
  const available = FALLBACK_WORDS.filter(w => !existingWords.includes(w));
  const shuffled = shuffleArray(available);
  return [...existingWords, ...shuffled.slice(0, count)].slice(0, 25);
}
