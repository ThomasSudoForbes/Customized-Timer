import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Segment, SegmentType } from './types';
import Timeline from './components/Timeline';
import CircularTimer from './components/CircularTimer';
import EditModal from './components/EditModal';

const generateInitialSegments = (count: number): Segment[] => {
  return Array.from({ length: count }, (_, i) => {
    const isWorkSegment = i % 2 !== 0;
    if (i === 0) {
      return {
        id: i,
        type: SegmentType.PREPARE,
        label: 'Get Ready',
        duration: 5,
      };
    }
    return {
      id: i,
      type: isWorkSegment ? SegmentType.WORK : SegmentType.PREPARE,
      label: isWorkSegment ? 'Timer' : 'Cool Down',
      duration: isWorkSegment ? 30 : 5,
    };
  });
};

const App: React.FC = () => {
  const [segments, setSegments] = useState<Segment[]>(generateInitialSegments(10));
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(segments[0].duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [appTitle, setAppTitle] = useState<string>('Customized Timer');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeRemainingOnPauseRef = useRef<number | null>(null);

  const currentSegment = useMemo(() => segments[currentSegmentIndex], [segments, currentSegmentIndex]);
  const totalDuration = useMemo(() => segments.reduce((acc, s) => acc + s.duration, 0), [segments]);

  useEffect(() => {
    if (!currentSegment) {
      setIsRunning(false);
      return;
    }
    setTimeRemaining(currentSegment.duration);
    timeRemainingOnPauseRef.current = null;
  }, [currentSegment]);
  
  const cleanupAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && currentSegment) {
      startTimeRef.current = performance.now();
      const initialTime = timeRemainingOnPauseRef.current ?? currentSegment.duration;

      const tick = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }
        const elapsed = (timestamp - startTimeRef.current) / 1000;
        const newTimeRemaining = initialTime - elapsed;

        if (newTimeRemaining <= 0) {
          setTimeRemaining(0);
          if (currentSegmentIndex < segments.length - 1) {
            setCurrentSegmentIndex(prevIndex => prevIndex + 1);
          } else {
            // End of all segments
            setIsRunning(false);
            setCurrentSegmentIndex(0);
          }
        } else {
          setTimeRemaining(newTimeRemaining);
          animationFrameRef.current = requestAnimationFrame(tick);
        }
      };
      
      cleanupAnimation();
      animationFrameRef.current = requestAnimationFrame(tick);

    } else {
      // Pausing
      cleanupAnimation();
      if(timeRemaining > 0) {
         timeRemainingOnPauseRef.current = timeRemaining;
      }
    }
    
    return cleanupAnimation;
  }, [isRunning, currentSegment, currentSegmentIndex, segments, cleanupAnimation]);

  const handleStartPause = useCallback(() => {
    if (currentSegmentIndex >= segments.length - 1 && timeRemaining <= 0) {
        setCurrentSegmentIndex(0);
    }
    setIsRunning(prev => !prev);
  }, [segments.length, currentSegmentIndex, timeRemaining]);

  const handleSegmentClick = useCallback((segment: Segment) => {
    if (!isRunning) {
      setEditingSegment(segment);
    }
  }, [isRunning]);

  const handleCloseModal = useCallback(() => {
    setEditingSegment(null);
  }, []);

  const handleSaveChanges = useCallback((updatedSegment: Segment, applyToAll: boolean) => {
    setSegments(prevSegments => {
      const newSegments = [...prevSegments];
      const segmentIndex = newSegments.findIndex(s => s.id === updatedSegment.id);

      if (segmentIndex === -1) return prevSegments;

      if (applyToAll) {
        for (let i = segmentIndex; i < newSegments.length; i++) {
          if (newSegments[i].type === updatedSegment.type) {
            newSegments[i] = {
                ...newSegments[i],
                duration: updatedSegment.duration,
                label: updatedSegment.type === SegmentType.WORK ? updatedSegment.label : newSegments[i].label
            };
          }
        }
      } else {
        newSegments[segmentIndex] = updatedSegment;
      }
      
      // If the edited segment is the current one, update time remaining if paused.
      if (!isRunning && currentSegment && currentSegment.id === updatedSegment.id) {
          setTimeRemaining(updatedSegment.duration);
          timeRemainingOnPauseRef.current = updatedSegment.duration;
      }

      return newSegments;
    });
    setEditingSegment(null);
  }, [currentSegment, isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    timeRemainingOnPauseRef.current = null;
    if (currentSegmentIndex === 0) {
        // Already on first segment, useEffect won't trigger, so manually reset.
        setTimeRemaining(segments[0].duration);
    } else {
        setCurrentSegmentIndex(0);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_20%,transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-8 md:gap-12">
        {isEditingTitle ? (
            <input
              type="text"
              value={appTitle}
              onChange={(e) => setAppTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  setIsEditingTitle(false);
                  e.currentTarget.blur();
                }
              }}
              autoFocus
              className="text-4xl md:text-5xl font-bold text-center tracking-tighter bg-transparent text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-lg px-4 py-2"
            />
          ) : (
            <h1 
              onClick={() => setIsEditingTitle(true)}
              className="text-4xl md:text-5xl font-bold text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-400 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {appTitle}
            </h1>
          )}

        <Timeline 
          segments={segments} 
          currentSegmentIndex={currentSegmentIndex} 
          onSegmentClick={handleSegmentClick}
          totalDuration={totalDuration}
          timeRemaining={timeRemaining}
          isRunning={isRunning}
        />

        <CircularTimer 
          key={currentSegmentIndex}
          duration={currentSegment?.duration || 0}
          timeRemaining={timeRemaining}
          label={currentSegment?.label || "Finished"}
          isRunning={isRunning}
          onStartPause={handleStartPause}
          onReset={handleReset}
        />
      </div>

      {editingSegment && (
        <EditModal 
          segment={editingSegment}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default App;