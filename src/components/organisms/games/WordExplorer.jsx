import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const WordExplorer = ({ onScoreUpdate, selectedDifficulty = "Medium" }) => {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
// Word dictionaries by difficulty
  const wordSets = {
    Easy: {
      words: {
        "CAT": "A small domesticated carnivorous mammal",
        "DOG": "A domesticated carnivorous mammal",
        "SUN": "The star at the center of our solar system",
        "CAR": "A wheeled motor vehicle",
        "RUN": "To move swiftly on foot",
        "BIG": "Of considerable size or extent",
        "RED": "The color of blood or fire",
        "BAD": "Poor in quality or lower in standard"
      },
      letters: ["C", "A", "T", "D", "O", "G", "S", "U", "N", "R", "B", "I"],
      timeLimit: 240
    },
    Medium: {
      words: {
        "CAT": "A small domesticated carnivorous mammal",
        "DOG": "A domesticated carnivorous mammal that typically has a long snout",
        "REACT": "To respond or behave in a particular way in response to something",
        "CODE": "A system of words, letters, figures, or symbols used to represent others",
        "GAME": "A form of play or sport with rules",
        "PLAY": "To engage in activity for enjoyment and recreation",
        "WORD": "A single distinct meaningful element of speech or writing",
        "MIND": "The element of a person that enables them to be aware",
        "SMART": "Having or showing intelligence",
        "CREATE": "To bring something into existence"
      },
      letters: ["C", "A", "T", "R", "E", "D", "O", "G", "M", "I", "N", "L", "S", "P"],
      timeLimit: 180
    },
    Hard: {
      words: {
        "REACT": "To respond or behave in a particular way in response to something",
        "CODE": "A system of words, letters, figures, or symbols used to represent others",
        "LETTER": "A character representing one or more of the sounds used in speech",
        "LEARN": "To acquire knowledge or skills through experience or study",
        "BRAIN": "An organ that serves as the center of the nervous system",
        "THINK": "To have a particular opinion, belief, or idea about someone or something",
        "CREATE": "To bring something into existence",
        "EXPLORE": "To investigate, study, or analyze",
        "DISCOVER": "To find information, a place, or an object for the first time",
        "CHALLENGE": "A call to take part in a contest or competition",
        "STRATEGY": "A plan of action designed to achieve a goal",
        "BRILLIANT": "Exceptionally clever or talented"
      },
      letters: ["C", "H", "A", "L", "L", "E", "N", "G", "R", "S", "T", "Y", "B", "I", "D", "O"],
      timeLimit: 120
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

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

const initializeGame = () => {
    const currentWordSet = wordSets[difficulty];
    const shuffled = [...currentWordSet.letters].sort(() => Math.random() - 0.5);
    setLetters(shuffled.slice(0, 12));
    setSelectedLetters([]);
    setCurrentWord("");
    setFoundWords([]);
    setScore(0);
    setTimeLeft(currentWordSet.timeLimit);
    setGameStarted(false);
    setGameOver(false);
  };

const startGame = () => {
    setGameStarted(true);
    setShowDifficultySelect(false);
  };

  const selectDifficulty = (selectedDiff) => {
    setDifficulty(selectedDiff);
    setShowDifficultySelect(false);
    setTimeout(() => initializeGame(), 100);
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    toast.success(`Game Over! Final score: ${score}`);
  };

  const selectLetter = (index) => {
    if (!gameStarted || gameOver || selectedLetters.includes(index)) return;
    
    const newSelected = [...selectedLetters, index];
    setSelectedLetters(newSelected);
    setCurrentWord(prev => prev + letters[index]);
  };

  const clearWord = () => {
    setSelectedLetters([]);
    setCurrentWord("");
  };

  const submitWord = () => {
    if (currentWord.length < 3) {
      toast.warning("Words must be at least 3 letters long!");
      return;
    }

    if (foundWords.includes(currentWord)) {
      toast.warning("Word already found!");
      clearWord();
      return;
    }

const currentWordSet = wordSets[difficulty];
    if (currentWordSet.words[currentWord]) {
      const baseScore = currentWord.length * 10;
      const difficultyMultiplier = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 1.5 : 2;
      const wordScore = Math.round(baseScore * difficultyMultiplier);
      setScore(prev => prev + wordScore);
      setFoundWords(prev => [...prev, currentWord]);
      toast.success(`+${wordScore} points! ${currentWordSet.words[currentWord]}`);
      clearWord();
    } else {
      toast.error("Not a valid word!");
      clearWord();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

if (showDifficultySelect) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Word Explorer
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Form words using the available letters. Longer words earn more points!
        </p>
        
        <div className="bg-white rounded-lg p-6 mb-6 max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 mb-4">Choose Difficulty:</h4>
          <div className="space-y-3">
            {Object.entries(wordSets).map(([level, config]) => (
              <button
                key={level}
                onClick={() => selectDifficulty(level)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  difficulty === level
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 bg-white hover:border-primary-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-semibold">{level}</div>
                    <div className="text-sm text-gray-600">
                      {Math.floor(config.timeLimit / 60)}:{(config.timeLimit % 60).toString().padStart(2, '0')} minutes
                    </div>
                  </div>
                  <div className="text-sm">
                    {level === "Easy" ? "1x" : level === "Medium" ? "1.5x" : "2x"} points
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <Button onClick={startGame} size="lg" variant="primary" disabled={!difficulty}>
          <ApperIcon name="Play" className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      </div>
    );
  }

  if (!gameStarted && !gameOver) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Word Explorer - {difficulty}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Form words using the available letters. Longer words earn more points!
        </p>
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
          <p className="text-accent-100">Words Found: {foundWords.length}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-6">
          <h4 className="font-bold text-gray-900 mb-3">Words You Found:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {foundWords.map((word, index) => (
              <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                {word} ({word.length * 10}pts)
              </div>
            ))}
          </div>
        </div>
        
        <Button onClick={initializeGame} variant="primary" size="lg">
          <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
          Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Game Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white rounded-lg px-4 py-2 shadow-md">
          <div className="text-sm text-gray-600">Time</div>
          <div className={`text-xl font-bold ${timeLeft < 30 ? "text-red-500" : "text-gray-900"}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="bg-white rounded-lg px-4 py-2 shadow-md">
          <div className="text-sm text-gray-600">Words Found</div>
          <div className="text-xl font-bold text-gray-900">{foundWords.length}</div>
        </div>
      </div>

      {/* Current Word */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Current Word</div>
          <div className="text-3xl font-bold text-gray-900 min-h-[3rem] flex items-center justify-center font-display">
            {currentWord || "Select letters to form a word"}
          </div>
          <div className="mt-4 space-x-3">
            <Button onClick={clearWord} variant="outline" disabled={!currentWord}>
              Clear
            </Button>
            <Button onClick={submitWord} variant="primary" disabled={!currentWord}>
              Submit Word
            </Button>
          </div>
        </div>
      </div>

      {/* Letter Grid */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="grid grid-cols-4 gap-3">
          {letters.map((letter, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectLetter(index)}
              className={`letter-tile h-16 text-2xl font-bold transition-all duration-150 ${
                selectedLetters.includes(index)
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-primary-400"
              }`}
              disabled={selectedLetters.includes(index)}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Found Words */}
      {foundWords.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h4 className="font-bold text-gray-900 mb-3">Found Words ({foundWords.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            <AnimatePresence>
              {foundWords.map((word, index) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium text-center"
                >
                  {word}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordExplorer;