// src/components/games/BrickBreaker/BrickBreaker.jsx
import React, { useRef, useEffect, useState } from "react";
import "./BrickBreaker.css";

export default function BrickBreaker() {
  const canvasRef = useRef(null);

  // visible UI state
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // runKey forces the whole effect (game) to restart when it changes
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // canvas size
    const W = 560;
    const H = 360;
    canvas.width = W;
    canvas.height = H;

    // paddle
    const paddleHeight = 12;
    const paddleWidth = 100;
    let paddleX = (W - paddleWidth) / 2;

    // ball
    const ballRadius = 9;
    let x = W / 2;
    let y = H - 40;

    // speed (base increases with level)
    const baseSpeed = 3 + (level - 1) * 0.6;
    let dx = baseSpeed;
    let dy = -baseSpeed;

    // bricks config
    const brickCols = 7;
    let brickRows = 3 + (level - 1); // more rows as level increases
    const brickPadding = 10;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 20;
    // compute brick width to fit nicely inside canvas
    const brickAreaWidth = W - brickOffsetLeft * 2;
    const brickWidth = Math.floor((brickAreaWidth - (brickCols - 1) * brickPadding) / brickCols);
    const brickHeight = 20;

    // input tracking
    let rightPressed = false;
    let leftPressed = false;

    // game variables local to this effect
    let bricks = [];
    let scoreLocal = 0;
    let animationId = null;

    // helper: build bricks
    function initBricks() {
      bricks = [];
      for (let c = 0; c < brickCols; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRows; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    }
    initBricks();

    // keyboard handlers
    function keyDownHandler(e) {
      if (e.key === "ArrowRight" || e.key === "Right") rightPressed = true;
      if (e.key === "ArrowLeft" || e.key === "Left") leftPressed = true;
    }
    function keyUpHandler(e) {
      if (e.key === "ArrowRight" || e.key === "Right") rightPressed = false;
      if (e.key === "ArrowLeft" || e.key === "Left") leftPressed = false;
    }

    // mouse/pointer paddle control (use bounding rect for correctness)
    function pointerMoveHandler(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      if (clientX == null) return;
      const relativeX = clientX - rect.left;
      if (relativeX > 0 && relativeX < W) paddleX = relativeX - paddleWidth / 2;
      // clamp
      if (paddleX < 0) paddleX = 0;
      if (paddleX > W - paddleWidth) paddleX = W - paddleWidth;
    }

    // attach listeners
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    window.addEventListener("mousemove", pointerMoveHandler);
    window.addEventListener("touchmove", pointerMoveHandler, { passive: true });

    // draw helpers
    function clear() {
      ctx.clearRect(0, 0, W, H);
    }

    // rounded rect helper with fallback
    function roundRect(ctx, x, y, w, h, r) {
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.closePath();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            b.x = brickX;
            b.y = brickY;
            ctx.fillStyle = `hsl(${(r * 45) % 360} 70% 55%)`; // nice modern color per row
            roundRect(ctx, brickX, brickY, brickWidth, brickHeight, 6);
          }
        }
      }
    }

    function drawBall() {
      ctx.beginPath();
      ctx.fillStyle = "#111";
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.fillStyle = "#222";
      roundRect(ctx, paddleX, H - paddleHeight - 12, paddleWidth, paddleHeight, 8);
    }

    function drawHUD() {
      ctx.font = "14px Inter, Arial, sans-serif";
      ctx.fillStyle = "#111";
      ctx.fillText(`Score: ${scoreLocal}`, 12, 26);
      ctx.fillText(`Level: ${level}`, W - 90, 26);
    }

    // collision detection
    function collisionDetection() {
      // bricks
      for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              scoreLocal += 10;
              setScore(scoreLocal); // update visible score
              // check cleared
              let cleared = true;
              for (let cc = 0; cc < brickCols; cc++) {
                for (let rr = 0; rr < brickRows; rr++) {
                  if (bricks[cc][rr].status === 1) {
                    cleared = false;
                    break;
                  }
                }
                if (!cleared) break;
              }
              if (cleared) {
                // advance level cleanly: stop current loop, bump level & runKey to restart
                cancelAnimationFrame(animationId);
                // set the new level (use functional update to avoid stale)
                setTimeout(() => {
                  setLevel((prev) => prev + 1);
                  setRunKey((k) => k + 1);
                }, 60);
                return; // exit collisionDetection early because bricks changed
              }
            }
          }
        }
      }
    }

    // improved paddle collision test to avoid skipping past paddle:
    function handlePaddleCollision() {
      const paddleTopY = H - paddleHeight - 12; // same we drew
      // check next position (y + dy) crosses paddleTopY line and x is within paddle horizontally
      if (y + dy > paddleTopY - ballRadius && y <= paddleTopY + ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          // calculate reflection, we can add angle based on where it hits
          const hitPos = (x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2); // -1..1
          const maxAngle = Math.PI / 3; // 60 degrees
          const angle = hitPos * maxAngle;
          const speed = Math.hypot(dx, dy);
          dx = speed * Math.sin(angle);
          dy = -Math.abs(speed * Math.cos(angle));
          return true;
        }
      }
      return false;
    }

    // main loop
    function draw() {
      animationId = requestAnimationFrame(draw);
      clear();
      drawBricks();
      drawBall();
      drawPaddle();
      drawHUD();
      collisionDetection();

      // walls
      if (x + dx > W - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else {
        // paddle / floor
        const didPaddle = handlePaddleCollision();
        if (!didPaddle && y + dy > H - ballRadius - 6) {
          // fell past paddle -> game over
          cancelAnimationFrame(animationId);
          setGameOver(true);
          return;
        }
      }

      // input movement
      if (rightPressed && paddleX < W - paddleWidth) paddleX += 6;
      if (leftPressed && paddleX > 0) paddleX -= 6;

      // update ball
      x += dx;
      y += dy;
    }

    // start
    draw();

    // cleanup
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("mousemove", pointerMoveHandler);
      window.removeEventListener("touchmove", pointerMoveHandler);
      if (animationId) cancelAnimationFrame(animationId);
    };
    // run effect when runKey changes (restarts game), or when level changes (we restart from UI)
  }, [runKey, level]); // effect will re-run after you change runKey or level

  // Play Again / Reset behavior — restart fresh
  function handlePlayAgain() {
    setScore(0);
    setGameOver(false);
    // set level back to 1 if you want fresh new game, otherwise keep same level
    setLevel(1);
    setRunKey((k) => k + 1);
  }

  return (
    <div className="brick-breaker-center">
      <div className="brick-breaker-wrapper">
        <canvas ref={canvasRef} className="brick-canvas" />
      </div>

      {gameOver && (
        <div className="bb-overlay">
          <div className="bb-overlay-card">
            <h2>Game Over</h2>
            <p>Score: {score}</p>
            <div className="bb-buttons">
              <button onClick={handlePlayAgain}>Play Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
