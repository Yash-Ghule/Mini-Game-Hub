import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHub from './components/GameHub';

function App() {
  return (
    <Router basename="/mini-game-hub">
      <Routes>
        <Route path="/" element={<GameHub />} />
        {/* Future game routes will go here */}
      </Routes>
    </Router>
  );
}

export default App;
