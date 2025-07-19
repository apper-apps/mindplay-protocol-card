import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const TimelineSort = ({ onScoreUpdate, selectedDifficulty = "Medium" }) => {
  const [events, setEvents] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
// Historical events by difficulty and level
  const eventSets = {
    Easy: {
      1: [
        { id: 1, event: "Declaration of Independence", year: 1776, description: "American colonies declare independence" },
        { id: 2, event: "Civil War Begins", year: 1861, description: "American Civil War starts" },
        { id: 3, event: "World War II Ends", year: 1945, description: "Allied victory in World War II" }
      ],
      2: [
        { id: 4, event: "Moon Landing", year: 1969, description: "Apollo 11 lands on the moon" },
        { id: 5, event: "Berlin Wall Falls", year: 1989, description: "End of divided Germany" },
        { id: 6, event: "Internet Invented", year: 1991, description: "World Wide Web goes public" },
        { id: 7, event: "Renaissance Begins", year: 1400, description: "Cultural rebirth in Europe" }
      ]
    },
    Medium: {
      1: [
        { id: 8, event: "Declaration of Independence", year: 1776, description: "American colonies declare independence" },
        { id: 9, event: "Civil War Begins", year: 1861, description: "American Civil War starts" },
        { id: 10, event: "World War I Begins", year: 1914, description: "The Great War begins in Europe" },
        { id: 11, event: "World War II Ends", year: 1945, description: "Allied victory in World War II" }
      ],
      2: [
        { id: 12, event: "Moon Landing", year: 1969, description: "Apollo 11 lands on the moon" },
        { id: 13, event: "Berlin Wall Falls", year: 1989, description: "End of divided Germany" },
        { id: 14, event: "Internet Invented", year: 1989, description: "World Wide Web created" },
        { id: 15, event: "Renaissance Begins", year: 1400, description: "Cultural rebirth in Europe" },
        { id: 16, event: "Printing Press Invented", year: 1440, description: "Gutenberg's movable type" }
      ],
      3: [
        { id: 17, event: "Roman Empire Falls", year: 476, description: "End of Western Roman Empire" },
        { id: 18, event: "Magna Carta Signed", year: 1215, description: "Limits on royal power" },
        { id: 19, event: "Black Death", year: 1347, description: "Plague devastates Europe" },
        { id: 20, event: "Columbus Reaches Americas", year: 1492, description: "European discovery of New World" },
        { id: 21, event: "Industrial Revolution", year: 1760, description: "Mechanization transforms society" },
        { id: 22, event: "French Revolution", year: 1789, description: "Overthrow of monarchy in France" }
      ]
    },
    Hard: {
      1: [
        { id: 23, event: "Mongol Empire Peak", year: 1279, description: "Largest contiguous empire" },
        { id: 24, event: "Byzantine Empire Falls", year: 1453, description: "Ottoman conquest of Constantinople" },
        { id: 25, event: "Protestant Reformation", year: 1517, description: "Martin Luther's 95 Theses" },
        { id: 26, event: "Thirty Years' War Ends", year: 1648, description: "Peace of Westphalia" },
        { id: 27, event: "Scientific Revolution", year: 1543, description: "Copernican heliocentric model" }
      ],
      2: [
        { id: 28, event: "Tang Dynasty Peak", year: 715, description: "Golden age of Chinese culture" },
        { id: 29, event: "Crusades Begin", year: 1095, description: "First Crusade launched" },
        { id: 30, event: "Hanseatic League Forms", year: 1356, description: "Medieval trading confederation" },
        { id: 31, event: "Hundred Years' War Begins", year: 1337, description: "England vs France conflict" },
        { id: 32, event: "Great Schism Ends", year: 1417, description: "Papal unity restored" },
        { id: 33, event: "Inca Empire Peak", year: 1438, description: "Largest empire in pre-Columbian America" }
      ],
      3: [
        { id: 34, event: "Justinian Code", year: 529, description: "Corpus Juris Civilis compiled" },
        { id: 35, event: "Iconoclastic Controversy", year: 726, description: "Byzantine religious conflict" },
        { id: 36, event: "Investiture Controversy", year: 1075, description: "Pope vs Holy Roman Emperor" },
        { id: 37, event: "Fourth Lateran Council", year: 1215, description: "Major church reforms" },
        { id: 38, event: "Avignon Papacy Begins", year: 1309, description: "Papal court moves to France" },
        { id: 39, event: "Council of Constance", year: 1414, description: "End of Western Schism" },
        { id: 40, event: "Peace of Augsburg", year: 1555, description: "Religious settlement in HRE" }
      ]
    }
  };

  useEffect(() => {
    initializeLevel();
  }, [currentLevel]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

const initializeLevel = () => {
    const difficultyEvents = eventSets[difficulty] || {};
    const levelEvents = difficultyEvents[currentLevel] || [];
    const shuffled = [...levelEvents].sort(() => Math.random() - 0.5);
    setEvents(shuffled);
    setTimeline(new Array(levelEvents.length).fill(null));
    setCompleted(false);
    setGameStarted(false);
  };

  const selectDifficulty = (selectedDiff) => {
    setDifficulty(selectedDiff);
    setCurrentLevel(1);
    setShowDifficultySelect(false);
    setTimeout(() => initializeLevel(), 100);
  };


  const handleDragStart = (event) => {
    setDraggedEvent(event);
  };
const startGame = () => {
    setGameStarted(true);
    setShowDifficultySelect(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (!draggedEvent) return;

    const newTimeline = [...timeline];
    
    // Remove event from its current position in timeline
    const currentIndex = newTimeline.findIndex(item => item && item.id === draggedEvent.id);
    if (currentIndex !== -1) {
      newTimeline[currentIndex] = null;
    }

    // Place event in new position
    newTimeline[index] = draggedEvent;
    setTimeline(newTimeline);

    // Remove from events list if not already placed
    setEvents(prev => prev.filter(event => event.id !== draggedEvent.id));
    setDraggedEvent(null);
  };

  const removeFromTimeline = (eventId, index) => {
    const event = timeline[index];
    if (!event) return;

    const newTimeline = [...timeline];
    newTimeline[index] = null;
    setTimeline(newTimeline);

    setEvents(prev => [...prev, event]);
  };

  const checkSolution = () => {
    if (timeline.some(slot => slot === null)) {
      toast.warning("Please place all events on the timeline!");
      return;
    }

    // Check if events are in chronological order
    let correct = true;
    for (let i = 1; i < timeline.length; i++) {
      if (timeline[i].year < timeline[i - 1].year) {
        correct = false;
        break;
      }
    }

    if (correct) {
      setCompleted(true);
      const levelScore = currentLevel * 50;
      setScore(prev => prev + levelScore);
      toast.success(`Level ${currentLevel} completed! +${levelScore} points!`);
    } else {
      toast.error("Timeline order is incorrect. Try again!");
    }
};

  const nextLevel = () => {
    const maxLevels = Object.keys(eventSets[difficulty] || {}).length;
    if (currentLevel < maxLevels) {
      setCurrentLevel(prev => prev + 1);
    } else {
      toast.success("All levels completed! You're a history master!");
    }
  };

  const resetLevel = () => {
    initializeLevel();
    setScore(0);
  };

  if (showDifficultySelect) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Historical Timeline Sort
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Drag and drop historical events to arrange them in chronological order.
        </p>
        
        <div className="bg-white rounded-lg p-6 mb-6 max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 mb-4">Choose Difficulty:</h4>
          <div className="space-y-3">
            {Object.entries(eventSets).map(([level, levelData]) => (
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
                      {Object.keys(levelData).length} levels
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

  if (!gameStarted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Historical Timeline Sort - {difficulty}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Drag and drop historical events to arrange them in chronological order.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="font-semibold text-blue-900 mb-2">Level {currentLevel}</h4>
          <p className="text-blue-800 text-sm">
            {eventSets[difficulty]?.[currentLevel]?.length || 0} events to sort
          </p>
        </div>
        <Button onClick={startGame} size="lg" variant="primary">
          <ApperIcon name="Play" className="w-5 h-5 mr-2" />
          Start Level {currentLevel}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
            Timeline Sort - {difficulty} Level {currentLevel}
          </h3>
          <div className="text-lg font-bold text-accent-600">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Events to Sort */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <h4 className="font-semibold text-gray-900 mb-4">Events to Place:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                draggable
                onDragStart={() => handleDragStart(event)}
                className="timeline-event cursor-move bg-white hover:shadow-lg"
              >
                <h5 className="font-semibold text-gray-900 mb-1">{event.event}</h5>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="text-xs text-gray-500">Drag to timeline</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <h4 className="font-semibold text-gray-900 mb-4">Timeline (Earliest → Latest):</h4>
        <div className="space-y-3">
          {timeline.map((event, index) => (
            <div
              key={index}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className="timeline-slot flex items-center justify-between"
            >
              {event ? (
                <div className="flex-1 flex items-center justify-between bg-secondary-50 border border-secondary-200 rounded-lg p-3">
                  <div>
                    <h5 className="font-semibold text-gray-900">{event.event}</h5>
                    <p className="text-sm text-gray-600">{event.year} - {event.description}</p>
                  </div>
                  <Button
                    onClick={() => removeFromTimeline(event.id, index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 text-center text-gray-400 py-6">
                  Drop event here (Position {index + 1})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={checkSolution} variant="primary" disabled={completed}>
            <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
            Check Timeline
          </Button>
          
          {completed && currentLevel < Object.keys(eventSets[difficulty] || {}).length && (
            <Button onClick={nextLevel} variant="secondary">
              <ApperIcon name="ArrowRight" className="w-4 h-4 mr-2" />
              Next Level
            </Button>
          )}
          
          <Button onClick={resetLevel} variant="outline">
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Reset Level
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
              Timeline Completed!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TimelineSort;