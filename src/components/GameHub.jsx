import React from 'react';

function GameHub() {
  return (
    <div>
      <h1>🎮 Mini-Game Hub 🎮</h1>
      <div className="game-list">
        <div className="game-card">
          <h2>Tic-Tac-Toe</h2>
          <button disabled>Coming Soon</button>
        </div>
        <div className="game-card">
          <h2>Rock-Paper-Scissors</h2>
          <button disabled>Coming Soon</button>
        </div>
        <div className="game-card">
          <h2>Snake Game</h2>
          <button disabled>Coming Soon</button>
        </div>
        <div className="game-card">
          <h2>Flappy Bird Clone</h2>
          <button disabled>Coming Soon</button>
        </div>
        <div className="game-card">
          <h2>Brick Breaker</h2>
          <button disabled>Coming Soon</button>
        </div>
        <div className="game-card">
          <h2>Shooting Game</h2>
          <button disabled>Coming Soon</button>
        </div>
        <div className="game-card">
          <h2>Bike Dodge Game</h2>
          <button disabled>Coming Soon</button>
        </div>
      </div>
    </div>
  );
}

export default GameHub;
