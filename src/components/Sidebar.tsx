import React from 'react';
import { 
  Music, 
  Home, 
  Search, 
  Library, 
  Sparkles, 
  BarChart2, 
  Compass, 
  LogOut, 
  User as UserIcon, 
  Moon, 
  Sun,
  PlusSquare,
  Lock
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isLightMode: boolean;
  setIsLightMode: (light: boolean) => void;
  user: { username: string; email: string; avatarUrl: string } | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenCreatePlaylist: () => void;
  customPlaylists: { id: string; name: string }[];
  onSelectPlaylist: (id: string) => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  isLightMode,
  setIsLightMode,
  user,
  onLogout,
  onOpenAuth,
  onOpenCreatePlaylist,
  customPlaylists,
  onSelectPlaylist,
}: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-full border-r border-white/5 bg-black text-gray-300">
      <div className="flex flex-col flex-1 py-6 px-4 overflow-y-auto">
        {/* Brand Logo - Styled with elegant pink/purple/indigo icon styling from design */}
        <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer" onClick={() => setActiveView('home')}>
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Music size={16} className="text-white fill-current" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Harmony
              <span className="text-[9px] bg-white/10 text-white/90 border border-white/10 px-1.5 py-0.5 rounded-full font-mono font-medium tracking-normal">PRO</span>
            </span>
            <p className="text-[9px] text-white/40 font-medium">Billion-Dollar Sound</p>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <div className="space-y-1 mb-8">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider px-2 mb-2">Discover</p>
          <button
            onClick={() => setActiveView('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeView === 'home'
                ? 'bg-white/5 text-white border-l-2 border-white'
                : 'hover:bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Home size={18} />
            <span>Home Lounge</span>
          </button>
          
          <button
            onClick={() => setActiveView('search')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeView === 'search'
                ? 'bg-white/5 text-white border-l-2 border-white'
                : 'hover:bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Search size={18} />
            <span>Universal Search</span>
          </button>

          <button
            onClick={() => setActiveView('library')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeView === 'library'
                ? 'bg-white/5 text-white border-l-2 border-white'
                : 'hover:bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Library size={18} />
            <span>Your Library</span>
          </button>
        </div>

        {/* Premium Core AI Curation */}
        <div className="space-y-1 mb-8">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider px-2 mb-2">Intelligence</p>
          <button
            onClick={() => setActiveView('gemini-ai')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative overflow-hidden group ${
              activeView === 'gemini-ai'
                ? 'bg-gradient-to-r from-purple-950/40 to-indigo-950/20 text-purple-300 border-l-2 border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                : 'bg-gradient-to-r from-purple-950/10 to-indigo-950/5 border border-purple-500/10 text-white/65 hover:text-white hover:border-purple-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-purple-400 group-hover:animate-bounce" />
              <span>Harmony AI Copilot</span>
            </div>
            <span className="text-[9px] bg-purple-500 text-white font-bold py-0.5 px-1.5 rounded-full uppercase tracking-wider scale-90 group-hover:scale-95 transition-transform duration-200">
              NEW
            </span>
          </button>

          <button
            onClick={() => setActiveView('profile-stats')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeView === 'profile-stats'
                ? 'bg-white/5 text-white border-l-2 border-white'
                : 'hover:bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <BarChart2 size={18} />
            <span>Listening Insights</span>
          </button>
        </div>

        {/* Custom Playlists */}
        <div className="flex-1 min-h-[140px] flex flex-col space-y-1 mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Playlists</span>
            <button 
              onClick={onOpenCreatePlaylist}
              className="text-white/40 hover:text-white transition-colors animate-pulse" 
              title="Create Playlist"
            >
              <PlusSquare size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 max-h-[220px]">
            {customPlaylists.length === 0 ? (
              <p className="text-xs text-white/30 px-2 italic">No custom playlists</p>
            ) : (
              customPlaylists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => onSelectPlaylist(playlist.id)}
                  className="w-full text-left truncate px-3 py-1.5 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  🎧 {playlist.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Upgrade to Pro widget directly from design HTML */}
        <div className="mt-auto mb-2">
          <div className="p-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-2xl">
            <p className="text-sm font-semibold text-white mb-1">Upgrade to Pro</p>
            <p className="text-xs text-white/50 mb-3">High fidelity audio & offline mode.</p>
            <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-200 transition-all active:scale-95 duration-200">
              Get Premium
            </button>
          </div>
        </div>
      </div>

      {/* Footer Interface */}
      <div className="p-4 border-t border-white/5 bg-black/60 space-y-4">
        {/* Dark/Light Mode Theme Switcher */}
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-white/40 font-medium">Ambient Mode</span>
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="w-12 h-6 rounded-full bg-[#121215] border border-white/15 flex items-center p-0.5 transition-all duration-300 shadow-inner"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                isLightMode 
                  ? 'translate-x-6 bg-amber-500 text-white' 
                  : 'bg-white text-black'
              }`}
            >
              {isLightMode ? <Sun size={10} /> : <Moon size={10} />}
            </div>
          </button>
        </div>

        {/* User Account State */}
        {user ? (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0" onClick={() => setActiveView('profile-stats')}>
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover border border-white/25 hover:scale-105 transition-transform cursor-pointer"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate cursor-pointer hover:text-white/80">{user.username}</p>
                <p className="text-[9px] text-white/40 font-medium font-mono">Premium</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-white/5 rounded-xl text-white/40 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold text-black bg-white hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <UserIcon size={14} />
            <span>Login or Join</span>
          </button>
        )}
      </div>
    </aside>
  );
}
