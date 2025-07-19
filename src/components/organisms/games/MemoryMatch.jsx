import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const MemoryMatch = ({ onScoreUpdate }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  // Educational card sets
  const cardSets = {
    1: { // Countries and Capitals
      theme: "Countries & Capitals",
      pairs: [
        { id: 1, content: "France", match: "Paris" },
        { id: 2, content: "Japan", match: "Tokyo" },
        { id: 3, content: "Brazil", match: "Brasília" },
        { id: 4, content: "Egypt", match: "Cairo" },
        { id: 5, content: "Australia", match: "Canberra" },
        { id: 6, content: "India", match: "New Delhi" }
      ]
    },
    2: { // Chemical Elements
      theme: "Elements & Symbols",
      pairs: [
        { id: 7, content: "Hydrogen", match: "H" },
        { id: 8, content: "Oxygen", match: "O" },
        { id: 9, content: "Carbon", match: "C" },
        { id: 10, content: "Nitrogen", match: "N" },
        { id: 11, content: "Iron", match: "Fe" },
        { id: 12, content: "Gold", match: "Au" },
        { id: 13, content: "Silver", match: "Ag" },
        { id: 14, content: "Sodium", match: "Na" }
      ]
    },
    3: { // Math Operations
      theme: "Math Facts",
      pairs: [
        { id: 15, content: "7 × 8", match: "56" },
        { id: 16, content: "9 × 6", match: "54" },
        { id: 17, content: "8 × 7", match: "56" },
        { id: 18, content: "12 ÷ 3", match: "4" },
        { id: 19, content: "15 ÷ 5", match: "3" },
        { id: 20, content: "6²", match: "36" },
        { id: 21, content: "8²", match: "64" },
        { id: 22, content: "√25", match: "5" },
        { id: 23, content: "√49", match: "7" }
      ]
    }
  };

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameCompleted]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      completeGame();
    }
  }, [matchedCards, cards]);

  const initializeGame = (level = currentLevel) => {
    const cardSet = cardSets[level];
    if (!cardSet) return;

    const gameCards = [];
    cardSet.pairs.forEach((pair, index) => {
      gameCards.push({
        id: `${pair.id}-a`,
        content: pair.content,
        matchId: pair.id,
        isMatched: false
      });
      gameCards.push({
        id: `${pair.id}-b`,
        content: pair.match,
        matchId: pair.id,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameCompleted(false);
    setGameStarted(false);
  };

  useEffect(() => {
    initializeGame();
  }, [currentLevel]);

  const startGame = () => {
    setGameStarted(true);
  };

  const flipCard = (cardId) => {
    if (!gameStarted || gameCompleted) return;
    if (flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;
    if (flippedCards.length >= 2) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlipped);
    }
  };

  const checkMatch = (flipped) => {
    const [card1Id, card2Id] = flipped;
    const card1 = cards.find(c => c.id === card1Id);
    const card2 = cards.find(c => c.id === card2Id);

    if (card1.matchId === card2.matchId) {
      // Match found
      setTimeout(() => {
        setMatchedCards(prev => [...prev, card1Id, card2Id]);
        setFlippedCards([]);
        
        const matchScore = Math.max(50 - moves * 2, 10);
        setScore(prev => prev + matchScore);
        toast.success(`Match found! +${matchScore} points`);
      }, 1000);
    } else {
      // No match
      setTimeout(() => {
        setFlippedCards([]);
      }, 1500);
    }
  };

  const completeGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
    
    // Bonus for efficiency
    const timeBonus = Math.max(300 - timeElapsed * 2, 0);
    const moveBonus = Math.max(200 - moves * 5, 0);
    const totalBonus = timeBonus + moveBonus;
    
    setScore(prev => prev + totalBonus);
    toast.success(`Level completed! +${totalBonus} bonus points!`);
  };

  const nextLevel = () => {
    if (currentLevel < Object.keys(cardSets).length) {
      setCurrentLevel(prev => prev + 1);
    } else {
      toast.success("All levels completed! Master of Memory!");
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const cardSet = cardSets[currentLevel];

  if (!gameStarted && !gameCompleted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Memory Match Mania
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Match related pairs by flipping cards. Test your memory and learn at the same time!
        </p>
        <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="font-semibold text-blue-900 mb-2">
            Level {currentLevel}: {cardSet?.theme}
          </h4>
          <p className="text-blue-800 text-sm">
            {cardSet?.pairs.length} pairs to match
          </p>
        </div>
        <Button onClick={startGame} size="lg" variant="primary">
          <ApperIcon name="Play" className="w-5 h-5 mr-2" />
          Start Level {currentLevel}
        </Button>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-6 rounded-xl mb-6">
          <h3 className="text-2xl font-bold mb-2 font-display">Level Complete!</h3>
          <p className="text-xl">Score: {score}</p>
          <p className="text-accent-100">Time: {formatTime(timeElapsed)}</p>
          <p className="text-accent-100">Moves: {moves}</p>
        </div>
        
        <div className="space-x-3">
          {currentLevel < Object.keys(cardSets).length && (
            <Button onClick={nextLevel} variant="secondary" size="lg">
              <ApperIcon name="ArrowRight" className="w-5 h-5 mr-2" />
              Next Level
            </Button>
          )}
          <Button onClick={resetGame} variant="primary" size="lg">
            <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Stats */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 font-display">
            Level {currentLevel}: {cardSet?.theme}
          </h3>
          <div className="text-lg font-bold text-accent-600">
            Score: {score}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Time</div>
            <div className="text-lg font-bold text-gray-900">{formatTime(timeElapsed)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Moves</div>
            <div className="text-lg font-bold text-gray-900">{moves}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Matches</div>
            <div className="text-lg font-bold text-gray-900">
              {matchedCards.length / 2} / {cards.length / 2}
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {cards.map((card) => {
              const isFlipped = flippedCards.includes(card.id);
              const isMatched = matchedCards.includes(card.id);
              
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: isFlipped || isMatched ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => flipCard(card.id)}
                  className="aspect-square relative cursor-pointer"
                >
                  <div className={`memory-card w-full h-full ${isFlipped || isMatched ? "flipped" : ""}`}>
                    {isFlipped || isMatched ? (
                      <div className="w-full h-full bg-white border-2 border-primary-500 rounded-lg flex items-center justify-center p-2">
                        <span className="text-center text-sm font-medium text-gray-900 leading-tight">
                          {card.content}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Brain" className="w-8 h-8 text-white" />
                      </div>
                    )}
                    
                    {isMatched && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center"
                      >
                        <ApperIcon name="Check" className="w-8 h-8 text-green-600" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatch;