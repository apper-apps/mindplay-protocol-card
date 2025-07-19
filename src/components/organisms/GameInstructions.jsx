import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GameInstructions = ({ game, isOpen, onClose }) => {
  if (!isOpen || !game) return null;

  const instructions = {
    "word-explorer": {
      howToPlay: [
        "Select letters by clicking on them to form words",
        "Words must be at least 3 letters long",
        "Submit your word to check if it's valid",
        "Longer words earn more points",
        "Clear your selection to start over",
        "Race against time to find as many words as possible"
      ],
      educationalValue: "Expands vocabulary, improves spelling skills, and enhances pattern recognition. Learn word meanings and discover new vocabulary in an engaging way.",
      controls: ["Click: Select/deselect letters", "Submit: Check if word is valid", "Clear: Reset current word", "Timer: 3 minutes per game"]
    },
    "logic-grid": {
      howToPlay: [
        "Read the clues carefully to understand relationships",
        "Click cells once to mark as possible (green)",
        "Click cells twice to mark as impossible (red)", 
        "Click cells three times to clear the marking",
        "Use logical deduction to eliminate possibilities",
        "Complete the grid when all relationships are determined"
      ],
      educationalValue: "Develops critical thinking, logical reasoning, and problem-solving skills. Teaches systematic analysis and deductive reasoning methods.",
      controls: ["Single click: Mark as possible", "Double click: Mark as impossible", "Triple click: Clear marking", "Check Solution: Verify your answers"]
    },
    "timeline-sort": {
      howToPlay: [
        "Drag historical events from the list to the timeline",
        "Arrange events in chronological order (earliest to latest)",
        "Drop events into the correct time slots",
        "Click X to remove an event from the timeline",
        "Complete all events to check your solution",
        "Progress through increasingly complex historical periods"
      ],
      educationalValue: "Builds historical knowledge, improves understanding of cause and effect, and develops chronological thinking skills.",
      controls: ["Drag & Drop: Move events to timeline", "Click X: Remove from timeline", "Check Timeline: Verify chronological order", "Reset: Start level over"]
    },
    "math-blitz": {
      howToPlay: [
        "Solve math problems as quickly as possible",
        "Type your answer and press Enter or click Submit",
        "Build consecutive correct answers for streak bonuses",
        "Difficulty increases every 10 problems",
        "Race against the 60-second timer",
        "Higher difficulty levels award more points"
      ],
      educationalValue: "Strengthens mental math skills, improves calculation speed, and builds confidence with numbers across different operations.",
      controls: ["Type: Enter numeric answers", "Enter key: Submit answer", "Timer: 60 seconds per game", "Auto-progression: Difficulty increases automatically"]
    },
    "memory-match": {
      howToPlay: [
        "Click cards to flip them and reveal their content",
        "Find matching pairs (country-capital, element-symbol, etc.)",
        "Remember card locations to make efficient matches",
        "Match all pairs to complete the level",
        "Fewer moves and faster time earn bonus points",
        "Progress through different educational themes"
      ],
      educationalValue: "Enhances memory skills, teaches factual knowledge across subjects, and improves concentration and visual recognition.",
      controls: ["Click: Flip cards", "Memory: Remember card positions", "Time/Moves: Tracked for scoring", "Auto-match: Cards stay flipped when matched"]
    }
  };

  const gameInstructions = instructions[game.id] || {
    howToPlay: ["Follow the on-screen instructions", "Have fun while learning!"],
    educationalValue: "Provides educational value through interactive gameplay.",
    controls: ["Mouse/Touch: Primary interaction", "Follow game prompts"]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              How to Play: {game.title}
            </h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* How to Play */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ApperIcon name="PlayCircle" className="w-5 h-5 mr-2 text-primary-500" />
              How to Play
            </h3>
            <ul className="space-y-2">
              {gameInstructions.howToPlay.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Educational Value */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 mr-2 text-secondary-500" />
              Educational Value
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {gameInstructions.educationalValue}
            </p>
          </div>

          {/* Controls */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ApperIcon name="Gamepad2" className="w-5 h-5 mr-2 text-accent-500" />
              Controls
            </h3>
            <ul className="space-y-2">
              {gameInstructions.controls.map((control, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{control}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Game Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="ml-2 font-medium text-gray-900">{game.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Difficulty:</span>
                <span className="ml-2 font-medium text-gray-900">{game.difficulty}</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-gray-600">Description:</span>
              <p className="mt-1 text-gray-900">{game.description}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-center">
            <Button onClick={onClose} variant="primary" size="lg">
              <ApperIcon name="Play" className="w-5 h-5 mr-2" />
              Start Playing
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameInstructions;