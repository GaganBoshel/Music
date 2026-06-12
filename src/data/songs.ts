import { Track } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight Lofi Coffee',
    artist: 'Luna Eclipse',
    album: 'Cozy Rain Sessions',
    genre: 'Lo-Fi Chill',
    duration: 372,
    coverUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    lyrics: [
      { time: 0, text: '🎵 (Gentle rain falling on a window pane) 🎵' },
      { time: 8, text: 'Take a sip of coffee, let the tension fade away...' },
      { time: 18, text: 'Neon lights are dancing through the drizzle in the gray.' },
      { time: 30, text: 'We find our quiet harbor, in the middle of the storm,' },
      { time: 42, text: 'Holding onto moments that can keep the spirit warm.' },
      { time: 55, text: '🎵 (Smooth jazz trumpet melody drifting in) 🎵' },
      { time: 70, text: 'Watch the clock speed up, but inside we are slow,' },
      { time: 85, text: 'Letting other voices fade, we bask in this orange glow.' },
      { time: 100, text: 'No need to explain it, we know the words by heart,' },
      { time: 115, text: 'Even when the morning breaks and tears us both apart.' },
      { time: 130, text: '🎵 (Distant record scratch and rain vinyl sounds) 🎵' },
      { time: 160, text: 'Stay a little longer, the water is still hot,' },
      { time: 180, text: 'Counting all the blessings in the coffee cup we got.' },
      { time: 210, text: 'Falling like the drops outside, simple and secure,' },
      { time: 240, text: 'Everything is moving fast, but this tonight is pure.' },
      { time: 280, text: '🎵 (Rain and soft Rhodes piano fading out) 🎵' }
    ],
    isFeatured: true
  },
  {
    id: 'track-2',
    title: 'Neon Odyssey',
    artist: 'HyperDrive',
    album: 'Arcade Horizons',
    genre: 'Synthwave',
    duration: 423,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lyrics: [
      { time: 0, text: '⚡ (Retro synthesizer arpeggio rising) ⚡' },
      { time: 12, text: 'Cruising downtown in an 85 ride...' },
      { time: 22, text: 'Grid-locked dreams on the neon side.' },
      { time: 35, text: 'Accelerating through the laser-beamed night,' },
      { time: 48, text: 'No rear-view mirror, just the violet light.' },
      { time: 60, text: 'Can you feel the pulse? The analog beat?' },
      { time: 72, text: 'Vaporwave static on the empty street.' },
      { time: 85, text: '⚡ (High-octane synth bass drop) ⚡' },
      { time: 110, text: 'Lost in the simulation, looking for a way,' },
      { time: 130, text: 'Chasing the digital sun as it fades to gray.' },
      { time: 155, text: 'We are the riders of the neon wind,' },
      { time: 180, text: 'Ready for the game to finally begin.' },
      { time: 205, text: '⚡ (Soaring electric lead synth solo) ⚡' },
      { time: 250, text: 'Holding onto gears that are turning inside,' },
      { time: 280, text: 'We are the legends that the machines can\'t hide.' },
      { time: 320, text: 'Arcade horizons, burning red and gold,' },
      { time: 350, text: 'In the wires of the cyber-world, we unfold.' }
    ],
    isFeatured: true
  },
  {
    id: 'track-3',
    title: 'Summer Breeze Resonance',
    artist: 'Marina Cove',
    album: 'Ocean Breeze EP',
    genre: 'Acoustic / Indie Pop',
    duration: 302,
    coverUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lyrics: [
      { time: 0, text: '🎸 (Bright acoustic guitar strumming) 🎸' },
      { time: 10, text: 'Salt in the air, sand on our feet.' },
      { time: 20, text: 'Chasing the shoreline, escaping the heat.' },
      { time: 32, text: 'You spoke of your hopes, your eyes like the sea,' },
      { time: 44, text: 'For a minute there, we were totally free.' },
      { time: 56, text: 'Oh, summer breeze, blow our troubles away,' },
      { time: 68, text: 'Tell us everything is gonna be okay.' },
      { time: 80, text: 'Let the waves play the perfect guitar chord,' },
      { time: 92, text: 'In a beach shack we can easily afford.' },
      { time: 104, text: '🎸 (Warm rhythmic clapping with bass) 🎸' },
      { time: 125, text: 'Sunburns and laughter under the pine,' },
      { time: 140, text: 'Pouring the lemonade and taking our time.' },
      { time: 160, text: 'If winter comes back to freeze up our skies,' },
      { time: 180, text: 'I\'ll just remember the warmth in your eyes.' },
      { time: 200, text: '🎸 (Bright melody with ocean waves sound) 🎸' },
      { time: 230, text: 'Oh, summer breeze, keep the daylight alive,' },
      { time: 250, text: 'In this coastal daydream, we will survive.' }
    ]
  },
  {
    id: 'track-4',
    title: 'Focus Horizon Piano',
    artist: 'Julian Richter',
    album: 'Classic Solitude',
    genre: 'Classical / Ambient',
    duration: 318,
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    lyrics: [
      { time: 0, text: '🎹 (Graceful, slow piano keys echoing) 🎹' },
      { time: 15, text: 'No words needed. Focus inward.' },
      { time: 30, text: 'The keys write a letter without any ink.' },
      { time: 50, text: 'Allowing the thoughts to settle, and think.' },
      { time: 70, text: 'Each rising chord, a building of light,' },
      { time: 90, text: 'Clearing the shadows, bringing the sight.' },
      { time: 110, text: '🎹 (Subtle string pads blending in) 🎹' },
      { time: 140, text: 'A deep breath in, as the harmony flows,' },
      { time: 170, text: 'A sanctuary where the consciousness grows.' },
      { time: 200, text: 'Feel the balance, elegant and deep,' },
      { time: 230, text: 'Washing away the memories we shouldn\'t keep.' },
      { time: 260, text: '🎹 (Soft solo piano concluding) 🎹' }
    ]
  },
  {
    id: 'track-5',
    title: 'Cyberpunk Grind',
    artist: 'Grid Overlord',
    album: 'The Rebellion Node',
    genre: 'Electronic / Industrial',
    duration: 412,
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    lyrics: [
      { time: 0, text: '☠️ (Glitchy industrial intro and static) ☠️' },
      { time: 10, text: 'Access Granted. System core bypass.' },
      { time: 20, text: 'Carbon eyes, looking through chrome glass.' },
      { time: 34, text: 'The corporations sleep, while the hackers play,' },
      { time: 48, text: 'We rule the dark nets, we own the gray.' },
      { time: 62, text: 'Drowning out the signal with an heavy bass stomp,' },
      { time: 76, text: 'Waking up the zombies in the digital swamp.' },
      { time: 90, text: '☠️ (Aggressive industrial synth overdrive) ☠️' },
      { time: 120, text: 'Overclocked muscles, electric in our veins,' },
      { time: 140, text: 'No mainframe can hold us, or bind us with chains.' },
      { time: 165, text: 'Break down the firewall, unleash the grid,' },
      { time: 190, text: 'Showing the world what the protocols hid.' },
      { time: 220, text: '☠️ (Distorted synth solo with glitch sound clips) ☠️' }
    ]
  },
  {
    id: 'track-6',
    title: 'Sunset Dreams',
    artist: 'Horizon Wave',
    album: 'Malibu Drive',
    genre: 'Synthwave / Chillwave',
    duration: 335,
    coverUrl: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', // Sharing a fast source
    lyrics: [
      { time: 0, text: '☀️ (Soothing tropical synth drums) ☀️' },
      { time: 12, text: 'The sun goes down, the boulevard lights turn white.' },
      { time: 25, text: 'A silhouette of palm trees in our sight.' },
      { time: 38, text: 'Forget the office, forget the city scale,' },
      { time: 51, text: 'We are on an endless golden highway trail.' },
      { time: 64, text: 'Sunset dreams, infinite and warm,' },
      { time: 77, text: 'Safe in each other, protected from the swarm.' }
    ]
  },
  {
    id: 'track-7',
    title: 'Ethereal Forest',
    artist: 'Zephyr Whisper',
    album: 'Uncharted Meadows',
    genre: 'Ambient / New Age',
    duration: 380,
    coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', // Reuse stable high speed stream
    lyrics: [
      { time: 0, text: '🍃 (Soft woodland sound, birds chirping) 🍃' },
      { time: 15, text: 'Walk through the mossy pines under the morning star.' },
      { time: 32, text: 'Escape the machines that tell you who you are.' },
      { time: 48, text: 'Listen to the breeze, it sings a primal tune,' },
      { time: 65, text: 'Underneath the silver face of the waning June.' },
      { time: 82, text: '✨ (Delicate flute echo and wooden chimes) ✨' }
    ]
  },
  {
    id: 'track-8',
    title: 'High-Altitude Focus',
    artist: 'Nirvana Code',
    album: 'Binary Zen',
    genre: 'Focus / Lo-Fi Beats',
    duration: 320,
    coverUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Reuse stable high speed stream
    lyrics: [
      { time: 0, text: '💻 (Mechanical keyboard clicks, vinyl crackle) 💻' },
      { time: 10, text: 'Compile the code, clear out the noise.' },
      { time: 22, text: 'Coding until midnight, leaving behind all toys.' },
      { time: 35, text: 'Lines of text crawling across the dark display,' },
      { time: 48, text: 'Finding our ultimate zone, miles away.' },
      { time: 60, text: '🎧 (Relaxing chill hop rhythm kicks in) 🎧' }
    ]
  }
];

export const STATIC_PLAYLISTS = [
  {
    id: 'playlist-chill',
    name: 'Lo-Fi Chill Haven',
    description: 'Unhurried beats and ambient soundscapes to ease your mind and sharpen your focus.',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80',
    trackIds: ['track-1', 'track-7', 'track-8']
  },
  {
    id: 'playlist-retro',
    name: 'Synthwave Drift',
    description: 'Unleash the nostalgia with neon pads, pulsing synth bass, and cyber-noir energy.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    trackIds: ['track-2', 'track-5', 'track-6']
  },
  {
    id: 'playlist-gold',
    name: 'Acoustic Paradise',
    description: 'Golden hour guitar strums, breezy vocals, and warm organic rhythms.',
    coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80',
    trackIds: ['track-3', 'track-6', 'track-1']
  }
];

export const POPULAR_ARTISTS = [
  { id: 'art-1', name: 'Luna Eclipse', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', followers: '1.2M', genre: 'Lo-Fi Chill' },
  { id: 'art-2', name: 'HyperDrive', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', followers: '840K', genre: 'Synthwave' },
  { id: 'art-3', name: 'Julian Richter', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', followers: '2.5M', genre: 'Neoclassical' },
  { id: 'art-4', name: 'Marina Cove', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', followers: '3.1M', genre: 'Indie Pop' },
  { id: 'art-5', name: 'Grid Overlord', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', followers: '450K', genre: 'Industrial Synth' }
];

export const MOODS = [
  { id: 'chill', name: 'Chill Out', color: 'from-blue-600 to-indigo-900', icon: 'Coffee', description: 'Lay back and let the slow beats wash over you.' },
  { id: 'workout', name: 'Aggressive Grid', color: 'from-amber-500 to-red-600', icon: 'Flame', description: 'Adrenaline pumping cyberpunk overrides.' },
  { id: 'focus', name: 'Intellectual Zone', color: 'from-emerald-500 to-teal-800', icon: 'BookOpen', description: 'Pure instrumental landscapes for deep focus.' },
  { id: 'happy', name: 'Sunny Side', color: 'from-yellow-400 to-orange-600', icon: 'Sun', description: 'Upbeat acoustic guitars and sunny melodies.' },
  { id: 'sleep', name: 'Deep Nebula', color: 'from-fuchsia-600 to-purple-900', icon: 'Moon', description: 'Cosmic ambient tones to glide into sleep.' }
];
