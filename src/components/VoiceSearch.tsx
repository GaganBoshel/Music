import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, X, Volume2, Play, CornerDownRight } from 'lucide-react';

interface VoiceSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchQuery: (query: string) => void;
  onCommand: (command: string, parameter?: string) => void;
}

export default function VoiceSearch({ isOpen, onClose, onSearchQuery, onCommand }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (isListening) stopListening();
      return;
    }

    // Initialize Web Speech API safely
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not fully supported in this browser. Try Chrome or Safari.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    rec.onerror = (event: any) => {
      console.warn('Voice capture failed:', event.error);
      if (event.error === 'no-speech') {
        // Safe to ignore, just await further input
      } else {
        setSpeechError(`Error: ${event.error}. Click Mic to try again.`);
        setIsListening(false);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const activeText = final || interim;
      setTranscript(activeText);

      if (final) {
        processCommand(final.toLowerCase());
      }
    };

    recognitionRef.current = rec;
    
    // Auto start when opening
    startListening();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen]);

  const startListening = () => {
    setTranscript('Listening... Speak now.');
    setSpeechError(null);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (e) {
      // recognition already running
    }
  };

  const stopListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {
      // already stopped
    }
    setIsListening(false);
  };

  // Advanced Natural Voice Command Parser
  const processCommand = (phrase: string) => {
    const clean = phrase.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    console.log('Voice Command Received:', clean);

    // 1. Play command
    if (clean.startsWith('play ')) {
      const target = clean.substring(5).trim();
      if (target) {
        onCommand('play', target);
        setTranscript(`Command found: Playing "${target}"`);
        setTimeout(() => onClose(), 1700);
        return;
      }
    }

    // 2. Control directives
    if (['pause', 'stop', 'hold music'].some(cmd => clean.includes(cmd))) {
      onCommand('pause');
      setTranscript('Command found: Paused music');
      setTimeout(() => onClose(), 1200);
      return;
    }

    if (['resume', 'unpause', 'start music'].some(cmd => clean.includes(cmd))) {
      onCommand('play-toggle');
      setTranscript('Command found: Playing music');
      setTimeout(() => onClose(), 1200);
      return;
    }

    if (['next', 'skip', 'forward'].some(cmd => clean.includes(cmd))) {
      onCommand('next');
      setTranscript('Command: Skipping to next song');
      setTimeout(() => onClose(), 1200);
      return;
    }

    if (['before', 'previous', 'go back'].some(cmd => clean.includes(cmd))) {
      onCommand('previous');
      setTranscript('Command: Playing previous track');
      setTimeout(() => onClose(), 1200);
      return;
    }

    // 3. Audio adjustments
    if (clean.includes('volume up') || clean.includes('louder')) {
      onCommand('volume-up');
      setTranscript('Volume adjusted higher');
      return;
    }

    if (clean.includes('volume down') || clean.includes('quieter')) {
      onCommand('volume-down');
      setTranscript('Volume adjusted lower');
      return;
    }

    // 4. View routing
    if (clean.includes('recommend') || clean.includes('suggest') || clean.includes('ai')) {
      onCommand('go-ai');
      setTranscript('Opening Harmony AI Copilot...');
      setTimeout(() => onClose(), 1300);
      return;
    }

    if (clean.includes('home') || clean.includes('dashboard')) {
      onCommand('go-home');
      setTranscript('Opening Home Lounge...');
      setTimeout(() => onClose(), 1300);
      return;
    }

    // Default to search filter
    onSearchQuery(clean);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-md p-8 rounded-[32px] border border-white/10 bg-[#0c0c0f]/95 shadow-2 flex flex-col items-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Headings */}
        <h3 className="text-xl font-display font-extrabold text-white mb-1.5 leading-none text-center">Voice Command Centre</h3>
        <p className="text-[10px] text-white/40 mb-8 font-sans text-center px-6">Control your playback and search songs instantly hands-free</p>

        {/* Dynamic Pulsing Orb */}
        <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-white/5 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-white/10 animate-pulse" />
            </>
          )}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isListening 
                ? 'bg-white text-black shadow-lg scale-105' 
                : 'bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
            }`}
          >
            {isListening ? <Mic size={28} className="animate-pulse" /> : <MicOff size={28} />}
          </button>
        </div>

        {/* Live Speech transcript displays */}
        <div className="min-h-[64px] mb-8 bg-[#09090b] rounded-2xl border border-white/5 p-4 flex items-center justify-center w-full">
          <p className={`text-sm leading-relaxed text-center ${isListening ? 'text-indigo-300 font-bold' : 'text-white/40'}`}>
            "{transcript}"
          </p>
        </div>

        {/* Warnings or Instructions */}
        {speechError ? (
          <p className="text-xs text-red-400 font-medium">{speechError}</p>
        ) : (
          <div className="space-y-2.5 text-left bg-white/[0.01] p-4 rounded-2xl border border-white/5 text-xs text-white/60 w-full">
            <p className="font-bold text-white/80 border-b border-white/5 pb-1 text-center mb-1 font-mono uppercase tracking-wider text-[10px]">💡 Voice commands to try</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5"><Play size={10} className="text-indigo-400" fill="currentColor" /> "Play Midnight Lofi"</div>
              <div className="flex items-center gap-1.5"><Play size={10} className="text-indigo-400" fill="currentColor" /> "Skip back / Next"</div>
              <div className="flex items-center gap-1.5"><Play size={10} className="text-indigo-400" fill="currentColor" /> "Volume Up / Down"</div>
              <div className="flex items-center gap-1.5"><Play size={10} className="text-indigo-400" fill="currentColor" /> "Pause song"</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
