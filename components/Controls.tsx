import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '../types';

interface ControlsProps {
  onChangeDirection: (dir: Direction) => void;
}

const Controls: React.FC<ControlsProps> = ({ onChangeDirection }) => {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 w-48 mx-auto mt-6">
      {/* Top Row: Empty, Up, Empty */}
      <div className="col-start-2">
        <button
          className="w-full aspect-square bg-slate-800 rounded-lg active:bg-cyan-600 active:scale-95 transition-all flex items-center justify-center border border-slate-700 shadow-lg touch-manipulation"
          onClick={() => onChangeDirection(Direction.UP)}
          aria-label="Up"
        >
          <ChevronUp className="text-white w-8 h-8" />
        </button>
      </div>

      {/* Bottom Row: Left, Down, Right */}
      <div className="col-start-1 row-start-2">
        <button
          className="w-full aspect-square bg-slate-800 rounded-lg active:bg-cyan-600 active:scale-95 transition-all flex items-center justify-center border border-slate-700 shadow-lg touch-manipulation"
          onClick={() => onChangeDirection(Direction.LEFT)}
          aria-label="Left"
        >
          <ChevronLeft className="text-white w-8 h-8" />
        </button>
      </div>

      <div className="col-start-2 row-start-2">
        <button
          className="w-full aspect-square bg-slate-800 rounded-lg active:bg-cyan-600 active:scale-95 transition-all flex items-center justify-center border border-slate-700 shadow-lg touch-manipulation"
          onClick={() => onChangeDirection(Direction.DOWN)}
          aria-label="Down"
        >
          <ChevronDown className="text-white w-8 h-8" />
        </button>
      </div>

      <div className="col-start-3 row-start-2">
        <button
          className="w-full aspect-square bg-slate-800 rounded-lg active:bg-cyan-600 active:scale-95 transition-all flex items-center justify-center border border-slate-700 shadow-lg touch-manipulation"
          onClick={() => onChangeDirection(Direction.RIGHT)}
          aria-label="Right"
        >
          <ChevronRight className="text-white w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Controls;