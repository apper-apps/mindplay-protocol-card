import { useState, useEffect } from "react";

export const useGameProgress = (gameId) => {
  const [progress, setProgress] = useState({
    highScore: 0,
    levelsCompleted: 0,
    lastPlayed: null,
    totalPlayTime: 0
  });

  useEffect(() => {
    loadProgress();
  }, [gameId]);

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(`game_progress_${gameId}`);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load game progress:", error);
    }
  };

  const saveProgress = (newProgress) => {
    try {
      const updated = { ...progress, ...newProgress, lastPlayed: new Date().toISOString() };
      setProgress(updated);
      localStorage.setItem(`game_progress_${gameId}`, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save game progress:", error);
    }
  };

  const updateHighScore = (score) => {
    if (score > progress.highScore) {
      saveProgress({ highScore: score });
    }
  };

  const incrementPlayTime = (timeInSeconds) => {
    saveProgress({ totalPlayTime: progress.totalPlayTime + timeInSeconds });
  };

  const completeLevel = (level) => {
    if (level > progress.levelsCompleted) {
      saveProgress({ levelsCompleted: level });
    }
  };

  return {
    progress,
    updateHighScore,
    incrementPlayTime,
    completeLevel,
    saveProgress
  };
};