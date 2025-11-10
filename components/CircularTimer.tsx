import React from 'react';

interface CircularTimerProps {
  duration: number;
  timeRemaining: number;
  label: string;
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ duration, timeRemaining, label, isRunning, onStartPause, onReset }) => {
  const radius = 100;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = duration > 0 ? (timeRemaining / duration) : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const displaySecondsTotal = Math.ceil(Math.max(0, timeRemaining));
  const minutes = Math.floor(displaySecondsTotal / 60);
  const seconds = displaySecondsTotal % 60;

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      <svg
        className="absolute top-0 left-0 w-full h-full transform -rotate-90"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
        </defs>
      </svg>
      <div className="z-10 flex flex-col items-center justify-center text-center">
        <span className="text-5xl md:text-6xl font-mono font-bold tracking-tighter">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className="text-lg md:text-xl text-slate-400 uppercase tracking-widest mt-2">{label}</span>
        <div className="mt-6 flex gap-4">
            <button
            onClick={onStartPause}
            className="w-24 h-10 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-full text-white font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500"
            >
            {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
            onClick={onReset}
            disabled={isRunning}
            aria-label="Reset Timer"
            className="w-10 h-10 p-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-full text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6" />
            </svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CircularTimer;