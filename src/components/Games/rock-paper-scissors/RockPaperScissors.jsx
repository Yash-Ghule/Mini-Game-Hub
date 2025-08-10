import React, { useState } from "react";
import "./RockPaperScissors.css";

const RockPaperScissors = () => {
  const choices = ["rock", "paper", "scissors"];
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const getImage = (choice) => {
    return process.env.PUBLIC_URL + `/images/rock-paper-scissors/${choice}.png`;
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return "It's a Draw!";
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "You Win!";
    }
    return "You Lose!";
  };

  const handlePlayerChoice = (choice) => {
    if (gameOver) return;
    const computer = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(determineWinner(choice, computer));
    setGameOver(true);
  };

  const resetGame = () => {
    setPlayerChoice("");
    setComputerChoice("");
    setResult("");
    setGameOver(false);
  };

  return (
    <div className="rps-container">
      <h1>Rock Paper Scissors</h1>

      <div className="rps-players">
  <div className="rps-player">
    <div className="circle">
      {computerChoice && <img src={getImage(computerChoice)} alt={computerChoice} />}
    </div>
    <p className="player-label">Bot</p>
  </div>

  <div className="rps-player">
    <div className="circle">
      {playerChoice && <img src={getImage(playerChoice)} alt={playerChoice} />}
    </div>
    <p className="player-label">Player</p>

    <div className="rps-buttons">
      {choices.map((choice) => (
        <button key={choice} onClick={() => handlePlayerChoice(choice)}>
          {choice.charAt(0).toUpperCase() + choice.slice(1)}
        </button>
      ))}
    </div>
  </div>
</div>


      {gameOver && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>{result}</h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
