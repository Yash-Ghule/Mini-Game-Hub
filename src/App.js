import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHub from './components/GameHub';
import TicTacToe from './components/Games/tic-tac-toe/App';
import RockPaperScissors from './components/Games/rock-paper-scissors/RockPaperScissors';
import SnakeGame from './components/Games/snake/SnakeGame';
import BrickBreaker from './components/Games/BrickBreaker/BrickBreaker';
import MyFly from './components/Games/MyFly/MyFly';

function App() {
  return (
    <Router basename="/mini-game-hub">
      <Routes>
        <Route path="/" element={<GameHub />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
        <Route path="/snake" element={<SnakeGame />} />
        <Route path="/BrickBreaker" element={<BrickBreaker />} />
        <Route path="/MyFly" element={<MyFly />} />
      </Routes>
    </Router>
  );
}

export default App;
