import { useState, useCallback, useEffect, useRef } from 'react';
import { Coordinate, Direction, GameStatus } from '../types';
import {
  GRID_SIZE,
  INITIAL_SNAKE,
  INITIAL_FOOD,
  INITIAL_SPEED,
  SPEED_DECREMENT,
  MIN_SPEED,
  SCORE_INCREMENT
} from '../constants';
import { useInterval } from './useInterval';

const generateFood = (snake: Coordinate[]): Coordinate => {
  let newFood: Coordinate;
  let isOnSnake = true;

  while (isOnSnake) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

const getStoredHighScore = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('snake-highscore');
    return stored ? parseInt(stored, 10) : 0;
  }
  return 0;
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getStoredHighScore());
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // We use a ref to track direction changes within a single tick
  // to prevent the snake from reversing into itself quickly (e.g. UP -> LEFT -> DOWN in <100ms)
  const directionLocked = useRef(false);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(Direction.UP);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus(GameStatus.PLAYING);
    directionLocked.current = false;
  }, []);

  const pauseGame = useCallback(() => {
    if (status === GameStatus.PLAYING) setStatus(GameStatus.PAUSED);
    else if (status === GameStatus.PAUSED) setStatus(GameStatus.PLAYING);
  }, [status]);

  const changeDirection = useCallback((newDir: Direction) => {
    if (directionLocked.current) return;

    setDirection((prevDir) => {
      // Prevent 180 degree turns
      if (prevDir === Direction.UP && newDir === Direction.DOWN) return prevDir;
      if (prevDir === Direction.DOWN && newDir === Direction.UP) return prevDir;
      if (prevDir === Direction.LEFT && newDir === Direction.RIGHT) return prevDir;
      if (prevDir === Direction.RIGHT && newDir === Direction.LEFT) return prevDir;
      
      directionLocked.current = true;
      return newDir;
    });
  }, []);

  const moveSnake = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check Collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      // Check Collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + SCORE_INCREMENT;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake-highscore', newScore.toString());
          }
          return newScore;
        });
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail
      }
      
      // Unlock direction change for next tick
      directionLocked.current = false;
      return newSnake;
    });
  }, [direction, food, status, highScore]);

  // Game Loop
  useInterval(
    moveSnake,
    status === GameStatus.PLAYING ? speed : null
  );

  return {
    snake,
    food,
    direction,
    status,
    score,
    highScore,
    startGame,
    pauseGame,
    changeDirection,
  };
};