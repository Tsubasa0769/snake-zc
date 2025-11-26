import { Coordinate } from './types';

export const GRID_SIZE = 20; // 20x20 grid
export const INITIAL_SPEED = 150; // ms per tick
export const MIN_SPEED = 50; // Fastest speed
export const SPEED_DECREMENT = 2; // Speed increase per food
export const SCORE_INCREMENT = 10;

export const INITIAL_SNAKE: Coordinate[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const INITIAL_FOOD: Coordinate = { x: 5, y: 5 };

export const KEY_MAPPING: Record<string, string> = {
  ArrowUp: 'UP',
  w: 'UP',
  W: 'UP',
  ArrowDown: 'DOWN',
  s: 'DOWN',
  S: 'DOWN',
  ArrowLeft: 'LEFT',
  a: 'LEFT',
  A: 'LEFT',
  ArrowRight: 'RIGHT',
  d: 'RIGHT',
  D: 'RIGHT',
};