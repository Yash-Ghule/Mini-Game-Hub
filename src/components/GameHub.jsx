import React from 'react';
import { Link } from 'react-router-dom';
import './GameHub.css';

function GameHub() {
  const games = [
    { name: 'Tic-Tac-Toe', path: '/tic-tac-toe', img: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Tic_tac_toe.svg', ready: true },
    { name: 'Rock-Paper-Scissors', path: "/rock-paper-scissors", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Rock-paper-scissors.svg/640px-Rock-paper-scissors.svg.png', ready: true },
    { name: 'Snake Game', path: '/snake', img: process.env.PUBLIC_URL + '/images/snake/snake.png', ready: true },
    { name: 'MyFly', path: '/myfly', img: process.env.PUBLIC_URL + '/images/myfly/bee.png', ready: true },
    { name: 'Brick Breaker', path: '/BrickBreaker', img: process.env.PUBLIC_URL + '/images/brick-breaker/brick-breaker.png', ready: true },
    { name: 'Shooting Game', path: '/shooting', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Space_Invaders_arcade_game.jpg', ready: false },
    { name: 'Bike Dodge Game', path: '/bike-dodge', img: 'https://cdn.pixabay.com/photo/2014/04/03/10/32/motorbike-309342_1280.png', ready: false },
    { name: 'Simon Says', path: '/simon-says', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Simon_Electronic_Game.jpg/640px-Simon_Electronic_Game.jpg', ready: false },
    { name: 'Mystery Wheel Game', path: '/mystery-wheel', img: 'https://cdn.pixabay.com/photo/2012/04/13/12/19/roulette-32405_1280.png', ready: false },
  ];

  return (
    <div className="game-hub">
      <h1>🎮 Mini-Game Hub 🎮</h1>
      <div className="game-list">
        {games.map((game, index) => (
          <div className="game-card" key={index}>
            <img src={game.img} alt={game.name} className="game-img" />
            <h2>{game.name}</h2>
            {game.ready ? (
              <Link to={game.path} className="play-button">Play</Link>
            ) : (
              <button disabled className="coming-soon">Coming Soon</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameHub;
