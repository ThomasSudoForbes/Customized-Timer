import React, { useState, useEffect, useMemo } from 'react';
import { Segment, SegmentType } from '../types';

interface EditModalProps {
  segment: Segment;
  onClose: () => void;
  onSave: (segment: Segment, applyToAll: boolean) => void;
}

const EditModal: React.FC<EditModalProps> = ({ segment, onClose, onSave }) => {
  const [duration, setDuration] = useState<string>(String(segment.duration));
  const [label, setLabel] = useState<string>(segment.label);
  const [applyToAll, setApplyToAll] = useState<boolean>(false);

  const isDurationValid = useMemo(() => {
    const num = parseInt(duration, 10);
    return !isNaN(num) && num > 0;
  }, [duration]);

  useEffect(() => {
    setDuration(String(segment.duration));
    setLabel(segment.label);
  }, [segment]);

  const handleSave = () => {
    if (isDurationValid) {
      onSave({ ...segment, duration: parseInt(duration, 10), label }, applyToAll);
    }
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // only allow digits
      setDuration(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-sm shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Edit Segment</h2>
        
        <div className="space-y-4">
          {segment.type === SegmentType.WORK && (
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-slate-400 mb-1">Label</label>
              <input 
                id="label"
                type="text" 
                value={label} 
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          )}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-400 mb-1">Duration (seconds)</label>
            <input 
              id="duration"
              type="text"
              inputMode="numeric"
              value={duration}
              onChange={handleDurationChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              id="applyToAll"
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 text-pink-600 focus:ring-pink-500 bg-slate-700"
            />
            <label htmlFor="applyToAll" className="ml-2 block text-sm text-slate-300">
              Apply to all subsequent '{segment.type === SegmentType.WORK ? 'Timer' : 'Cool Down'}' segments
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-600/50 hover:bg-slate-500/50 rounded-md text-slate-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!isDurationValid}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 disabled:bg-pink-900 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
