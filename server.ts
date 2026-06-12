import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  console.log('Gemini AI Client initialized successfully.');
} else {
  console.warn('GEMINI_API_KEY is not defined. Falling back to semantic matching logic.');
}

// Track IDs and Info for dynamic mapping in AI Prompt
const AVAILABLE_TRACK_PROFILES = [
  { id: 'track-1', title: 'Midnight Lofi Coffee', genre: 'Lo-Fi Chill', description: 'Rain falling, cup of coffee, smooth jazz trumpet' },
  { id: 'track-2', title: 'Neon Odyssey', genre: 'Synthwave', description: 'Retro synthesizer, 80s ride, high-octane analog beat' },
  { id: 'track-3', title: 'Summer Breeze Resonance', genre: 'Acoustic / Indie Pop', description: 'Acoustic guitar strumming, ocean beach, lemonade' },
  { id: 'track-4', title: 'Focus Horizon Piano', genre: 'Classical / Ambient', description: 'Graceful slow piano keys, soft string pads, meditative sanctuary' },
  { id: 'track-5', title: 'Cyberpunk Grind', genre: 'Electronic / Industrial', description: 'Aggressive industrial overdrive, hackers, digital grid' },
  { id: 'track-6', title: 'Sunset Dreams', genre: 'Synthwave / Chillwave', description: 'Malibu drive, solar sunset, palm trees, infinite boulevard' },
  { id: 'track-7', title: 'Ethereal Forest', genre: 'Ambient / New Age', description: 'Woodland breeze, birds, wooden chimes, escape standard speed' },
  { id: 'track-8', title: 'High-Altitude Focus', genre: 'Focus / Lo-Fi Beats', description: 'Vinyl crackle, chill hop rhythm, coding midnight focus' }
];

// Fallback recommendations if API is down or API Key is missing
const FALLBACK_RECOMMENDATIONS = [
  {
    title: 'Raindrops & Lavender',
    artist: 'Sora Beats',
    vibeDescription: 'A delicate down-beat lo-fi track with real-world lavender room ambiance, perfect for cozy reading.',
    similarTo: 'track-1',
    genre: 'Lo-Fi Chill',
    mood: 'chill',
    lyricsExcerpt: 'Lavender drops on my collar, drift into sleep as the hours disappear...'
  },
  {
    title: 'Outrun Solar Flare',
    artist: 'Vektor Space',
    vibeDescription: 'An aggressive retro arpeggiator track that makes you feel like you are chasing a red star in a wireframe grid.',
    similarTo: 'track-2',
    genre: 'Synthwave',
    mood: 'workout',
    lyricsExcerpt: 'Ignition key in the console, burning through the vector lanes...'
  },
  {
    title: 'Warm Pine Acoustic',
    artist: 'Sunny & The Tide',
    vibeDescription: 'Cheerful finger-picked nylon acoustic melody that feels like resting in a forest hammock under a warm sun.',
    similarTo: 'track-3',
    genre: 'Acoustic / Indie Pop',
    mood: 'happy',
    lyricsExcerpt: 'Pine needles under my shadow, climbing high to see the sea go green...'
  },
  {
    title: 'Solitude In C-Minor',
    artist: 'Amelia Hayes',
    vibeDescription: 'A rich, resonant acoustic piano masterpiece that winds down with ambient string swells.',
    similarTo: 'track-4',
    genre: 'Classical / Ambient',
    mood: 'focus',
    lyricsExcerpt: '🌸 (Resonant cello holding a deep harmonic drone) 🌸'
  },
  {
    title: 'Mainframe Fracture',
    artist: '0xREBEL',
    vibeDescription: 'Heavy mechanical thuds, industrial distortions, and fast cyberpunk beats for high-speed focus.',
    similarTo: 'track-5',
    genre: 'Electronic / Industrial',
    mood: 'workout',
    lyricsExcerpt: 'Break the latch on the cabinet, downloading the master grid tonight...'
  }
];

// AI API: Recommendations
app.post('/api/recommendations', async (req, res) => {
  const { prompt, currentVibe, favoriteGenres } = req.body;

  try {
    if (!ai) {
      console.log('Using local semantic engine for client requests due to absence of GEMINI_API_KEY');
      // Mix and match some items based on currentVibe/genres
      const filtered = FALLBACK_RECOMMENDATIONS.filter(item => {
        if (currentVibe && item.mood.toLowerCase() === currentVibe.toLowerCase()) return true;
        if (favoriteGenres && favoriteGenres.length > 0) {
          return favoriteGenres.some((g: string) => item.genre.toLowerCase().includes(g.toLowerCase()));
        }
        return true;
      });
      return res.json({ 
        recommendations: filtered.length > 0 ? filtered : FALLBACK_RECOMMENDATIONS,
        isAiGenerated: false 
      });
    }

    const systemPrompt = `You are Harmony AI, the music curation intelligence of our premium, high-end billion-dollar music streaming app "Harmony".
Based on the user's input, mood, or custom prompt, you will generate exactly 4-5 original, highly imaginative music recommendations representing fictional tracks the user would love.

CRITICAL: For each generated track recommendation, you MUST map it to one of our existing real-world playable tracks under the "similarTo" property. Choose the best matching track ID from this exact list:
${AVAILABLE_TRACK_PROFILES.map(t => `- "${t.id}" (${t.title} - ${t.genre}): ${t.description}`).join('\n')}

For each recommended song, include:
1. "title": A beautiful, poetic, or exciting song name.
2. "artist": A cool, modern fictional artist or band name.
3. "vibeDescription": A short, vivid 2-sentence description of the emotional vibe, sound elements, and why they will love it.
4. "similarTo": The EXACT track ID from the list above which contains similar audio patterns, tempo, or instruments.
5. "genre": The general genre (e.g. Lo-Fi Chill, Synthwave, Acoustic, Classical Ambient, Industrial Electronic).
6. "mood": One of: "chill", "workout", "focus", "happy", "sleep".
7. "lyricsExcerpt": A 1-2 line beautiful lyric or descriptive instrumental performance cue.

Generate these recommendations now in markdown-free JSON.`;

    const userPromptText = `User Custom request: "${prompt || 'Suggest premium tracks for a coding session'}"
Current playing mood/vibe selected: "${currentVibe || 'any'}"
Favorite genres: "${favoriteGenres ? favoriteGenres.join(', ') : 'any'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPromptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              vibeDescription: { type: Type.STRING },
              similarTo: { type: Type.STRING },
              genre: { type: Type.STRING },
              mood: { type: Type.STRING },
              lyricsExcerpt: { type: Type.STRING }
            },
            required: ['title', 'artist', 'vibeDescription', 'similarTo', 'genre', 'mood', 'lyricsExcerpt']
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || '[]');
    res.json({ recommendations: parsedData, isAiGenerated: true });

  } catch (error: any) {
    console.error('Gemini generator failed, falling back gracefully:', error);
    res.json({ recommendations: FALLBACK_RECOMMENDATIONS, isAiGenerated: false, error: error.message });
  }
});

// Vite Middleware for Hot Module Replacement / Asset serving in Dev
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production bundles from dist/.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Harmony fullstack server booted perfectly at http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Server failed to start:', err);
});
