import React, { useEffect, useRef, useState } from "react";
import "./MyFly.css";

export default function MyFly() {
  // Canvas size (bigger, centered)
  const CANVAS_W = 800;
  const CANVAS_H = 500;

  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // game state for UI
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // world refs (don’t cause re-renders every frame)
  const birdRef = useRef({ x: 120, y: CANVAS_H / 2, r: 14, v: 0 });
  const pipesRef = useRef([]);
  const lastSpawnXRef = useRef(CANVAS_W); // where the last pipe spawned

  // tuning
  const GRAVITY = 0.45;
  const LIFT = -8.5;
  const DRAG = 0.985; // slight damping so jumps aren’t too snappy
  const PIPE_SPEED = 2.6;
  const PIPE_WIDTH = 56; // thinner, uniform
  const PIPE_GAP = 160;  // always passable
  const MIN_TOP_MARGIN = 60;
  const MIN_BOTTOM_MARGIN = 80;
  const MIN_SPAWN_GAP = 280; // distance before next pipe can spawn

  function resetGame() {
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    birdRef.current = { x: 120, y: CANVAS_H / 2, r: 14, v: 0 };
    pipesRef.current = [];
    lastSpawnXRef.current = CANVAS_W;
  }

  // input
  function onFlap() {
    if (!gameStarted) setGameStarted(true);
    if (gameOver) {
      resetGame();
      return;
    }
    birdRef.current.v = LIFT;
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.code === "Space") {
        e.preventDefault();
        onFlap();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameStarted, gameOver]);

  // main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawBackground = () => {
      // simple cartoony kitchen-ish gradient so there’s no external image dependency
      const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      g.addColorStop(0, "#bfe2f2");
      g.addColorStop(1, "#d8f1ff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // “floor” strip for a bit of depth
      ctx.fillStyle = "#f0d9b5";
      ctx.fillRect(0, CANVAS_H - 40, CANVAS_W, 40);
    };

    const drawBird = () => {
      const b = birdRef.current;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd400"; // yellow
      ctx.fill();
      // small eye
      ctx.beginPath();
      ctx.arc(b.x + 5, b.y - 4, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();
    };

    const spawnPipeIfNeeded = () => {
      const pipes = pipesRef.current;
      if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < CANVAS_W - MIN_SPAWN_GAP
      ) {
        const maxTop = CANVAS_H - PIPE_GAP - MIN_BOTTOM_MARGIN;
        const top = Math.max(
          MIN_TOP_MARGIN,
          Math.min(
            maxTop,
            Math.floor(Math.random() * (maxTop - MIN_TOP_MARGIN + 1)) +
              MIN_TOP_MARGIN
          )
        );
        pipes.push({
          x: CANVAS_W,
          top,
          bottom: top + PIPE_GAP,
          counted: false,
        });
        lastSpawnXRef.current = CANVAS_W;
      }
    };

    const updateWorld = () => {
      const b = birdRef.current;

      if (gameStarted && !gameOver) {
        // physics
        b.v += GRAVITY;
        b.v *= DRAG;
        // clamp velocity a bit
        if (b.v > 10) b.v = 10;
        if (b.v < -12) b.v = -12;
        b.y += b.v;

        // pipes move
        pipesRef.current.forEach((p) => (p.x -= PIPE_SPEED));
        // remove offscreen
        pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_WIDTH > 0);

        // spawn
        spawnPipeIfNeeded();

        // collisions
        if (b.y - b.r <= 0 || b.y + b.r >= CANVAS_H - 40) {
          setGameOver(true);
        }
        for (const p of pipesRef.current) {
          const withinX = b.x + b.r > p.x && b.x - b.r < p.x + PIPE_WIDTH;
          const outsideGap = b.y - b.r < p.top || b.y + b.r > p.bottom;
          if (withinX && outsideGap) {
            setGameOver(true);
            break;
          }
          // score when bird fully passes the pipe
          if (!p.counted && b.x > p.x + PIPE_WIDTH) {
            p.counted = true;
            setScore((s) => s + 1);
          }
        }
      }
    };

    const drawPipes = () => {
      const pipes = pipesRef.current;
      pipes.forEach((p) => {
        // uniform thin rectangles (cartoon green)
        ctx.fillStyle = "#2e7d32";
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.top);
        ctx.fillRect(p.x, p.bottom, PIPE_WIDTH, CANVAS_H - p.bottom - 40);

        // small darker cap to make them look less “broken”
        ctx.fillStyle = "#1b5e20";
        ctx.fillRect(p.x, p.top - 8, PIPE_WIDTH, 8);
        ctx.fillRect(p.x, p.bottom, PIPE_WIDTH, 8);
      });
    };

    const drawHUD = () => {
      ctx.fillStyle = "#003";
      ctx.font = "20px Inter, Arial, sans-serif";
      ctx.fillText(`Score: ${score}`, 16, 28);

      if (!gameStarted && !gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.font = "26px Inter, Arial, sans-serif";
        ctx.fillText(
          "Press SPACE to fly",
          CANVAS_W / 2 - 130,
          CANVAS_H / 2 + 8
        );
      }
    };

    const loop = () => {
      drawBackground();
      updateWorld();
      drawPipes();
      drawBird();
      drawHUD();

      if (gameOver) {
        // keep one last frame drawn; overlay UI is separate DOM
        cancelAnimationFrame(rafRef.current);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameStarted, gameOver, score]);

  return (
    <div className="myfly-root">
      <div className="myfly-stage">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="myfly-canvas"
        />
        {gameOver && (
          <div className="myfly-overlay">
            <div className="myfly-overtext">
              <div className="title">Game Over</div>
              <div className="subtitle">Score: {score}</div>
              <button
                aria-label="Restart"
                className="restart-circle"
                onClick={resetGame}
                title="Restart (Space)"
              >
                ⟳
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="hint">Space: jump · Space on Game Over: restart</div>
    </div>
  );
}
