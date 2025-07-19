import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GameHeader from "@/components/molecules/GameHeader";
import GameInstructions from "@/components/organisms/GameInstructions";
import WordExplorer from "@/components/organisms/games/WordExplorer";
import LogicGrid from "@/components/organisms/games/LogicGrid";
import TimelineSort from "@/components/organisms/games/TimelineSort";
import MathBlitz from "@/components/organisms/games/MathBlitz";
import MemoryMatch from "@/components/organisms/games/MemoryMatch";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { gameService } from "@/services/api/gameService";
import { useGameProgress } from "@/hooks/useGameProgress";

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const { progress, updateHighScore, incrementPlayTime } = useGameProgress(gameId);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      setLoading(true);
      setError("");
      const gameData = await gameService.getById(gameId);
      setGame(gameData);
    } catch (err) {
      setError("Game not found or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    updateHighScore(newScore);
  };

  const handleQuit = () => {
    navigate("/games");
  };

  const renderGameComponent = () => {
    if (!game) return null;

    const gameComponents = {
      "word-explorer": WordExplorer,
      "logic-grid": LogicGrid,
      "timeline-sort": TimelineSort,
      "math-blitz": MathBlitz,
      "memory-match": MemoryMatch
    };

    const GameComponent = gameComponents[game.id];
    
    if (!GameComponent) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Game Coming Soon!</h3>
          <p className="text-gray-600 mb-6">
            This game is under development and will be available soon.
          </p>
        </div>
      );
    }

    return <GameComponent onScoreUpdate={handleScoreUpdate} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 flex items-center justify-center">
        <Loading message="Loading game..." />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 flex items-center justify-center">
        <Error 
          message={error || "Game not found"} 
          onRetry={loadGame}
          showRetry={!error.includes("not found")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-container"
        >
          <GameHeader
            title={game.title}
            score={score}
            onShowInstructions={() => setShowInstructions(true)}
            onQuit={handleQuit}
            rightContent={
              progress.highScore > 0 && (
                <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-4 py-2 rounded-lg font-bold">
                  Best: {progress.highScore}
                </div>
              )
            }
          />
          
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {renderGameComponent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {showInstructions && (
            <GameInstructions
              game={game}
              isOpen={showInstructions}
              onClose={() => setShowInstructions(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePage;