import React, { useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, Trophy, Gamepad2 } from 'lucide-react';
import { useSnakeGame } from './hooks/useSnakeGame';
import Controls from './components/Controls';
import { GRID_SIZE, KEY_MAPPING } from './constants';
import { Direction, GameStatus } from './types';

const App: React.FC = () => {
  const {
    snake,
    food,
    status,
    score,
    highScore,
    startGame,
    pauseGame,
    changeDirection,
  } = useSnakeGame();

  const boardRef = useRef<HTMLDivElement>(null);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mappedDirection = KEY_MAPPING[e.key];
      if (mappedDirection) {
        changeDirection(mappedDirection as Direction);
        e.preventDefault();
      }
      if (e.code === 'Space') {
        if (status === GameStatus.IDLE || status === GameStatus.GAME_OVER) {
          startGame();
        } else {
          pauseGame();
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, startGame, pauseGame, status]);

  // Focus management for keyboard accessibility
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      boardRef.current?.focus();
    }
  }, [status]);

  const getCellClass = (x: number, y: number) => {
    const isFood = food.x === x && food.y === y;
    const isSnakeHead = snake[0].x === x && snake[0].y === y;
    const isSnakeBody = snake.some((seg, i) => i !== 0 && seg.x === x && seg.y === y);

    let classes = "w-full h-full rounded-sm transition-all duration-100 ";

    if (isFood) {
      return classes + "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] scale-75 animate-pulse rounded-full";
    }
    if (isSnakeHead) {
      return classes + "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10 scale-105";
    }
    if (isSnakeBody) {
      return classes + "bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.4)]";
    }
    
    return classes + "bg-slate-800/30";
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-arcade text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center gap-3">
            <Gamepad2 className="text-cyan-400 w-8 h-8" />
            SNAKE
          </h1>
          <p className="text-slate-400 text-xs mt-1 tracking-wider">NEON EDITION</p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-yellow-500">
            <Trophy className="w-4 h-4" />
            <span className="font-arcade text-sm">HI: {highScore}</span>
          </div>
          <div className="font-arcade text-2xl text-white mt-1">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative group">
        
        {/* The Grid */}
        <div
          ref={boardRef}
          className="bg-slate-900 border-4 border-slate-700 rounded-xl p-2 shadow-2xl relative overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 400px)',
            aspectRatio: '1/1',
            gap: '1px'
          }}
        >
           {/* Background Grid Lines (Decorative) */}
           <div className="absolute inset-0 grid pointer-events-none opacity-20" 
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
                }}>
             {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-slate-600/50" />
             ))}
           </div>

          {/* Cells */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            return (
              <div key={`${x}-${y}`} className="relative">
                <div className={getCellClass(x, y)} />
              </div>
            );
          })}
        </div>

        {/* Overlays */}
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
            <button
              onClick={startGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 flex items-center gap-2 animate-bounce"
            >
              <Play className="fill-current" /> START GAME
            </button>
            <p className="text-slate-400 mt-4 text-sm">Press Space or Button</p>
          </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
            <h2 className="text-4xl font-arcade text-rose-500 mb-2 drop-shadow-lg">GAME OVER</h2>
            <p className="text-slate-300 mb-6 font-arcade">SCORE: {score}</p>
            <button
              onClick={startGame}
              className="bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> RESTART
            </button>
          </div>
        )}

        {status === GameStatus.PAUSED && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
             <button onClick={pauseGame} className="bg-cyan-500/20 p-4 rounded-full backdrop-blur-md border border-cyan-500/50 text-cyan-400 animate-pulse">
                <Play className="w-12 h-12 fill-current" />
             </button>
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="mt-6 w-full max-w-md flex flex-col items-center">
        {/* Desktop Hints */}
        <div className="hidden md:flex gap-8 text-slate-500 text-sm mb-4">
          <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">SPACE</kbd> Pause/Resume</span>
          <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">ARROWS</kbd> Move</span>
        </div>

        {/* Mobile/Touch Controls */}
        <div className="md:hidden">
          <Controls onChangeDirection={changeDirection} />
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 mt-6 md:mt-2">
           <button 
             onClick={status === GameStatus.PLAYING ? pauseGame : startGame}
             className="p-3 bg-slate-800 rounded-full text-slate-200 hover:bg-slate-700 hover:text-cyan-400 transition-colors border border-slate-700"
             aria-label="Pause or Resume"
           >
             {status === GameStatus.PLAYING ? <Pause /> : <Play />}
           </button>
           <button 
             onClick={startGame}
             className="p-3 bg-slate-800 rounded-full text-slate-200 hover:bg-slate-700 hover:text-rose-400 transition-colors border border-slate-700"
             aria-label="Reset Game"
           >
             <RotateCcw />
           </button>
        </div>
      </div>
    </div>
  );
};

export default App;