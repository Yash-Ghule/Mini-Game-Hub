import React, { useState, useEffect, useRef } from "react";
import "./SnakeGame.css";

/**
 * Grid-step Snake game (retro mechanics, modern visuals)
 * - Place this file at: src/components/games/snake/SnakeGame.jsx
 *
 * Controls:
 * - Arrow keys or WASD
 *
 * Notes:
 * - Uses absolute-positioned segments (no heavy grid DOM)
 * - Game uses rows x cols grid and moves the snake every `speed` ms
 */

const ROWS = 20;
const COLS = 20;
const CELL = 20; // px
const BOARD_WIDTH = COLS * CELL;
const BOARD_HEIGHT = ROWS * CELL;
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
]; // head at index 0
const INITIAL_DIRECTION = { x: 1, y: 0 }; // moving right

function randPosition(excludePositions = []) {
  // random position not in excludePositions
  const keySet = new Set(excludePositions.map(p => `${p.x},${p.y}`));
  let pos;
  let attempts = 0;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    attempts++;
    if (attempts > 1000) break;
  } while (keySet.has(`${pos.x},${pos.y}`));
  return pos;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const directionRef = useRef(INITIAL_DIRECTION); // for stable access inside interval
  const [food, setFood] = useState(randPosition(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(140); // ms per move (lower = faster)
  const [score, setScore] = useState(0);

  // prevent reversing: store last move direction
  const lastMoveRef = useRef(INITIAL_DIRECTION);

  // update refs when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // keyboard input
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      const key = e.key;
      let newDir = null;
      if (key === "ArrowUp" || key === "w" || key === "W") newDir = { x: 0, y: -1 };
      if (key === "ArrowDown" || key === "s" || key === "S") newDir = { x: 0, y: 1 };
      if (key === "ArrowLeft" || key === "a" || key === "A") newDir = { x: -1, y: 0 };
      if (key === "ArrowRight" || key === "d" || key === "D") newDir = { x: 1, y: 0 };

      if (newDir) {
        // disallow reversing (x + lastMove.x === 0 && y + lastMove.y === 0)
        const last = lastMoveRef.current;
        if (newDir.x === -last.x && newDir.y === -last.y) {
          return;
        }
        setDirection(newDir);
        lastMoveRef.current = newDir;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setSnake(prev => {
        const dir = directionRef.current;
        const head = prev[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        // check wall collision
        if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
          setGameOver(true);
          return prev;
        }

        // check self collision
        const collided = prev.some(segment => segment.x === newHead.x && segment.y === newHead.y);
        if (collided) {
          setGameOver(true);
          return prev;
        }

        // move snake: add new head
        const newSnake = [newHead, ...prev];

        // check food
        if (newHead.x === food.x && newHead.y === food.y) {
          // eaten: increase score, spawn new food, optionally increase speed
          setScore(s => s + 1);
          const nextFood = randPosition(newSnake);
          setFood(nextFood);
          // optional: speed up slightly every few points
          if ((score + 1) % 5 === 0) {
            setSpeed(s => Math.max(60, s - 10));
          }
          return newSnake; // grow (don't remove tail)
        }

        // normal move: remove tail
        newSnake.pop();
        return newSnake;
      });
    }, speed);

    return () => clearInterval(id);
  }, [food, gameOver, speed, score]);

  // reset function
  const reset = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastMoveRef.current = INITIAL_DIRECTION;
    setFood(randPosition(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setSpeed(140);
  };

  // produce segment elements
  const snakeSegments = snake.map((seg, idx) => {
    const style = {
      left: seg.x * CELL + "px",
      top: seg.y * CELL + "px",
      width: CELL + "px",
      height: CELL + "px",
      borderRadius: idx === 0 ? "50% 40% 50% 40%" : "8px", // head slightly different
      zIndex: 2,
    };
    return <div key={`${seg.x}-${seg.y}-${idx}`} className="snake-seg" style={style} />;
  });

  const foodStyle = {
    left: food.x * CELL + (CELL * 0.15) + "px",
    top: food.y * CELL + (CELL * 0.15) + "px",
    width: CELL * 0.7 + "px",
    height: CELL * 0.7 + "px",
  };

  return (
    <div className="snake-page">
      <h1 className="snake-title">Snake</h1>

      <div className="snake-toprow">
        <div className="snake-score">Score: <strong>{score}</strong></div>
        <div className="snake-info">Use Arrow keys or WASD — don't reverse</div>
      </div>

      <div
        className="snake-board"
        style={{ width: BOARD_WIDTH + "px", height: BOARD_HEIGHT + "px" }}
        tabIndex={0}
      >
        { /* board background grid optional here */ }
        <div className="snake-playfield">
          {/* food */}
          <div className="food" style={foodStyle} />

          {/* snake */}
          {snakeSegments}
        </div>
      </div>

      {gameOver && (
        <div className="snake-overlay">
          <div className="snake-overlay-content">
            <h2>{score > 0 ? `Game Over — Score ${score}` : "Game Over"}</h2>
            <button className="snake-btn" onClick={reset}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
