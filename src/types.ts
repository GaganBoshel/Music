export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
  lyrics: { time: number; text: string }[];
  isFeatured?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  created_at: string;
  isCustom?: boolean;
}

export interface User {
  username: string;
  email: string;
  avatarUrl: string;
  favorites: string[]; // Track IDs
  playlists: Playlist[];
  recentlyPlayed: string[]; // Track IDs
  listeningTime: number; // in seconds
}

export type ActiveView = 
  | 'home' 
  | 'search' 
  | 'library' 
  | 'playlist-detail' 
  | 'gemini-ai' 
  | 'profile-stats';

export type VisualizerMode = 'bars' | 'circle' | 'wave' | 'particles';
