# 🎮 Mini-Game Hub

A collection of fun, browser-based mini-games built with React.

## 📝 About the Hub
Mini-Game Hub is an expanding library of interactive games you can play directly in your browser.  
Each game is built as a React component, making the hub modular and easy to extend.

---

## 1️⃣ Tic-Tac-Toe
**Tech Stack:** React, CSS Modules  
**How to Play:** Two players take turns placing X and O on a 3x3 grid. The first to align three of their marks in a row (horizontally, vertically, or diagonally) wins.  
**Draw Condition:** If all squares are filled and no player has won, the game ends in a draw.  

**Challenges Faced:** Implementing win detection logic efficiently and integrating the game into the hub's routing system.

---

## 2️⃣ Rock Paper Scissors
**Tech Stack:** React, CSS  
**How to Play:**  
1. Click one of the buttons — Rock, Paper, or Scissors.  
2. The bot will instantly make its choice.  
3. The winner is decided based on classic Rock-Paper-Scissors rules.

**Challenges Faced:** Positioning UI elements for a balanced layout and implementing the animated result overlay similar to Tic-Tac-Toe.

---

## 3️⃣ Snake Game  
**Tech Stack:** React, CSS, JavaScript (Canvas API)  
**How to Play:**  
1. Use the arrow keys (⬆️⬇️⬅️➡️) to move the snake around the board.  
2. Eat the food squares to grow longer and score points.  
3. Avoid running into the walls or your own tail — that ends the game.  

**Challenges Faced:**  
- Implementing smooth grid-based movement while keeping the snake responsive.  
- Handling collision detection for both walls and self-intersections.  
- Balancing game speed for both beginners and experienced players.

---

## 4️⃣ Brick Breaker  
**Tech Stack:** React, CSS, JavaScript (Canvas API)  
**How to Play:**  
1. Use the left and right arrow keys to move the paddle.  
2. Bounce the ball to break colored bricks.  
3. Each brick type gives different points.  
4. Clear all bricks to advance to the next level.  
5. Lose the ball and it’s game over.

**Challenges Faced:**  
- Ensuring smooth collision detection between the ball, paddle, and bricks.  
- Implementing level progression without breaking the game loop.  
- Keeping performance smooth in the Canvas render loop.

---

## 5️⃣ MyFly 🐝   
**Tech Stack:** React, CSS  
**How to Play:**  
1. Tap/Click or press the spacebar to make the bee flap its wings and fly upward.  
2. Navigate through gaps between kitchen pipes (obstacles).  
3. Score a point for each successful pass through a gap.  
4. The game ends if the bee hits a pipe or falls to the ground.  

**Challenges Faced:**  
- Replacing the default circle with a bee icon for smoother gameplay visuals.  
- Setting a kitchen-themed background image and aligning it with the play area.  
- Balancing difficulty by randomizing gap positions and adjusting pipe spawn rate without making the game impossible.
