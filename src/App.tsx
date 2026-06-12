import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Clock, 
  Heart, 
  Plus, 
  ListMusic, 
  Sparkles, 
  Compass, 
  Search, 
  Mic, 
  FolderPlus, 
  Smile, 
  Music,
  Maximize2,
  Minimize2,
  Grid,
  ChevronRight,
  TrendingUp,
  Radio,
  Sliders,
  ChevronUp,
  X,
  Volume1,
  BookOpen
} from 'lucide-react';

import { Track, Playlist, ActiveView, VisualizerMode, User } from './types';
import { INITIAL_TRACKS, STATIC_PLAYLISTS, POPULAR_ARTISTS, MOODS } from './data/songs';

// Import subcomponents
import Sidebar from './components/Sidebar';
import Visualizer from './components/Visualizer';
import VoiceSearch from './components/VoiceSearch';
import AIRecommendations from './components/AIRecommendations';
import Stats from './components/Stats';
import AuthModal from './components/AuthModal';

export default function App() {
  // --- STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(INITIAL_TRACKS[0]);
  const [queue, setQueue] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  // Persistence stats
  const [volume, setVolume] = useState(0.85);
  const [prevVolume, setPrevVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(372);
  const [listeningTime, setListeningTime] = useState(0);

  // Social stats
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Premium toggles
  const [activeVisualizerMode, setActiveVisualizerMode] = useState<VisualizerMode>('bars');
  const [audioQuality, setAudioQuality] = useState<'standard' | 'hifi' | 'saver'>('standard');
  const [isLightMode, setIsLightMode] = useState(false);
  
  // Side panels states
  const [showLyricsPanel, setShowLyricsPanel] = useState(false);
  const [showQueuePanel, setShowQueuePanel] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  // Modal Triggers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceSearchQuery, setVoiceSearchQuery] = useState('');
  const [showPlaylistCreateModal, setShowPlaylistCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Audio elements references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Search filter
  const [userSearchText, setUserSearchText] = useState('');

  // New AI badge overlay state
  const [aiConceptTag, setAiConceptTag] = useState<{ mockTitle: string; mockArtist: string } | null>(null);

  // Sleep Timer States
  const [sleepTimerTime, setSleepTimerTime] = useState<number | null>(null); // in minutes
  const [showSleepDropdown, setShowSleepDropdown] = useState(false);

  // --- LOCAL PERSISTENCE LOADS ---
  useEffect(() => {
    // 1. Theme Check
    const savedTheme = localStorage.getItem('harmony_light_theme');
    if (savedTheme === 'true') setIsLightMode(true);

    // 2. Auth Check
    const savedUser = localStorage.getItem('harmony_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserProfile({
          username: parsed.username,
          email: parsed.email,
          avatarUrl: parsed.avatarUrl,
          favorites: [],
          playlists: [],
          recentlyPlayed: [],
          listeningTime: 0
        });
      } catch (e) {
        console.warn('Stale auth cache removed');
      }
    }

    // 3. Playlists Check
    const savedPlaylists = localStorage.getItem('harmony_custom_playlists');
    if (savedPlaylists) {
      try {
        setCustomPlaylists(JSON.parse(savedPlaylists));
      } catch (e) {
        console.warn('Playlist parsing error');
      }
    }

    // 4. Favorites List
    const savedSaves = localStorage.getItem('harmony_saved_ids');
    if (savedSaves) {
      try {
        setLikedSongs(JSON.parse(savedSaves));
      } catch (e) {
        // failed parse
      }
    }

    // 5. Volume Cache
    const savedVol = localStorage.getItem('harmony_volume');
    if (savedVol) {
      const parsedVol = parseFloat(savedVol);
      if (!isNaN(parsedVol)) {
        setVolume(parsedVol);
      }
    }

    // 6. Recently Played Cache
    const savedRecents = localStorage.getItem('harmony_recents');
    if (savedRecents) {
      try {
        setRecentlyPlayed(JSON.parse(savedRecents));
      } catch (e) {
        console.warn('Recents cache fail');
      }
    }
  }, []);

  // Sync favorites
  const toggleLikeTrack = (id: string) => {
    let updated;
    if (likedSongs.includes(id)) {
      updated = likedSongs.filter(item => item !== id);
    } else {
      updated = [...likedSongs, id];
    }
    setLikedSongs(updated);
    localStorage.setItem('harmony_saved_ids', JSON.stringify(updated));
  };

  // Sync listening session timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setListeningTime(curr => {
        const up = curr + 1;
        if (up % 15 === 0) {
          // Increment cached profiles incrementally
        }
        return up;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sleep Timer Tick logic
  useEffect(() => {
    if (sleepTimerTime === null || sleepTimerTime <= 0) return;
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSleepTimerTime(curr => {
        if (curr === null) return null;
        if (curr <= 1) {
          // Shutdown playback smoothly
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
          return null;
        }
        return curr - 1;
      });
    }, 60000); // Trigger every minute

    return () => clearInterval(interval);
  }, [sleepTimerTime, isPlaying]);

  // --- AUDIO SYNCHRONIZATION EVENT LOOPS ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Apply cached volumes safely
    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(err => {
        console.log('Audio playback delayed until user context interaction:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle song ending auto skips
  const handleAudioEnded = () => {
    handleNextSong();
  };

  const handleNextSong = () => {
    if (queue.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % queue.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setAiConceptTag(null); // Reset AI badge overlay
    setIsPlaying(true);
    triggerTrackLogged(queue[nextIdx].id);
  };

  const handlePrevSong = () => {
    if (queue.length === 0) return;
    const prevIdx = currentTrackIndex === 0 ? queue.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setAiConceptTag(null); // Reset AI badge overlay
    setIsPlaying(true);
    triggerTrackLogged(queue[prevIdx].id);
  };

  const triggerTrackLogged = (id: string) => {
    // Add to local recently played list
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(x => x !== id);
      const updated = [id, ...filtered].slice(0, 15);
      localStorage.setItem('harmony_recents', JSON.stringify(updated));
      return updated;
    });
  };

  // --- PLAYBACK TRIGGER COMMAND HANDLERS ---
  const handlePlayIndividualTrack = (track: Track, customListContext?: Track[]) => {
    setAiConceptTag(null); // Reset overlay
    if (customListContext && customListContext.length > 0) {
      setQueue(customListContext);
      const idx = customListContext.findIndex(x => x.id === track.id);
      setCurrentTrackIndex(idx !== -1 ? idx : 0);
    } else {
      // Find within default queue
      const idx = queue.findIndex(x => x.id === track.id);
      if (idx !== -1) {
        setCurrentTrackIndex(idx);
      } else {
        const updatedQueue = [...queue, track];
        setQueue(updatedQueue);
        setCurrentTrackIndex(updatedQueue.length - 1);
      }
    }
    setCurrentTrack(track);
    setIsPlaying(true);
    triggerTrackLogged(track.id);
  };

  const handlePlayAIRecommendation = (mockTitle: string, mockArtist: string, backingTrackId: string) => {
    const track = INITIAL_TRACKS.find(t => t.id === backingTrackId);
    if (track) {
      // Load track with AI conceptual titles overlays
      setAiConceptTag({ mockTitle, mockArtist });
      handlePlayIndividualTrack(track);
    }
  };

  // Voice Command Execution Core
  const handleVoiceCommand = (cmd: string, param?: string) => {
    switch (cmd) {
      case 'play':
        if (param) {
          const match = INITIAL_TRACKS.find(t => 
            t.title.toLowerCase().includes(param.toLowerCase()) || 
            t.artist.toLowerCase().includes(param.toLowerCase())
          );
          if (match) {
            handlePlayIndividualTrack(match);
          } else {
            console.warn('Voice target track not found:', param);
          }
        }
        break;
      case 'pause':
        setIsPlaying(false);
        break;
      case 'play-toggle':
        setIsPlaying(true);
        break;
      case 'next':
        handleNextSong();
        break;
      case 'previous':
        handlePrevSong();
        break;
      case 'volume-up':
        setVolume(prev => Math.min(1.0, prev + 0.15));
        break;
      case 'volume-down':
        setVolume(prev => Math.max(0.0, prev - 0.15));
        break;
      case 'go-ai':
        setActiveView('gemini-ai');
        break;
      case 'go-home':
        setActiveView('home');
        break;
      default:
        break;
    }
  };

  // Custom Playlist Creator
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: Playlist = {
      id: `playlist-custom-${Date.now()}`,
      name: newPlaylistName,
      description: newPlaylistDesc || 'A customized collection on Harmony.',
      coverUrl: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=400&q=80',
      trackIds: [],
      created_at: new Date().toISOString(),
      isCustom: true
    };

    const updated = [...customPlaylists, newPlaylist];
    setCustomPlaylists(updated);
    localStorage.setItem('harmony_custom_playlists', JSON.stringify(updated));
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setShowPlaylistCreateModal(false);
  };

  const handleAddTrackToCustomPlaylist = (playlistId: string, trackId: string) => {
    const updated = customPlaylists.map(pl => {
      if (pl.id === playlistId) {
        if (pl.trackIds.includes(trackId)) return pl; // prevent duplicates
        return { ...pl, trackIds: [...pl.trackIds, trackId] };
      }
      return pl;
    });
    setCustomPlaylists(updated);
    localStorage.setItem('harmony_custom_playlists', JSON.stringify(updated));
  };

  // Safe volume toggle mute
  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.85);
    }
  };

  // --- RENDER SYNCHRONIZED LYRICS SCROLLS ---
  const getCurrentLyricIndex = () => {
    if (!currentTrack || !currentTrack.lyrics) return -1;
    let idx = -1;
    for (let i = 0; i < currentTrack.lyrics.length; i++) {
      if (currentTime >= currentTrack.lyrics[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  };

  const currentLyricIdx = getCurrentLyricIndex();

  useEffect(() => {
    if (showLyricsPanel && lyricsContainerRef.current) {
      const activeLineEl = lyricsContainerRef.current.querySelector('.lyric-line-active');
      if (activeLineEl) {
        activeLineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLyricIdx, showLyricsPanel]);

  // Queue adder
  const addTrackToQueueEnd = (track: Track) => {
    if (queue.some(t => t.id === track.id)) return;
    setQueue([...queue, track]);
  };

  // --- RENDER CONDITIONAL SUB-VIEWS ---
  const renderCurrentView = () => {
    // 1. HOME VIEW
    if (activeView === 'home') {
      const featuredSong = INITIAL_TRACKS.find(t => t.isFeatured) || INITIAL_TRACKS[0];
      return (
        <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-gradient-to-b from-[#111111] to-[#050505]">
          {/* Header row */}
          <div className="flex justify-between items-center py-2 border-b border-white/5 pb-4">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-white/40">Welcome to Harmony Core</p>
              <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">Home Stage</h2>
            </div>
            
            {/* Quick action tools */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsVoiceOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white hover:text-black border border-white/10 hover:border-transparent cursor-pointer transition-all active:scale-95 duration-200 shadow-md"
              >
                <Mic size={13} className="text-indigo-400 group-hover:text-black" />
                <span>Voice Search</span>
              </button>
            </div>
          </div>

          {/* Premium Glassmorphic Hero Billboard */}
          <div className="relative rounded-[32px] overflow-hidden p-8 bg-gradient-to-tr from-[#14121F] via-[#0E0C15] to-[#050505] border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.65)]">
            {/* Floating blurred ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl text-center md:text-left">
                <span className="text-[9px] bg-white/10 text-white/90 font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 shadow-sm">
                  Recommended For You
                </span>
                <h1 className="text-4xl font-display font-extrabold text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/95">
                  {featuredSong.title}
                </h1>
                <p className="text-xs text-indigo-300 font-medium font-mono">By {featuredSong.artist} • {featuredSong.album}</p>
                <p className="text-xs text-white/60 leading-relaxed pr-2">
                  Take a journey inside our most popular ambient lofi record, featuring high-fidelity rain effects, retro rhodes piano chord keys, and live brass.
                </p>
                
                <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => handlePlayIndividualTrack(featuredSong, INITIAL_TRACKS)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black bg-white hover:bg-gray-200 text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all active:scale-95 cursor-pointer duration-200"
                  >
                    <Play size={14} fill="black" />
                    <span>Listen Now</span>
                  </button>
                  <button
                    onClick={() => toggleLikeTrack(featuredSong.id)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    <Heart size={14} fill={likedSongs.includes(featuredSong.id) ? '#ffffff' : 'none'} className={likedSongs.includes(featuredSong.id) ? 'text-white' : ''} />
                  </button>
                </div>
              </div>

              {/* Album art display */}
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer" onClick={() => handlePlayIndividualTrack(featuredSong, INITIAL_TRACKS)}>
                <img src={featuredSong.coverUrl} alt="Album Art" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="p-3.5 bg-black/80 rounded-full text-white border border-white/20 backdrop-blur-sm">
                    <Play size={20} fill="#ffffff" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Grid sections */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left sidebar: Popular Artists */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-sm font-display font-black text-white/40 uppercase tracking-wider flex items-center gap-2">
                <Radio size={14} className="text-indigo-400" />
                <span>Featured Artists</span>
              </h3>
              <div className="space-y-3 bg-black/40 p-4 rounded-[24px] border border-white/5">
                {POPULAR_ARTISTS.slice(0, 4).map(artist => (
                  <div key={artist.id} className="flex items-center justify-between group cursor-pointer" onClick={() => {
                    setUserSearchText(artist.name);
                    setActiveView('search');
                  }}>
                    <div className="flex items-center gap-3">
                      <img src={artist.image} alt={artist.name} className="w-10 h-10 rounded-full object-cover border border-white/5" />
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{artist.name}</h4>
                        <p className="text-[10px] text-white/40 font-mono">{artist.followers} followers</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded-full font-mono text-white/50 uppercase tracking-widest">{artist.genre}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Trending Tracks Carousel */}
            <div className="md:col-span-8 space-y-4">
              <h3 className="text-sm font-display font-black text-white/40 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14} className="text-indigo-400" />
                <span>Trending Sounds</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIAL_TRACKS.slice(0, 6).map(track => (
                  <div 
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => handlePlayIndividualTrack(track, INITIAL_TRACKS)}>
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <Play size={12} className="text-white" fill="white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 cursor-pointer" onClick={() => handlePlayIndividualTrack(track, INITIAL_TRACKS)}>{track.title}</h4>
                        <p className="text-[10px] text-white/40 truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-white/40 font-mono mr-2">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                      <button 
                        onClick={() => toggleLikeTrack(track.id)}
                        className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white"
                      >
                        <Heart size={12} fill={likedSongs.includes(track.id) ? '#ffffff' : 'none'} className={likedSongs.includes(track.id) ? 'text-white' : ''} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Moody selections or curated static playlists */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-black text-white/40 uppercase tracking-wider">Mood Playlists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {STATIC_PLAYLISTS.map(pl => (
                <div 
                  key={pl.id}
                  onClick={() => {
                    setSelectedPlaylistId(pl.id);
                    setActiveView('playlist-detail');
                  }}
                  className="rounded-[24px] overflow-hidden bg-gradient-to-b from-white/[0.04] to-black p-4 border border-white/5 hover:border-white/20 cursor-pointer group transition-all duration-300"
                >
                  <div className="w-full h-36 rounded-xl overflow-hidden relative mb-3">
                    <img src={pl.coverUrl} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-3 right-3 p-3 bg-white hover:bg-gray-200 rounded-full text-black opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg duration-300">
                      <Play size={16} fill="black" />
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{pl.name}</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed mt-1 line-clamp-2">{pl.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 2. UNIVERSAL SEARCH VIEW
    else if (activeView === 'search') {
      const filteredTracks = INITIAL_TRACKS.filter(t => 
        t.title.toLowerCase().includes(userSearchText.toLowerCase()) ||
        t.artist.toLowerCase().includes(userSearchText.toLowerCase()) ||
        t.genre.toLowerCase().includes(userSearchText.toLowerCase()) ||
        t.album.toLowerCase().includes(userSearchText.toLowerCase())
      );

      return (
        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gradient-to-b from-[#111111] to-[#050505]">
          <div>
            <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-white/40">Find any acoustic track</p>
            <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">Universal Search</h2>
          </div>

          {/* Search bar input with custom mic */}
          <div className="relative max-w-xl">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/40 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={userSearchText}
              onChange={(e) => setUserSearchText(e.target.value)}
              placeholder="Search songs, artists, albums, or genres..."
              className="w-full pl-11 pr-24 py-3 bg-[#0a0a0c] border border-white/10 rounded-2xl text-xs placeholder-white/30 focus:outline-none focus:border-white/30 transition-all text-white shadow-inner"
            />
            
            {/* Mic trigger button */}
            <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
              {userSearchText && (
                <button 
                  onClick={() => setUserSearchText('')}
                  className="px-2 py-1 text-[10px] text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsVoiceOpen(true)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 cursor-pointer"
                title="Voice Search Activation"
              >
                <Mic size={14} />
              </button>
            </div>
          </div>

          {userSearchText && (
            <p className="text-[11px] text-white/40 font-mono">Found {filteredTracks.length} items for "{userSearchText}"</p>
          )}

          {/* Results tracks list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Matched Records</h3>
            {filteredTracks.length === 0 ? (
              <div className="py-12 bg-white/[0.02] rounded-2xl text-center text-xs text-white/40 italic max-w-xl border border-white/5">
                No items match your search. Try "Lofi", "Synthwave", or use Voice command.
              </div>
            ) : (
              <div className="space-y-2 max-w-3xl">
                {filteredTracks.map(track => (
                  <div 
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.05] border border-white/5 transition-all group animate-fade-in"
                  >
                    <div className="flex items-center gap-4.5 min-w-0">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => handlePlayIndividualTrack(track, filteredTracks)}>
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                          <Play size={12} fill="white" className="text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 cursor-pointer" onClick={() => handlePlayIndividualTrack(track, filteredTracks)}>{track.title}</h4>
                        <p className="text-[10px] text-white/40 mt-0.5">{track.artist} • {track.album}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-white/40 font-mono hidden sm:inline">{track.genre}</span>
                      
                      {/* Context menu for custom playlist injection */}
                      {customPlaylists.length > 0 && (
                        <div className="relative group/menu">
                          <button 
                            className="p-1 px-2 text-[9px] bg-white/5 hover:bg-white hover:text-black border border-white/10 hover:border-transparent font-medium rounded-md text-white/60 transition-all cursor-pointer"
                          >
                            + Add to...
                          </button>
                          <div className="absolute right-0 top-6 hidden group-hover/menu:block bg-[#0e0e11] border border-white/10 p-1.5 rounded-lg shadow-2xl z-30 min-w-[124px] text-left">
                            {customPlaylists.map(pl => (
                              <button
                                key={pl.id}
                                onClick={() => handleAddTrackToCustomPlaylist(pl.id, track.id)}
                                className="w-full text-left truncate px-2 py-1 text-[9px] text-white/50 hover:text-white hover:bg-white/5 rounded"
                              >
                                {pl.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => toggleLikeTrack(track.id)}
                        className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white"
                      >
                        <Heart size={13} fill={likedSongs.includes(track.id) ? '#ffffff' : 'none'} className={likedSongs.includes(track.id) ? 'text-white' : ''} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 3. LIBRARY VIEW
    else if (activeView === 'library') {
      const savedTracks = INITIAL_TRACKS.filter(t => likedSongs.includes(t.id));
      const recentTracks = INITIAL_TRACKS.filter(t => recentlyPlayed.includes(t.id));

      return (
        <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-gradient-to-b from-[#111111] to-[#050505]">
          <div className="flex justify-between items-center py-2 border-b border-white/5 pb-4">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-white/40">Your personalized collections</p>
              <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">Your Library</h2>
            </div>
            
            <button
              onClick={() => setShowPlaylistCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 font-bold text-xs bg-white hover:bg-gray-200 text-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer duration-200"
            >
              <FolderPlus size={14} />
              <span>Create Playlist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Custom Playlist items listings */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Custom Playlists</h3>
                {customPlaylists.length === 0 ? (
                  <div className="p-8 bg-black/40 rounded-2xl border border-white/5 text-center text-xs text-white/40 italic">
                    You haven't built any playlists yet. Tap "Create Playlist" above to start!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {customPlaylists.map(pl => (
                      <div 
                        key={pl.id}
                        onClick={() => {
                          setSelectedPlaylistId(pl.id);
                          setActiveView('playlist-detail');
                        }}
                        className="flex items-center gap-4 p-3 bg-white/[0.01] hover:bg-white/[0.05] rounded-2xl border border-white/5 cursor-pointer group transition-all duration-200"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                          <ListMusic size={22} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{pl.name}</h4>
                          <p className="text-[10px] text-white/40 font-mono mt-0.5">{pl.trackIds.length} tracks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Favored likes */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Heart size={12} className="text-white" fill="#ffffff" />
                  <span>Liked Tracks ({savedTracks.length})</span>
                </h3>

                {savedTracks.length === 0 ? (
                  <div className="p-8 bg-black/40 rounded-2xl border border-white/5 text-center text-xs text-white/40 italic">
                    No songs saved yet. Favorite tracks elsewhere to pile them here!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedTracks.map(track => (
                      <div 
                        key={track.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.05] border border-white/5 transition-all group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img src={track.coverUrl} alt={track.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 cursor-pointer" onClick={() => handlePlayIndividualTrack(track, savedTracks)}>{track.title}</h4>
                            <p className="text-[10px] text-white/40">{track.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handlePlayIndividualTrack(track, savedTracks)}
                            className="p-1 px-4 bg-white text-black text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-200 active:scale-95 duration-200 cursor-pointer"
                          >
                            Play
                          </button>
                          <button 
                            onClick={() => toggleLikeTrack(track.id)}
                            className="p-1.5 text-white/40 hover:text-white rounded-full hover:bg-white/5"
                          >
                            <Heart size={12} fill="#ffffff" className="text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar: Recents history */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Recently Stopped</h3>
              <div className="bg-black/40 p-4 rounded-[24px] border border-white/5 space-y-3.5">
                {recentTracks.length === 0 ? (
                  <p className="text-xs text-white/40 italic py-4 text-center">Empty recents diary</p>
                ) : (
                  recentTracks.slice(0, 6).map(track => (
                    <div 
                      key={track.id}
                      onClick={() => handlePlayIndividualTrack(track)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img src={track.coverUrl} alt={track.title} className="w-8 h-8 rounded-lg object-cover border border-white/5" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{track.title}</h4>
                        <p className="text-[9px] text-white/40">{track.artist}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 4. PLAYLIST DETAIL ACTIVE GRID
    else if (activeView === 'playlist-detail' && selectedPlaylistId) {
      // Find within static or custom collections
      const targetStatic = STATIC_PLAYLISTS.find(p => p.id === selectedPlaylistId);
      const targetCustom = customPlaylists.find(p => p.id === selectedPlaylistId);
      const playlist = targetStatic || targetCustom;

      if (!playlist) return <div className="text-center p-8">Playlist not found</div>;

      const playlistTracks = INITIAL_TRACKS.filter(t => playlist.trackIds.includes(t.id));

      return (
        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gradient-to-b from-[#111111] to-[#050505]">
          {/* Back link */}
          <button 
            onClick={() => {
              if (playlist.isCustom) setActiveView('library');
              else setActiveView('home');
            }}
            className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"
          >
            ← Back to collections
          </button>

          {/* Header Billboard */}
          <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/5 pb-8">
            <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {playlist.isCustom ? (
                <ListMusic size={54} className="text-white/60 animate-pulse" />
              ) : (
                <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="space-y-2.5 text-center md:text-left">
              <span className="text-[9px] bg-white/10 text-white border border-white/10 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest font-semibold">
                Playlist Stage
              </span>
              <h1 className="text-3xl font-display font-black text-white leading-none">{playlist.name}</h1>
              <p className="text-xs text-white/50 leading-relaxed max-w-xl">{playlist.description}</p>
              <p className="text-[10px] text-white/40 font-mono">Curated on Harmony • {playlistTracks.length} playable songs</p>

              {playlistTracks.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => handlePlayIndividualTrack(playlistTracks[0], playlistTracks)}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-white hover:bg-gray-200 text-black shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer duration-200"
                  >
                    <Play size={12} fill="black" />
                    <span>Launch Playlist</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tracks lists */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Song List</h3>
            {playlistTracks.length === 0 ? (
              <div className="py-12 bg-white/[0.02] rounded-2xl border border-white/5 text-center text-xs text-white/40 italic">
                This playlist layout is empty. Connect tracks from Universal Search!
              </div>
            ) : (
              <div className="space-y-2.5 max-w-3xl">
                {playlistTracks.map((track, idx) => (
                  <div 
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.05] border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-4.5 min-w-0">
                      <span className="font-mono text-xs text-white/30 w-4 pl-1">{idx + 1}</span>
                      <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 cursor-pointer" onClick={() => handlePlayIndividualTrack(track, playlistTracks)}>{track.title}</h4>
                        <p className="text-[10px] text-white/40 mt-0.5">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/40 font-mono">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                      <button 
                        onClick={() => toggleLikeTrack(track.id)}
                        className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white"
                      >
                        <Heart size={13} fill={likedSongs.includes(track.id) ? '#ffffff' : 'none'} className={likedSongs.includes(track.id) ? 'text-white' : ''} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 5. GEMINI AI RECOMMENDATIONS VIEW
    else if (activeView === 'gemini-ai') {
      return (
        <AIRecommendations
          onPlayRecommendation={handlePlayAIRecommendation}
          availableTracks={INITIAL_TRACKS}
          onAddTrackToQueue={addTrackToQueueEnd}
        />
      );
    }

    // 6. ANALYTICS STATS VIEW
    else if (activeView === 'profile-stats') {
      return (
        <Stats
          listeningTime={listeningTime}
          recentHistory={recentlyPlayed}
          tracks={INITIAL_TRACKS}
          likedSongs={likedSongs}
        />
      );
    }

    return null;
  };

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden bg-black select-none ${isLightMode ? 'light' : 'dark'}`}>
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 z-0 bg-[#070709] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-10 bg-center bg-[#070709]" style={{ backgroundImage: `url(${currentTrack.coverUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/90 to-[#09090b] backdrop-blur-3xl" />
      </div>

      <div className="flex-1 flex overflow-hidden z-10 relative">
        {/* Sidebar Nav */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
          user={userProfile}
          onLogout={() => {
            localStorage.removeItem('harmony_user');
            setUserProfile(null);
          }}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenCreatePlaylist={() => setShowPlaylistCreateModal(true)}
          customPlaylists={customPlaylists}
          onSelectPlaylist={(id) => {
            setSelectedPlaylistId(id);
            setActiveView('playlist-detail');
          }}
        />

        {/* Primary Screen Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-black/30 relative">
          {renderCurrentView()}
        </main>

        {/* Dynamic Side Drawers: Lyrics View */}
        {showLyricsPanel && (
          <aside className="w-80 flex-shrink-0 border-l border-white/5 bg-[#09090b]/90 backdrop-blur-3xl p-6 flex flex-col z-20 h-full">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} />
                <span>Live Synced Lyrics</span>
              </h3>
              <button 
                onClick={() => setShowLyricsPanel(false)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrolling panel wrapper */}
            <div 
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto py-8 space-y-6 scrollbar-none max-h-[550px] pr-2"
            >
              {currentTrack.lyrics && currentTrack.lyrics.map((line, idx) => {
                const isActive = idx === currentLyricIdx;
                return (
                  <p
                    key={idx}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = line.time;
                        setCurrentTime(line.time);
                      }
                    }}
                    className={`lyric-line text-sm leading-relaxed font-semibold cursor-pointer text-left pl-1.5 border-l-2 py-1 ${
                      isActive 
                        ? 'lyric-line-active border-white text-white font-extrabold text-md glow-sm translate-x-1 duration-300' 
                        : 'border-transparent text-white/35 hover:text-white/80'
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          </aside>
        )}

        {/* Dynamic Queue Manager Drawer */}
        {showQueuePanel && (
          <aside className="w-80 flex-shrink-0 border-l border-white/5 bg-[#09090b]/90 backdrop-blur-3xl p-6 flex flex-col z-20 h-full">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <ListMusic size={14} />
                <span>Up next (Queue)</span>
              </h3>
              <button 
                onClick={() => setShowQueuePanel(false)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pt-4">
              {queue.map((track, idx) => {
                const isPlayingRow = idx === currentTrackIndex;
                return (
                  <div 
                    key={`${track.id}-${idx}`}
                    className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 ${
                      isPlayingRow ? 'bg-white/5 border border-white/10' : 'bg-white/[0.01] border border-transparent hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0" onClick={() => {
                      setCurrentTrackIndex(idx);
                      setCurrentTrack(track);
                      setIsPlaying(true);
                    }}>
                      <img src={track.coverUrl} alt={track.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${isPlayingRow ? 'text-indigo-300' : 'text-white'}`}>{track.title}</h4>
                        <p className="text-[10px] text-white/40 truncate">{track.artist}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = queue.filter((_, i) => i !== idx);
                        setQueue(updated);
                        if (idx === currentTrackIndex && updated.length > 0) {
                          setCurrentTrackIndex(0);
                          setCurrentTrack(updated[0]);
                        }
                      }}
                      className="text-white/40 hover:text-red-400 p-1 cursor-pointer"
                      title="Remove from queue"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Persistent Bottom Floating Player Control Room */}
      <footer className="h-24 bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-6 z-30 relative select-none">
        
        {/* Left Side: Art details with optional AI Concept Badge */}
        <div className="flex items-center gap-4.5 w-1/4 min-w-[200px]">
          <div 
            onClick={() => setShowFullPlayer(!showFullPlayer)}
            className="w-14 h-14 rounded-xl overflow-hidden shadow-xl border border-white/15 relative group cursor-pointer"
          >
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPlaying ? 'animate-spin-slow' : ''}`} 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <ChevronUp size={16} className="text-white" />
            </div>
          </div>

          <div className="min-w-0 leading-tight">
            <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => setShowFullPlayer(true)}>
              {aiConceptTag ? aiConceptTag.mockTitle : currentTrack.title}
            </h4>
            <p className="text-[10px] text-white/40 truncate mt-0.5">
              {aiConceptTag ? aiConceptTag.mockArtist : currentTrack.artist}
            </p>

            {/* AI badge notification tag */}
            {aiConceptTag && (
              <span className="inline-block mt-1 text-[8px] bg-white/10 text-white font-bold px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest font-mono">
                AI CONCEPT
              </span>
            )}
          </div>

          <button 
            onClick={() => toggleLikeTrack(currentTrack.id)}
            className="p-1.5 text-white/40 hover:text-white transition-colors ml-1 hidden sm:inline-block cursor-pointer"
            title="Like this track"
          >
            <Heart size={14} fill={likedSongs.includes(currentTrack.id) ? '#ffffff' : 'none'} className={likedSongs.includes(currentTrack.id) ? 'text-white' : ''} />
          </button>
        </div>

        {/* Center: Playback triggers and progress bar */}
        <div className="flex flex-col items-center gap-2.5 w-2/5">
          <div className="flex items-center gap-5">
            <button 
              onClick={handlePrevSong}
              className="text-white/40 hover:text-white transition-colors p-1 cursor-pointer"
              title="Previous Track"
            >
              <SkipBack size={18} />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center transition-transform active:scale-95 hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
            </button>

            <button 
              onClick={handleNextSong}
              className="text-white/40 hover:text-white transition-colors p-1 cursor-pointer"
              title="Next Track"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Progress Slider Bar */}
          <div className="w-full flex items-center gap-2.5">
            <span className="text-[9px] font-mono text-white/40">
              {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
            </span>
            
            <div className="flex-1 relative group py-2 cursor-pointer">
              <input
                type="range"
                min="0"
                max={duration.toString()}
                value={currentTime.toString()}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (audioRef.current) audioRef.current.currentTime = val;
                }}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white group-hover:bg-white/20 transition-all focus:outline-none"
              />
            </div>
            
            <span className="text-[9px] font-mono text-white/40">
              {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Right Side: Visual mode triggers, sleep timers, volumes */}
        <div className="flex items-center gap-4.5 w-1/4 min-w-[210px] justify-end">
          {/* Visualizer mode selections button */}
          <div className="relative group">
            <button 
              className="p-1.5 text-white/60 hover:text-white transition-colors text-xs font-mono font-bold flex items-center gap-1.5 border border-white/5 rounded-lg hover:border-white/10 cursor-pointer"
              title="Change Canvas Visualizer Styles"
            >
              <Sliders size={13} className="text-indigo-400" />
              <span className="uppercase">{activeVisualizerMode}</span>
            </button>
            <div className="absolute right-0 bottom-8 hidden group-hover:block bg-[#0a0a0c] border border-white/10 p-1 rounded-xl shadow-2xl z-40 min-w-[124px] text-[10px]">
              {['bars', 'circle', 'wave', 'particles'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setActiveVisualizerMode(mode as any)}
                  className="w-full text-left capitalize px-2.5 py-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
                >
                  {mode} View
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Timer triggers */}
          <div className="relative">
            <button 
              onClick={() => setShowSleepDropdown(!showSleepDropdown)}
              className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-mono font-medium cursor-pointer ${
                sleepTimerTime ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'border-white/5 text-white/40 hover:text-white'
              }`}
            >
              <Clock size={13} />
              <span>{sleepTimerTime ? `${sleepTimerTime}m` : 'Timer'}</span>
            </button>

            {showSleepDropdown && (
              <div className="absolute right-0 bottom-8 bg-[#0a0a0c] border border-white/10 p-1.5 rounded-xl shadow-2xl z-40 min-w-[130px] space-y-0.5 text-[9px] text-white/40">
                <p className="px-2.5 py-1 border-b border-white/5 font-semibold text-[8px] text-white/20 uppercase">Sleep Timer</p>
                {[5, 15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSleepTimerTime(mins);
                      setShowSleepDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    Shut down in {mins}m
                  </button>
                ))}
                {sleepTimerTime && (
                  <button
                    onClick={() => {
                      setSleepTimerTime(null);
                      setShowSleepDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                  >
                    Cancel Timer
                  </button>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowLyricsPanel(!showLyricsPanel)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${showLyricsPanel ? 'text-indigo-400 bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/2'}`}
            title="Lyrics view"
          >
            Lyrics
          </button>

          <button 
            onClick={() => setShowQueuePanel(!showQueuePanel)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${showQueuePanel ? 'text-indigo-400 bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/2'}`}
            title="Queue tracker"
          >
            Queue
          </button>

          {/* Volume bars sliders */}
          <div className="flex items-center gap-1.5 group/vol">
            <button 
              onClick={toggleMute}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              {volume === 0 ? <VolumeX size={15} /> : volume < 0.4 ? <Volume1 size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/10 rounded appearance-none cursor-pointer group-hover/vol:bg-white/20 transition-all focus:outline-none accent-white"
            />
          </div>
        </div>
      </footer>

      {/* Full-Screen Visualizer Stage Modal Overlay */}
      {showFullPlayer && (
        <div className="fixed inset-0 bg-[#070709] z-40 flex flex-col p-8 md:p-12 animate-fade-in transition-all">
          {/* Header Controls */}
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">Acoustic Cinema Mode</span>
            </div>
            
            <button 
              onClick={() => setShowFullPlayer(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 cursor-pointer transition-all active:scale-95 duration-200"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Large dynamic grids */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 z-10 min-h-0">
            {/* Visualizer Canvas box (Left 8 cols) */}
            <div className="lg:col-span-8 h-full min-h-[300px] rounded-3xl overflow-hidden shadow-2xl relative border border-white/5">
              <Visualizer
                audioRef={audioRef}
                isPlaying={isPlaying}
                mode={activeVisualizerMode}
                accentColor="indigo"
              />
            </div>

            {/* Scrolling synchronized lyrics (Right 4 cols) */}
            <div className="lg:col-span-4 h-full flex flex-col justify-between bg-black/40 backdrop-blur-md rounded-[28px] p-6 border border-white/5 min-h-0">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-display font-black text-white/40 uppercase tracking-widest">Active Lyrics</h3>
                <h2 className="text-lg font-display font-bold text-white tracking-tight mt-1 truncate">{currentTrack.title}</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-none max-h-[320px] my-4 text-center pr-1">
                {currentTrack.lyrics.map((line, idx) => {
                  const isActive = idx === currentLyricIdx;
                  return (
                    <p
                      key={idx}
                      className={`text-sm md:text-md leading-relaxed font-semibold transition-all duration-300 ${
                        isActive ? 'text-white font-extrabold scale-[1.03] text-indigo-300' : 'text-white/30 hover:text-white/60 cursor-pointer'
                      }`}
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = line.time;
                          setCurrentTime(line.time);
                        }
                      }}
                    >
                      {line.text}
                    </p>
                  );
                })}
              </div>

              <div className="text-center font-mono text-[9px] text-white/40 border-t border-white/5 pt-3">
                Tap visualizer options in bottom bar to change patterns
              </div>
            </div>
          </div>

          {/* Bottom simple controls */}
          <div className="flex items-center justify-between border-t border-white/5 pt-6 z-10">
            <div className="flex items-center gap-4">
              <img src={currentTrack.coverUrl} alt="Cover" className="w-12 h-12 rounded-xl object-cover border border-white/5 shadow-2xl animate-spin-slow" />
              <div>
                <h3 className="text-xs font-bold text-white">{currentTrack.title}</h3>
                <p className="text-[10px] text-white/40">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button onClick={handlePrevSong} className="text-white/40 hover:text-white p-1 cursor-pointer"><SkipBack size={20} /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
              </button>
              <button onClick={handleNextSong} className="text-white/40 hover:text-white p-1 cursor-pointer"><SkipForward size={20} /></button>
            </div>

            <div className="text-xs text-white/40 font-mono">
              {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      {/* Global Background Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 300);
          }
        }}
        onEnded={handleAudioEnded}
      />

      {/* Modals & Popups Portal Grid */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setUserProfile(user);
        }}
      />

      <VoiceSearch
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSearchQuery={(q) => {
          setUserSearchText(q);
          setActiveView('search');
        }}
        onCommand={handleVoiceCommand}
      />

      {/* Playlist Creation Modal */}
      {showPlaylistCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-[#0c0c0f] border border-white/10 text-gray-200">
            <h3 className="text-md font-display font-bold text-white mb-4">Create New Playlist</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. Late Night Programming"
                  className="w-full px-3 py-2 text-xs bg-[#121215] border border-white/5 rounded-xl focus:outline-none focus:border-emerald-400 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5">Description (Optional)</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="Describe your compilation..."
                  className="w-full px-3 py-2 text-xs bg-[#121215] border border-white/5 rounded-xl focus:outline-none focus:border-emerald-400 text-white h-20 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 text-xs">
                <button
                  onClick={() => setShowPlaylistCreateModal(false)}
                  className="px-4 py-2 hover:bg-white/5 rounded-xl tracking-wide text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  className="px-5 py-2 rounded-xl bg-emerald-400 text-black font-extrabold tracking-wide"
                >
                  Create Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
