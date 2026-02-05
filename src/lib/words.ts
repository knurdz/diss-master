// Word list for Codenames game - common English nouns
export const WORD_LIST: string[] = [
  // Nature
  "APPLE", "BANANA", "CHERRY", "GRAPE", "LEMON", "ORANGE", "PEACH", "BERRY",
  "TREE", "FOREST", "RIVER", "OCEAN", "MOUNTAIN", "VALLEY", "DESERT", "ISLAND",
  "FLOWER", "GRASS", "LEAF", "ROOT", "BRANCH", "SEED", "ROSE", "TULIP",
  "SUN", "MOON", "STAR", "CLOUD", "RAIN", "SNOW", "WIND", "STORM",
  
  // Animals
  "DOG", "CAT", "BIRD", "FISH", "HORSE", "COW", "PIG", "SHEEP",
  "LION", "TIGER", "BEAR", "WOLF", "FOX", "DEER", "RABBIT", "MOUSE",
  "EAGLE", "OWL", "HAWK", "CROW", "DUCK", "SWAN", "PENGUIN", "PARROT",
  "SHARK", "WHALE", "DOLPHIN", "OCTOPUS", "CRAB", "LOBSTER", "TURTLE", "FROG",
  "SNAKE", "LIZARD", "SPIDER", "ANT", "BEE", "BUTTERFLY", "BEETLE", "WORM",
  
  // Objects
  "TABLE", "CHAIR", "LAMP", "CLOCK", "MIRROR", "WINDOW", "DOOR", "FLOOR",
  "BED", "PILLOW", "BLANKET", "TOWEL", "SOAP", "BRUSH", "COMB", "RAZOR",
  "PHONE", "COMPUTER", "KEYBOARD", "SCREEN", "CAMERA", "RADIO", "SPEAKER", "CABLE",
  "PEN", "PENCIL", "PAPER", "BOOK", "NOTEBOOK", "FOLDER", "STAMP", "ENVELOPE",
  "KNIFE", "FORK", "SPOON", "PLATE", "BOWL", "CUP", "GLASS", "BOTTLE",
  "KEY", "LOCK", "CHAIN", "ROPE", "STRING", "WIRE", "NAIL", "HAMMER",
  
  // Places
  "HOUSE", "BUILDING", "TOWER", "CASTLE", "PALACE", "CHURCH", "TEMPLE", "SCHOOL",
  "HOSPITAL", "BANK", "STORE", "MARKET", "RESTAURANT", "HOTEL", "AIRPORT", "STATION",
  "PARK", "GARDEN", "BEACH", "BRIDGE", "ROAD", "STREET", "PATH", "TUNNEL",
  "CITY", "TOWN", "VILLAGE", "COUNTRY", "STATE", "NATION", "WORLD", "SPACE",
  
  // Food & Drink
  "BREAD", "BUTTER", "CHEESE", "MILK", "EGG", "MEAT", "CHICKEN", "BEEF",
  "RICE", "PASTA", "SOUP", "SALAD", "SANDWICH", "PIZZA", "BURGER", "TACO",
  "COFFEE", "TEA", "JUICE", "WATER", "SODA", "WINE", "BEER", "ICE",
  "SUGAR", "SALT", "PEPPER", "SAUCE", "OIL", "HONEY", "JAM", "CREAM",
  
  // Clothing
  "SHIRT", "PANTS", "DRESS", "SKIRT", "JACKET", "COAT", "SWEATER", "VEST",
  "HAT", "CAP", "GLOVE", "SCARF", "TIE", "BELT", "SHOE", "BOOT",
  "SOCK", "WATCH", "RING", "NECKLACE", "BRACELET", "EARRING", "GLASSES", "BAG",
  
  // Body
  "HEAD", "FACE", "EYE", "EAR", "NOSE", "MOUTH", "TOOTH", "TONGUE",
  "NECK", "SHOULDER", "ARM", "HAND", "FINGER", "CHEST", "BACK", "STOMACH",
  "LEG", "KNEE", "FOOT", "TOE", "HEART", "BRAIN", "BONE", "MUSCLE",
  
  // Transport
  "CAR", "TRUCK", "BUS", "TRAIN", "PLANE", "SHIP", "BOAT", "BIKE",
  "WHEEL", "ENGINE", "FUEL", "TIRE", "SEAT", "MIRROR", "HORN", "LIGHT",
  
  // People & Professions
  "DOCTOR", "NURSE", "TEACHER", "STUDENT", "LAWYER", "JUDGE", "POLICE", "SOLDIER",
  "ARTIST", "ACTOR", "SINGER", "DANCER", "WRITER", "CHEF", "FARMER", "PILOT",
  "KING", "QUEEN", "PRINCE", "KNIGHT", "PIRATE", "NINJA", "WIZARD", "GIANT",
  
  // Abstract
  "LOVE", "PEACE", "WAR", "DEATH", "LIFE", "TIME", "LUCK", "FATE",
  "DREAM", "HOPE", "FEAR", "ANGER", "JOY", "PAIN", "POWER", "FORCE",
  
  // Actions (as nouns)
  "PLAY", "GAME", "RACE", "FIGHT", "DANCE", "SONG", "MOVIE", "SHOW",
  "SHOT", "PASS", "CATCH", "THROW", "JUMP", "KICK", "PUNCH", "SWING",
  
  // Sports & Games
  "BALL", "BAT", "NET", "GOAL", "SCORE", "TEAM", "MATCH", "CARD",
  "DICE", "CHESS", "POKER", "POOL", "GOLF", "TENNIS", "SOCCER", "HOCKEY",
  
  // Science & Tech
  "ATOM", "CELL", "GENE", "VIRUS", "WAVE", "RAY", "LASER", "ROBOT",
  "CODE", "DATA", "FILE", "DISK", "CHIP", "NETWORK", "SERVER", "BROWSER",
  
  // Music
  "DRUM", "GUITAR", "PIANO", "VIOLIN", "FLUTE", "TRUMPET", "BELL", "STRING",
  "BEAT", "RHYTHM", "MELODY", "NOTE", "BAND", "CONCERT", "RECORD", "ALBUM",
  
  // Materials
  "WOOD", "METAL", "GOLD", "SILVER", "IRON", "STEEL", "COPPER", "BRONZE",
  "STONE", "ROCK", "SAND", "CLAY", "GLASS", "PLASTIC", "RUBBER", "LEATHER",
  "COTTON", "SILK", "WOOL", "PAPER", "FABRIC", "DIAMOND", "CRYSTAL", "PEARL",
  
  // Misc
  "FIRE", "SMOKE", "ASH", "DUST", "MUD", "FOG", "SHADOW", "LIGHT",
  "SOUND", "SMELL", "TASTE", "TOUCH", "COLOR", "SHAPE", "SIZE", "WEIGHT",
  "NORTH", "SOUTH", "EAST", "WEST", "CENTER", "CORNER", "EDGE", "SIDE",
  "TOP", "BOTTOM", "FRONT", "BACK", "LEFT", "RIGHT", "UP", "DOWN",
  "DAY", "NIGHT", "MORNING", "EVENING", "WEEK", "MONTH", "YEAR", "CENTURY",
  "SPRING", "SUMMER", "FALL", "WINTER", "HOLIDAY", "BIRTHDAY", "WEDDING", "PARTY",
];

// Get random unique words from the list
export function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
