import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { username: string; email: string; avatarUrl: string }) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', // Cyberpunk neon
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', // Retro wave
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'  // Warm acoustic
];

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter all required fields.');
      return;
    }

    if (isRegistering && !username) {
      setFormError('Please select a username.');
      return;
    }

    // Capture success state and store details in local storage
    const targetUser = {
      username: isRegistering ? username : email.split('@')[0],
      email: email,
      avatarUrl: isRegistering ? selectedAvatar : PRESET_AVATARS[1]
    };

    localStorage.setItem('harmony_user', JSON.stringify(targetUser));
    onLoginSuccess(targetUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-sm p-8 rounded-[32px] border border-white/10 bg-[#0c0c0f]/95 shadow-2 flex flex-col items-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Brand Display */}
        <div className="mb-6 space-y-2 text-center w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 text-[9px] font-mono uppercase tracking-wider font-semibold">
            <Sparkles size={10} className="animate-pulse text-indigo-400" />
            <span>Exclusive Access</span>
          </div>
          <h2 className="text-xl font-display font-extrabold text-white mt-1.5 leading-none">
            {isRegistering ? 'Create Harmony Profile' : 'Access Your Studio'}
          </h2>
          <p className="text-[10px] text-white/40 leading-relaxed px-4">Unlock custom library playlists, smart Gemini recommendations, and stats</p>
        </div>

        {/* Core Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          
          {isRegistering && (
            <div className="space-y-3 w-full">
              {/* Avatar Selector */}
              <label className="block text-[9px] text-left text-white/40 font-bold uppercase tracking-wider mb-1 font-mono">Select Identity Avatar</label>
              <div className="flex justify-center gap-3">
                {PRESET_AVATARS.map((avatar, idx) => {
                  const isSelected = selectedAvatar === avatar;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img src={avatar} alt="Preset Avatar" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/30">
                          <Check size={14} className="text-white font-extrabold" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Username Input */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30 pointer-events-none">
                  <User size={13} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#09090b] border border-white/10 rounded-xl placeholder-white/25 focus:outline-none focus:border-white/20 transition-all text-white"
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30 pointer-events-none">
              <Mail size={13} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#09090b] border border-white/10 rounded-xl placeholder-white/25 focus:outline-none focus:border-white/20 transition-all text-white"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30 pointer-events-none">
              <Lock size={13} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password detail"
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#09090b] border border-white/10 rounded-xl placeholder-white/25 focus:outline-none focus:border-white/20 transition-all text-white"
            />
          </div>

          {formError && (
            <p className="text-[10px] text-red-400 font-medium text-left">{formError}</p>
          )}

          {/* Action trigger button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-250 text-black font-extrabold text-xs tracking-wide shadow-lg cursor-pointer transition-all active:scale-95 duration-200"
          >
            {isRegistering ? 'Register Harmony Profile' : 'Enter Studio Control'}
          </button>
        </form>

        {/* Modal Switchers */}
        <div className="mt-5 pt-4 border-t border-white/5 w-full text-center">
          <p className="text-[10px] text-white/40 font-sans">
            {isRegistering ? 'Already have a workspace account?' : 'Need a fresh premium account?'}
            <button
              onClick={() => {
                setFormError(null);
                setIsRegistering(!isRegistering);
              }}
              className="ml-1 text-indigo-300 hover:text-indigo-200 font-medium hover:underline transition-colors focus:outline-none cursor-pointer"
            >
              {isRegistering ? 'Log In' : 'Create Profile'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
