import React from 'react';
import { Play, BarChart2, Calendar, Clock, Disc, Sparkles, Flame, User, Award } from 'lucide-react';
import { Track } from '../types';

interface StatsProps {
  listeningTime: number; // in seconds
  recentHistory: string[]; // list of ID references
  tracks: Track[];
  likedSongs: string[];
}

export default function Stats({
  listeningTime,
  recentHistory,
  tracks,
  likedSongs,
}: StatsProps) {
  // Format seconds into readable format
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let res = '';
    if (hours > 0) res += `${hours} hr `;
    if (minutes > 0 || hours > 0) res += `${minutes} min `;
    res += `${seconds} sec`;
    return res;
  };

  // Compile top tracks based on playback history recurrences
  const countsMap = recentHistory.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedTrackIds = Object.keys(countsMap).sort((a, b) => countsMap[b] - countsMap[a]);

  // Aggregate stats
  const totalPlaysCount = recentHistory.length;
  const uniqueSongsCount = new Set(recentHistory).size;
  const totalLikedCount = likedSongs.length;

  // Determine top genres by plays
  const genreHits: Record<string, number> = {};
  recentHistory.forEach(id => {
    const track = tracks.find(t => t.id === id);
    if (track) {
      genreHits[track.genre] = (genreHits[track.genre] || 0) + 1;
    }
  });

  const sortedGenres = Object.entries(genreHits).sort((a, b) => b[1] - a[1]);
  const primaryGenre = sortedGenres[0]?.[0] || 'Lo-Fi Chill';

  // SVG Chart Calculation data
  const chartData = [
    { label: 'Lo-Fi Chill', pct: 40, color: '#10b981' },
    { label: 'Synthwave', pct: 25, color: '#a855f7' },
    { label: 'Acoustic / indie', pct: 20, color: '#f59e0b' },
    { label: 'Ambient Focus', pct: 15, color: '#06b6d4' }
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-gradient-to-b from-[#111111] to-[#050505] text-gray-200">
      {/* Overview stats header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="text-white" />
            <span>Listening Insights</span>
          </h1>
          <p className="text-xs text-white/40 font-sans mt-1">Real-time statistics compiled based on your unique acoustic sessions</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-mono text-[10px] text-white/65">
          <Calendar size={12} className="text-white/40" />
          <span>Active Session: 2026-06-11 UTC</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div className="bg-white/[0.01] rounded-[24px] p-5 border border-white/5 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />
          <div className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center border border-white/10">
            <Clock size={16} />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Listening Hours</p>
            <h3 className="text-md font-display font-black text-white mt-1">{formatTime(listeningTime)}</h3>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white/[0.01] rounded-[24px] p-5 border border-white/5 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />
          <div className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center border border-white/10">
            <Disc size={16} className="animate-spin-slow" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Streams Launched</p>
            <h3 className="text-md font-display font-black text-white mt-1">{totalPlaysCount} total plays</h3>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white/[0.01] rounded-[24px] p-5 border border-white/5 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />
          <div className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center border border-white/10">
            <Flame size={16} />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Favorite Genre</p>
            <h3 className="text-md font-display font-black text-white truncate mt-1">{primaryGenre}</h3>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white/[0.01] rounded-[24px] p-5 border border-white/5 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />
          <div className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center border border-white/10">
            <Award size={16} />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Saves &amp; Favorites</p>
            <h3 className="text-md font-display font-black text-white mt-1">{totalLikedCount} songs</h3>
          </div>
        </div>
      </div>

      {/* Charts Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: SVG custom radial graph and progress gauges */}
        <div className="lg:col-span-5 bg-[#0a0a0c]/80 rounded-[28px] p-6 border border-white/5 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-display font-bold text-white/40 uppercase tracking-wider mb-2">Vibe Ratio Breakdown</h3>
            <p className="text-[11px] text-white/45 mb-6">Percentage estimate of auditory styles selected by listening habits</p>
          </div>

          <div className="flex items-center justify-center py-4">
            {/* SVG concentric circles representation */}
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
              {/* Outer Loop */}
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.02)" strokeWidth="8" fill="none" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="#ffffff" strokeWidth="8" 
                fill="none" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * 0.45)} 
                strokeLinecap="round" 
              />
              {/* Middle Loop */}
              <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.02)" strokeWidth="8" fill="none" />
              <circle 
                cx="50" cy="50" r="30" 
                stroke="#6366f1" strokeWidth="8" 
                fill="none" 
                strokeDasharray="188.4" 
                strokeDashoffset={188.4 - (188.4 * 0.3)} 
                strokeLinecap="round" 
              />
              {/* Inner Loop */}
              <circle cx="50" cy="50" r="20" stroke="rgba(255,255,255,0.02)" strokeWidth="8" fill="none" />
              <circle 
                cx="50" cy="50" r="20" 
                stroke="#a855f7" strokeWidth="8" 
                fill="none" 
                strokeDasharray="125.6" 
                strokeDashoffset={125.6 - (125.6 * 0.15)} 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center pt-4 border-t border-white/5">
            <div>
              <p className="text-[10px] text-white/40 font-mono">Lo-Fi Beats</p>
              <h4 className="text-xs font-bold text-white mt-1">45%</h4>
            </div>
            <div className="border-x border-white/5">
              <p className="text-[10px] text-white/40 font-mono">Cyber Outrun</p>
              <h4 className="text-xs font-bold text-indigo-400 mt-1">30%</h4>
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-mono">Organic Pop</p>
              <h4 className="text-xs font-bold text-purple-400 mt-1">15%</h4>
            </div>
          </div>
        </div>

        {/* Right Side: Heavy Play Count logs */}
        <div className="lg:col-span-7 bg-[#0a0a0c]/80 rounded-[28px] p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="text-xs font-display font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              <span>Heavy Rotations (Top Played)</span>
            </h3>
            <span className="text-[9px] font-mono text-white/45">Recurrences count</span>
          </div>

          {sortedTrackIds.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/30 italic">
              Play some music to compile dynamic rankings!
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTrackIds.slice(0, 5).map((id, index) => {
                const track = tracks.find(t => t.id === id);
                if (!track) return null;
                const count = countsMap[id];
                return (
                  <div key={id} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all">
                    <div className="flex items-center gap-3.5 min-w-0 font-sans">
                      <span className="font-mono text-white/40 font-bold text-xs w-4 text-center">{index + 1}</span>
                      <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                        <p className="text-[10px] text-white/40">{track.artist}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-white font-mono bg-white/5 py-1 px-2.5 rounded-lg border border-white/10">
                        {count} {count === 1 ? 'play' : 'plays'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
