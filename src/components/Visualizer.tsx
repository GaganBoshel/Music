import React, { useEffect, useRef, useState } from 'react';

interface VisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  mode: 'bars' | 'circle' | 'wave' | 'particles';
  accentColor: string; // Tailwind tint or Hex
}

export default function Visualizer({ audioRef, isPlaying, mode, accentColor }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [hasConnectionFailed, setHasConnectionFailed] = useState(false);

  // Parse accent colors into solid canvas RGB configurations
  const getRGBs = () => {
    switch (accentColor) {
      case 'purple': return { r: 168, g: 85, b: 247 }; // Purple
      case 'indigo': return { r: 99, g: 102, b: 241 };  // Indigo
      case 'teal': return { r: 20, g: 184, b: 166 };   // Teal
      case 'amber': return { r: 245, g: 158, b: 11 };  // Amber
      case 'emerald':
      default: return { r: 16, g: 185, b: 129 };     // Emerald
    }
  };

  // Connect Web Audio API safely
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setupAnalyzer = () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          const resumeOnAction = () => {
            ctx.resume();
            window.removeEventListener('click', resumeOnAction);
          };
          window.addEventListener('click', resumeOnAction);
        }

        if (!analyserRef.current) {
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
        }

        // Only attach source element once
        if (!sourceRef.current) {
          // Add crossOrigin tag to support direct pixel scans of third-party domains
          audio.crossOrigin = "anonymous";
          const source = ctx.createMediaElementSource(audio);
          source.connect(analyserRef.current);
          analyserRef.current.connect(ctx.destination);
          sourceRef.current = source;
        }
        setHasConnectionFailed(false);
      } catch (e) {
        console.warn('Web Audio API initialized with simulated node (safe fallback mode):', e);
        setHasConnectionFailed(true);
      }
    };

    // Initialize on play to satisfy browser user-interaction rules
    const handlePlay = () => {
      if (!audioContextRef.current) {
        setupAnalyzer();
      }
    };

    audio.addEventListener('play', handlePlay);
    return () => {
      audio.removeEventListener('play', handlePlay);
    };
  }, [audioRef]);

  // Main Canvas Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Simulated spectrum data for fallback/smooth animation
    let simFrequencies = Array.from({ length: 64 }, () => Math.random() * 20);
    // Particle database for Particle system
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2,
    }));

    // Local timing for sine wave mathematics
    let phase = 0;

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      
      // Clear with elegant translucent fade out for trailing blur styles
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const color = getRGBs();
      const rawColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
      const glowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`;
      
      // Obtain actual byte arrays or run mathematical simulations
      let dataArray = new Uint8Array(64);
      let isActuallyStreaming = false;

      if (analyserRef.current && !hasConnectionFailed) {
        analyserRef.current.getByteFrequencyData(dataArray);
        // Verify audio is streaming non-zero audio bytes
        isActuallyStreaming = Array.from(dataArray).some(val => val > 0) && isPlaying;
      }

      // If simulated or browser state is passive, animate nicely
      if (!isActuallyStreaming) {
        phase += isPlaying ? 0.08 : 0.005;
        for (let i = 0; i < 64; i++) {
          const target = isPlaying 
            ? Math.sin(phase + i * 0.15) * 45 + Math.cos(phase * 1.5 - i * 0.3) * 20 + 75
            : Math.sin(phase * 0.2 + i * 0.1) * 6 + 10;
          
          // Interpolate to avoid sudden jumping
          simFrequencies[i] += (target - simFrequencies[i]) * 0.18;
          dataArray[i] = Math.max(0, Math.min(255, simFrequencies[i]));
        }
      }

      // 1. BAR SPECTROGRAM MODE
      if (mode === 'bars') {
        const barWidth = (width / 48);
        const gap = 3;
        
        ctx.save();
        ctx.translate(width / 2 - (24 * (barWidth + gap)) / 2, 0);
        
        for (let i = 0; i < 24; i++) {
          // Dynamic frequency calculation
          const value = dataArray[i * 2] || 0;
          const pct = value / 255;
          const barHeight = Math.max(4, pct * (height * 0.75));

          // Create standard gorgeous gradient vertical bars
          const x = i * (barWidth + gap);
          const y = height / 2 - barHeight / 2;

          // Shadow glow
          ctx.shadowBlur = isPlaying ? 15 : 4;
          ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`;

          // Dynamic radial gradients
          const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
          grad.addColorStop(0, `rgb(${color.r}, ${color.g}, ${color.b})`);
          grad.addColorStop(1, `rgba(${color.r - 20}, ${color.g - 20}, ${color.b + 40}, 0.3)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 4);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. CIRCULAR BULGING MANDALA
      else if (mode === 'circle') {
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.18;
        
        // Sum frequencies to get dynamic overall energy scale
        const energy = Array.from(dataArray).slice(0, 32).reduce((a, b) => a + b, 0) / 32 / 255;
        const bulgeRadius = baseRadius + (isPlaying ? energy * 35 : 0);

        ctx.shadowBlur = isPlaying ? 25 : 5;
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;

        // Pulse background aura circle
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.03 + energy * 0.08})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bulgeRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw radial frequencies spokes
        ctx.strokeStyle = rawColor;
        ctx.lineWidth = 2.5;
        
        const totalPoints = 48;
        ctx.beginPath();
        
        for (let i = 0; i < totalPoints; i++) {
          const angle = (i / totalPoints) * Math.PI * 2;
          const fIndex = Math.floor((i < totalPoints / 2 ? i : totalPoints - i) * (64 / totalPoints));
          const fValue = dataArray[fIndex] || 0;
          const spikeHeight = (fValue / 255) * (baseRadius * 0.7);
          
          const xStart = centerX + Math.cos(angle) * bulgeRadius;
          const yStart = centerY + Math.sin(angle) * bulgeRadius;
          const xEnd = centerX + Math.cos(angle) * (bulgeRadius + Math.max(3, spikeHeight));
          const yEnd = centerY + Math.sin(angle) * (bulgeRadius + Math.max(3, spikeHeight));

          ctx.moveTo(xStart, yStart);
          ctx.lineTo(xEnd, yEnd);
        }
        ctx.stroke();

        // Inner nucleus core icon circle
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#0f0f11';
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bulgeRadius - 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // 3. INFINITE BEZIER WAVEFORM
      else if (mode === 'wave') {
        ctx.save();
        ctx.strokeStyle = rawColor;
        ctx.shadowBlur = isPlaying ? 12 : 3;
        ctx.shadowColor = rawColor;

        // Draw multiple beautiful layered floating waves
        const waveLayers = 3;
        for (let w = 0; w < waveLayers; w++) {
          const alphaFactor = 1 - (w * 0.25);
          ctx.lineWidth = w === 0 ? 3.5 : 1.5;
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alphaFactor})`;
          ctx.beginPath();

          const offsetPhase = phase * (1 + w * 0.2) + w * Math.PI / 3;

          for (let x = 0; x <= width; x += 15) {
            const fraction = x / width;
            // Dampen coordinates near edges to construct clean flat endings
            const edgeDamping = Math.sin(fraction * Math.PI);
            
            // Generate combined harmonic offsets
            const fIndex = Math.floor((fraction * 15) % 64);
            const amplitude = (dataArray[fIndex] / 255) * 55 * edgeDamping;
            
            const y = height / 2 + Math.sin(fraction * Math.PI * 2 + offsetPhase) * (isPlaying ? amplitude : 10 * edgeDamping);
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. NEBULA PARTICLE DUST
      else if (mode === 'particles') {
        const energySum = Array.from(dataArray).slice(0, 16).reduce((a, b) => a + b, 0) / 16 / 255;
        const pushIntensity = isPlaying ? energySum * 9 + 1.2 : 0.5;

        ctx.save();
        ctx.fillStyle = rawColor;
        ctx.shadowBlur = isPlaying ? 8 : 2;
        ctx.shadowColor = rawColor;

        particles.forEach((p, idx) => {
          // Adjust velocity vectors dynamically mapped with audio amplitude
          p.vx += (Math.cos(p.angle) * pushIntensity * 0.05) * (isPlaying ? 1.5 : 0.2);
          p.vy += (Math.sin(p.angle) * pushIntensity * 0.05) * (isPlaying ? 1.5 : 0.2);
          
          // Glide friction
          p.vx *= 0.96;
          p.vy *= 0.96;

          p.x += p.vx + (isPlaying ? 0.3 : 0.05);
          p.y += p.vy;

          // Re-wrap bounding limits seamlessly
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Connect stars with fine line webs if close
          particles.forEach((p2, idx2) => {
            if (idx === idx2) return;
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 45) {
              ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.15 * (1 - dist / 45)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });

          // Draw active glowing micro nodes
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + (isPlaying ? energySum * 3 : 0), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [mode, accentColor, isPlaying, hasConnectionFailed]);

  // Clean elements upon complete component unmounting
  useEffect(() => {
    return () => {
      // We keep the AudioContext and nodes alive to prevent garbage disposal crashes,
      // but clean up execution refs to prevent stale rendering memory leaks.
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0d0d0f] border border-white/5 flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-pointer transition-transform duration-500 hover:scale-[1.01]" 
        title="Click visualizer to trigger audio sync state"
      />
      
      {/* Floating Mode Overlay Flag */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5 flex items-center gap-1.5 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        <span className="text-[9px] uppercase font-mono tracking-wider font-semibold text-gray-400">
          Visual: {mode}
        </span>
      </div>
    </div>
  );
}
