import React, { useState, useEffect } from 'react';
import './SimonGame.css';

import redSound from '../sounds/red.mp3';
import greenSound from '../sounds/green.mp3';
import blueSound from '../sounds/blue.mp3';
import yellowSound from '../sounds/yellow.mp3';

const SimonGame = () => {
  const colors = ['red', 'green', 'blue', 'yellow'];

  const sounds = {
    red: new Audio(redSound),
    green: new Audio(greenSound),
    blue: new Audio(blueSound),
    yellow: new Audio(yellowSound),
  };

  const [gameSequence, setGameSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [message, setMessage] = useState('Click Start to Play!');
  const [isGameOver, setIsGameOver] = useState(false);

  const startGame = () => {
    setGameSequence([]);
    setUserSequence([]);
    setMessage('Watch the sequence...');
    setIsGameOver(false);
    setIsUserTurn(false);
    addNewColor();
  };

  const addNewColor = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setGameSequence((prev) => [...prev, randomColor]);
    setUserSequence([]);
  };

  const handleColorClick = (color) => {
    if (isUserTurn && !isGameOver) {
      const newUserSequence = [...userSequence, color];
      setUserSequence(newUserSequence);

      playSound(color);

      if (gameSequence[newUserSequence.length - 1] !== color) {
        setMessage('Game Over! Click Start to try again.');
        setIsGameOver(true);
      } else if (newUserSequence.length === gameSequence.length) {
        setMessage('Good job! Watch the next sequence.');
        setIsUserTurn(false);
        setTimeout(() => addNewColor(), 1000);
      }
    }
  };

  const playSound = (color) => {
    const sound = sounds[color];
    sound.currentTime = 0;
    sound.play();
  };

  useEffect(() => {
    if (!isUserTurn && gameSequence.length > 0) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < gameSequence.length) {
          flashColor(gameSequence[i]);
          i++;
        } else {
          clearInterval(intervalId);
          setIsUserTurn(true);
          setMessage('Your turn! Repeat the sequence.');
        }
      }, 600);

      return () => clearInterval(intervalId);
    }
  }, [gameSequence, isUserTurn]);

  const flashColor = (color) => {
    const colorElement = document.getElementById(color);
    
    if (colorElement) {
      colorElement.classList.add('active');
      playSound(color);

      setTimeout(() => {
        colorElement.classList.remove('active');
      }, 400);
    }
  };

  return (
    <div className="simon-game">
      <h1>Simon Says</h1>
      <div className="color-buttons">
        {colors.map((color) => (
          <div
            key={color}
            id={color}
            className={`color-button ${color}`}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
      <p>{message}</p>
      <button onClick={startGame} disabled={!isGameOver && gameSequence.length > 0}>
        Start Game
      </button>
    </div>
  );
};

export default SimonGame;
