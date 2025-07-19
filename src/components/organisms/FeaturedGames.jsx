import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FeaturedGames = ({ games = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const featuredGames = games.slice(0, 3);

  useEffect(() => {
    if (featuredGames.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredGames.length]);

  const categoryColors = {
    Puzzle: "primary",
    Logic: "secondary", 
    Memory: "accent",
    Math: "success",
    Language: "warning",
    History: "danger"
  };

  const handlePlayGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  if (featuredGames.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 p-1">
      <div className="bg-white rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">
            Featured Games
          </h2>
          <p className="text-gray-600">
            Discover our most popular learning games
          </p>
        </div>

        <div className="relative h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 h-full flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-1 text-center md:text-left">
                  <Badge 
                    variant={categoryColors[featuredGames[currentIndex].category]}
                    className="mb-4"
                  >
                    {featuredGames[currentIndex].category}
                  </Badge>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                    {featuredGames[currentIndex].title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {featuredGames[currentIndex].description}
                  </p>
                  
                  <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                      <span>{featuredGames[currentIndex].playCount} plays</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="BarChart3" className="w-4 h-4 mr-1" />
                      <span>{featuredGames[currentIndex].difficulty}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePlayGame(featuredGames[currentIndex].id)}
                    size="lg"
                    variant="primary"
                  >
                    <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                    Play Now
                  </Button>
                </div>
                
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <ApperIcon name="Brain" className="w-16 h-16 text-white" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        {featuredGames.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {featuredGames.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-primary-500 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedGames;