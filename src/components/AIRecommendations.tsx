import React, { useState } from 'react';
import { Sparkles, Play, Music, Flame, Coffee, Moon, Sun, BookOpen, Layers, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { Track } from '../types';

interface AIRecommendationsProps {
  onPlayRecommendation: (mockTitle: string, mockArtist: string, backingTrackId: string) => void;
  availableTracks: Track[];
  onAddTrackToQueue: (track: Track) => void;
}

interface AIRecommendItem {
  title: string;
  artist: string;
  vibeDescription: string;
  similarTo: string;
  genre: string;
  mood: string;
  lyricsExcerpt: string;
}

export default function AIRecommendations({
  onPlayRecommendation,
  availableTracks,
  onAddTrackToQueue,
}: AIRecommendationsProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('chill');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Lo-Fi Chill']);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendItem[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const MOOD_CHOICERS = [
    { id: 'chill', name: 'Chill', icon: Coffee },
    { id: 'focus', name: 'Focus', icon: BookOpen },
    { id: 'happy', name: 'Happy', icon: Sun },
    { id: 'sleep', name: 'Sleep', icon: Moon },
  ];

  const GENRE_CHOICERS = [
    'Lo-Fi Chill',
    'Synthwave',
    'Acoustic / Indie Pop',
    'Classical / Ambient',
    'Electronic / Industrial'
  ];

  const handleToggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRecommend = async () => {
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          currentVibe: selectedVibe,
          favoriteGenres: selectedGenres,
        }),
      });

      const data = await response.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        setErrorStatus('Failed to generate results from Harmony AI.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus('Server connection failed. Playing back offline recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentLoadingMessages = [
    'Tuning quantum resonance algorithms...',
    'Consulting acoustic vector coordinates...',
    'Synchronizing harmony wave protocols...',
    'Structuring custom vocal arrays...',
    'Finalizing premium master outputs...'
  ];

  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  React.useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx(curr => (curr + 1) % currentLoadingMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-gradient-to-b from-[#111111] to-[#050505]">
      {/* Hero Banner Grid */}
      <div className="relative rounded-[32px] overflow-hidden p-8 bg-gradient-to-tr from-[#14121F] via-[#0E0C15] to-[#050505] border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.65)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_40%)]" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-white/40 font-mono text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} className="text-indigo-400 animate-spin-slow" />
              <span>Harmony Smart Copilot</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight leading-none">
              AI-Generated Music
            </h1>
            <p className="text-xs text-white/60 leading-relaxed">
              Describe your mood, task, or environment, and let Gemini curate fictional, highly creative tracks. 
              The copilot integrates directly, matching recommendations to actual studio tracks for instant playback.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Sparkles size={22} className="animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Inputs grid system */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6 bg-black/40 backdrop-blur-md rounded-[24px] p-6 border border-white/5 h-fit">
          <h2 className="text-xs font-display font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
            <Layers size={14} className="text-indigo-400" />
            <span>Curation Parameters</span>
          </h2>

          {/* Vibe Grid Selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider">Target Vibe</label>
            <div className="grid grid-cols-2 gap-2">
              {MOOD_CHOICERS.map(m => {
                const Icon = m.icon;
                const isSelected = selectedVibe === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedVibe(m.id)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `bg-white text-black border-transparent shadow-lg font-black`
                        : 'bg-[#0a0a0c] text-white/40 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Genre Checkboxes */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider">Favored Backing Profiles</label>
            <div className="flex flex-wrap gap-1.5">
              {GENRE_CHOICERS.map(g => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => handleToggleGenre(g)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-transparent'
                        : 'bg-[#0a0a0c] text-white/40 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt input */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider">Describe your scenario</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A futuristic cyber cafe at dawn, rain sputtering on metal, neon signs sizzling in C-Minor..."
                className="w-full h-24 bg-[#0a0a0c] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-all resize-none leading-relaxed"
              />
              <button
                onClick={handleRecommend}
                disabled={isLoading}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-white hover:bg-gray-200 text-black transition-all disabled:opacity-40 shadow-inner duration-200 cursor-pointer"
              >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 flex flex-col min-h-[350px]">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-black/20 rounded-[24px] border border-white/5 p-8 text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white animate-spin" />
                <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-white/20 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Sparkles size={16} className="text-white animate-pulse" />
                </div>
              </div>
              <p className="text-xs font-semibold text-white animate-pulse">Generative AI Active</p>
              <p className="text-[10px] text-white/40 font-mono italic">
                {currentLoadingMessages[loadingMsgIdx]}
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-black/20 rounded-[24px] border border-white/5 p-8 text-center space-y-3">
              <div className="p-3 bg-white/5 rounded-full text-white/60 border border-white/10">
                <Music size={24} />
              </div>
              <h3 className="text-xs font-semibold text-white/80">Ready for Curation</h3>
              <p className="text-[10px] text-white/40 max-w-sm mx-auto leading-relaxed">
                Click generating above. The AI will provide fictional track specifications matching your guidelines and link them to high-speed playable streams.
              </p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="text-indigo-400" />
                  AI Suggested Concepts ({recommendations.length})
                </span>
                <span className="text-[10px] bg-white/10 text-white font-bold px-2 py-0.5 rounded-full border border-white/10 uppercase font-mono">
                  Connected &amp; Playable
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {recommendations.map((item, index) => {
                  // Find backing track name and info
                  const backInfo = availableTracks.find(t => t.id === item.similarTo);
                  return (
                    <div
                      key={index}
                      className="group relative overflow-hidden bg-white/[0.01] p-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 flex gap-4"
                    >
                      {/* Left icon design */}
                      <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white relative">
                        <Music size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="absolute -bottom-1.5 -right-1.5 text-[9px] bg-white text-black font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                          {index + 1}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[9px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full font-mono">
                            {item.genre}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 font-semibold">{item.artist}</p>
                        <p className="text-[10px] text-white/30 leading-relaxed italic pr-2">
                          "{item.vibeDescription}"
                        </p>

                        <div className="flex items-center gap-2 pt-2 text-[9px] text-white/40 justify-between">
                          <p className="truncate">
                            Backing sound: <strong className="text-white/60 font-medium">{backInfo ? backInfo.title : 'Midnight session'}</strong>
                          </p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                if (backInfo) {
                                  onPlayRecommendation(item.title, item.artist, item.similarTo);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-200 text-black font-extrabold transition-all flex items-center gap-1 active:scale-95 duration-200 cursor-pointer text-[9px]"
                            >
                              <Play size={8} fill="black" /> Play AI Vibe
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errorStatus && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{errorStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
