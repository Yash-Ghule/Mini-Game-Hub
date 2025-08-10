import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHub from './components/GameHub';
import TicTacToe from './components/Games/tic-tac-toe/App';
import RockPaperScissors from './components/Games/rock-paper-scissors/RockPaperScissors';


function App() {
  return (
    <Router basename="/mini-game-hub">
      <Routes>
        <Route path="/" element={<GameHub />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
      </Routes>
    </Router>
  );
}

export default App;
