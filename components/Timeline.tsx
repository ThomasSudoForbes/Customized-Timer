import React from 'react';
import { Segment, SegmentType } from '../types';

interface TimelineProps {
  segments: Segment[];
  currentSegmentIndex: number;
  onSegmentClick: (segment: Segment) => void;
  totalDuration: number;
  timeRemaining: number;
  isRunning: boolean;
}

const getSegmentColor = (type: SegmentType): string => {
  return type === SegmentType.PREPARE
    ? 'bg-blue-500'
    : 'bg-pink-500';
};

const getSegmentHoverColor = (type: SegmentType): string => {
    return type === SegmentType.PREPARE
      ? 'hover:bg-blue-400'
      : 'hover:bg-pink-400';
  };

const getGlowColor = (type: SegmentType): string => {
    return type === SegmentType.PREPARE
      ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)]'
      : 'shadow-[0_0_15px_rgba(236,72,153,0.6)]';
};

const Timeline: React.FC<TimelineProps> = ({ segments, currentSegmentIndex, onSegmentClick, totalDuration, timeRemaining, isRunning }) => {
  return (
    <div className="w-full bg-slate-800/50 rounded-xl h-12 md:h-16 flex overflow-hidden border border-slate-700 p-1 shadow-inner">
      {segments.map((segment, index) => {
        const isActive = index === currentSegmentIndex;
        const segmentProgress = isActive ? ((segment.duration - timeRemaining) / segment.duration) * 100 : (index < currentSegmentIndex ? 100 : 0);

        return (
          <div
            key={segment.id}
            className={`
              h-full rounded-xl transition-all duration-300 ease-in-out relative
              ${!isRunning ? 'cursor-pointer' : 'cursor-default'}
              ${getSegmentHoverColor(segment.type)}
              ${isActive ? `${getGlowColor(segment.type)} transform scale-105 z-10` : 'opacity-70'}
            `}
            style={{ width: `${(segment.duration / totalDuration) * 100}%` }}
            onClick={() => onSegmentClick(segment)}
          >
            <div className={`absolute inset-0 ${getSegmentColor(segment.type)} rounded-xl opacity-30`}></div>
            <div className={`absolute top-0 left-0 h-full ${getSegmentColor(segment.type)} rounded-xl`} style={{ width: `${segmentProgress}%` }}></div>
            <div className="relative z-10 flex items-center justify-center h-full px-2">
              <span className="text-xs md:text-sm font-semibold text-white truncate text-shadow">
                {segment.label} ({segment.duration}s)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;