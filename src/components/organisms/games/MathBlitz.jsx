import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const MathBlitz = ({ onScoreUpdate }) => {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      generateProblem();
    }
  }, [gameStarted, difficulty]);

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, gameOver]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    // Increase difficulty every 10 problems
    if (problemsCompleted > 0 && problemsCompleted % 10 === 0) {
      setDifficulty(prev => Math.min(prev + 1, 5));
    }
  }, [problemsCompleted]);

  const generateProblem = () => {
    let num1, num2, operator, answer;
    
    const maxNum = Math.min(10 * difficulty, 50);
    
    switch (difficulty) {
      case 1:
        // Addition only, small numbers
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = "+";
        answer = num1 + num2;
        break;
      
      case 2:
        // Addition and subtraction
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operator = Math.random() < 0.5 ? "+" : "-";
        answer = operator === "+" ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
        if (operator === "-") {
          [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
        }
        break;
      
      case 3:
        // Add multiplication
        if (Math.random() < 0.3) {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          operator = "×";
          answer = num1 * num2;
        } else {
          num1 = Math.floor(Math.random() * 25) + 1;
          num2 = Math.floor(Math.random() * 25) + 1;
          operator = Math.random() < 0.5 ? "+" : "-";
          answer = operator === "+" ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
          if (operator === "-") {
            [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
          }
        }
        break;
      
      case 4:
        // Add division
        if (Math.random() < 0.2) {
          num2 = Math.floor(Math.random() * 10) + 2;
          answer = Math.floor(Math.random() * 10) + 1;
          num1 = num2 * answer;
          operator = "÷";
        } else if (Math.random() < 0.4) {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          operator = "×";
          answer = num1 * num2;
        } else {
          num1 = Math.floor(Math.random() * 30) + 1;
          num2 = Math.floor(Math.random() * 30) + 1;
          operator = Math.random() < 0.5 ? "+" : "-";
          answer = operator === "+" ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
          if (operator === "-") {
            [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
          }
        }
        break;
      
      default:
        // Mixed operations, larger numbers
        const ops = ["+", "-", "×", "÷"];
        operator = ops[Math.floor(Math.random() * ops.length)];
        
        switch (operator) {
          case "+":
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            break;
          case "-":
            num1 = Math.floor(Math.random() * 50) + 25;
            num2 = Math.floor(Math.random() * 25) + 1;
            answer = num1 - num2;
            break;
          case "×":
            num1 = Math.floor(Math.random() * 15) + 1;
            num2 = Math.floor(Math.random() * 15) + 1;
            answer = num1 * num2;
            break;
          case "÷":
            num2 = Math.floor(Math.random() * 12) + 2;
            answer = Math.floor(Math.random() * 15) + 1;
            num1 = num2 * answer;
            break;
        }
    }
    
    setCurrentProblem({ num1, num2, operator, answer });
    setUserAnswer("");
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
    setGameStarted(true);
    setGameOver(false);
    setDifficulty(1);
    setProblemsCompleted(0);
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    toast.success(`Game Over! Final score: ${score}`);
  };

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === "") return;

    const answer = parseInt(userAnswer);
    if (answer === currentProblem.answer) {
      const basePoints = difficulty * 10;
      const streakBonus = Math.min(streak * 2, 50);
      const totalPoints = basePoints + streakBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setProblemsCompleted(prev => prev + 1);
      
      toast.success(`Correct! +${totalPoints} points (${streakBonus} streak bonus)`);
      generateProblem();
    } else {
      setStreak(0);
      toast.error(`Wrong! The answer was ${currentProblem.answer}`);
      generateProblem();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitAnswer();
    }
  };

  if (!gameStarted && !gameOver) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Math Blitz
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Solve math problems as quickly as possible! Difficulty increases every 10 problems.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="font-semibold text-blue-900 mb-2">Game Rules:</h4>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• 60 seconds to solve as many problems as possible</li>
            <li>• Consecutive correct answers build a streak bonus</li>
            <li>• Difficulty increases every 10 problems</li>
            <li>• Higher difficulty = more points per problem</li>
          </ul>
        </div>
        <Button onClick={startGame} size="lg" variant="primary">
          <ApperIcon name="Play" className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-6 rounded-xl mb-6">
          <h3 className="text-2xl font-bold mb-2 font-display">Game Complete!</h3>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-accent-100">Problems Completed: {problemsCompleted}</p>
          <p className="text-accent-100">Highest Difficulty: {difficulty}</p>
        </div>
        
        <Button onClick={startGame} variant="primary" size="lg">
          <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
          Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-sm text-gray-600">Time</div>
          <div className={`text-xl font-bold ${timeLeft <= 10 ? "text-red-500" : "text-gray-900"}`}>
            {timeLeft}s
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-sm text-gray-600">Streak</div>
          <div className="text-xl font-bold text-primary-600">{streak}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-sm text-gray-600">Level</div>
          <div className="text-xl font-bold text-secondary-600">{difficulty}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-sm text-gray-600">Problems</div>
          <div className="text-xl font-bold text-accent-600">{problemsCompleted}</div>
        </div>
      </div>

      {/* Math Problem */}
      <div className="bg-white rounded-lg p-8 mb-6 shadow-md">
        <AnimatePresence mode="wait">
          {currentProblem && (
            <motion.div
              key={`${currentProblem.num1}-${currentProblem.operator}-${currentProblem.num2}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <div className="math-problem mb-6">
                {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
              </div>
              
              <div className="max-w-xs mx-auto">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Your answer"
                  className="text-center text-2xl font-bold h-16"
                  autoFocus
                />
              </div>
              
              <Button
                onClick={submitAnswer}
                variant="primary"
                size="lg"
                className="mt-6"
                disabled={!userAnswer}
              >
                <ApperIcon name="ArrowRight" className="w-5 h-5 mr-2" />
                Submit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Info */}
      <div className="bg-white rounded-lg p-4 shadow-md text-center">
        <div className="text-sm text-gray-600 mb-2">
          Next level in {10 - (problemsCompleted % 10)} problems
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((problemsCompleted % 10) / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MathBlitz;