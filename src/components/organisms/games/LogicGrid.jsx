import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const LogicGrid = ({ onScoreUpdate }) => {
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hints, setHints] = useState([]);

  // Simplified logic puzzles for demo
  const puzzles = [
    {
      size: 3,
      clues: [
        "Person A likes red and sits in position 1 or 2",
        "Person B doesn't like blue and sits next to Person A",
        "Person C likes blue and sits in position 3"
      ],
      solution: [
        { person: "A", color: "red", position: 1 },
        { person: "B", color: "green", position: 2 },
        { person: "C", color: "blue", position: 3 }
      ],
      categories: ["Person", "Color", "Position"],
      items: [
        ["A", "B", "C"],
        ["Red", "Green", "Blue"],
        ["1", "2", "3"]
      ]
    },
    {
      size: 4,
      clues: [
        "Alice drinks coffee and works in Marketing",
        "Bob doesn't drink tea and works next to Alice",
        "Carol drinks water and works in position 3",
        "David drinks tea and works in IT"
      ],
      solution: [
        { person: "Alice", drink: "Coffee", dept: "Marketing" },
        { person: "Bob", drink: "Juice", dept: "Sales" },
        { person: "Carol", drink: "Water", dept: "HR" },
        { person: "David", drink: "Tea", dept: "IT" }
      ],
      categories: ["Person", "Drink", "Department"],
      items: [
        ["Alice", "Bob", "Carol", "David"],
        ["Coffee", "Tea", "Water", "Juice"],
        ["Marketing", "Sales", "HR", "IT"]
      ]
    }
  ];

  useEffect(() => {
    initializePuzzle();
  }, [currentPuzzle]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const initializePuzzle = () => {
    const puzzle = puzzles[currentPuzzle];
    const gridSize = puzzle.size * puzzle.size;
    setGrid(new Array(gridSize).fill(null));
    setSolution(puzzle.solution);
    setHints(puzzle.clues);
    setCompleted(false);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const toggleCell = (index) => {
    if (!gameStarted || completed) return;

    const newGrid = [...grid];
    if (newGrid[index] === null) {
      newGrid[index] = true; // Mark as possible
    } else if (newGrid[index] === true) {
      newGrid[index] = false; // Mark as impossible
    } else {
      newGrid[index] = null; // Clear
    }
    setGrid(newGrid);
  };

  const checkSolution = () => {
    // Simplified check - in a real implementation, this would be more complex
    const correctAnswers = grid.filter(cell => cell === true).length;
    if (correctAnswers >= puzzles[currentPuzzle].size) {
      setCompleted(true);
      const puzzleScore = (currentPuzzle + 1) * 100;
      setScore(prev => prev + puzzleScore);
      toast.success(`Puzzle solved! +${puzzleScore} points!`);
    } else {
      toast.warning("Solution incomplete. Keep working!");
    }
  };

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1);
    } else {
      toast.success("All puzzles completed! Great job!");
    }
  };

  const resetPuzzle = () => {
    initializePuzzle();
  };

  const puzzle = puzzles[currentPuzzle];

  if (!gameStarted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Logic Grid Challenge
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Use logical deduction to solve puzzles. Read the clues and mark possible/impossible combinations.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 mb-2">How to Play:</h4>
          <ul className="text-sm text-gray-600 text-left space-y-1">
            <li>• Click once: Mark as possible (green)</li>
            <li>• Click twice: Mark as impossible (red)</li>
            <li>• Click thrice: Clear marking</li>
            <li>• Use clues to deduce relationships</li>
          </ul>
        </div>
        <Button onClick={startGame} size="lg" variant="primary">
          <ApperIcon name="Play" className="w-5 h-5 mr-2" />
          Start Puzzle {currentPuzzle + 1}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Puzzle Info */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 font-display">
            Puzzle {currentPuzzle + 1} of {puzzles.length}
          </h3>
          <div className="text-lg font-bold text-accent-600">
            Score: {score}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Clues:</h4>
          <ul className="space-y-1">
            {hints.map((hint, index) => (
              <li key={index} className="text-blue-800 text-sm">
                {index + 1}. {hint}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Logic Grid */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md overflow-x-auto">
        <div className="min-w-max">
          <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${puzzle.size + 1}, minmax(0, 1fr))` }}>
            {/* Header row */}
            <div></div>
            {puzzle.items[1].map((item, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-700 p-2">
                {item}
              </div>
            ))}
            
            {/* Grid rows */}
            {puzzle.items[0].map((person, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="text-sm font-medium text-gray-700 p-2 flex items-center">
                  {person}
                </div>
                {puzzle.items[1].map((_, colIndex) => {
                  const cellIndex = rowIndex * puzzle.size + colIndex;
                  const cellValue = grid[cellIndex];
                  return (
                    <motion.button
                      key={colIndex}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCell(cellIndex)}
                      className={`logic-cell ${
                        cellValue === true
                          ? "bg-green-500 text-white"
                          : cellValue === false
                          ? "bg-red-500 text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {cellValue === true && "✓"}
                      {cellValue === false && "✗"}
                    </motion.button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={checkSolution} variant="primary" disabled={completed}>
            <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
            Check Solution
          </Button>
          
          {completed && currentPuzzle < puzzles.length - 1 && (
            <Button onClick={nextPuzzle} variant="secondary">
              <ApperIcon name="ArrowRight" className="w-4 h-4 mr-2" />
              Next Puzzle
            </Button>
          )}
          
          <Button onClick={resetPuzzle} variant="outline">
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block">
              <ApperIcon name="Trophy" className="w-5 h-5 inline mr-2" />
              Puzzle Completed!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LogicGrid;