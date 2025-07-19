import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturedGames from "@/components/organisms/FeaturedGames";
import GameCard from "@/components/molecules/GameCard";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { gameService } from "@/services/api/gameService";

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const categories = ["Puzzle", "Logic", "Memory", "Math", "Language", "History"];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [featured, allGames] = await Promise.all([
        gameService.getFeatured(),
        gameService.getAll()
      ]);
      
      setFeaturedGames(featured);
      
      // Sort by play count and take top 6
      const popular = allGames
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 6);
      setPopularGames(popular);
      
    } catch (err) {
      setError("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async (gameId) => {
    try {
      await gameService.incrementPlayCount(gameId);
    } catch (error) {
      console.error("Failed to increment play count:", error);
    }
    navigate(`/game/${gameId}`);
  };

  const handleCategorySelect = (category) => {
    navigate(`/games?category=${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading message="Loading amazing games..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message={error} onRetry={loadHomeData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-display">
            Learn Through Play
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover our collection of educational mini-games that make learning fun and engaging. 
            From vocabulary building to logic puzzles, challenge your mind while having a blast!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/games")}
              size="lg"
              variant="accent"
              className="bg-white text-primary-600 hover:bg-gray-50"
            >
              <ApperIcon name="Grid3X3" className="w-5 h-5 mr-2" />
              Browse All Games
            </Button>
            <Button
              onClick={() => navigate("/games?category=Popular")}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2" />
              Popular Games
            </Button>
          </div>
        </motion.div>

        {/* Featured Games */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <FeaturedGames games={featuredGames} />
        </motion.div>

        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-xl mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Explore by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Find games that match your learning interests
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const categoryIcons = {
                "Puzzle": "Puzzle",
                "Logic": "Brain",
                "Memory": "Zap",
                "Math": "Calculator",
                "Language": "BookOpen",
                "History": "Clock"
              };
              
              const categoryColors = {
                "Puzzle": "from-primary-500 to-primary-600",
                "Logic": "from-secondary-500 to-secondary-600",
                "Memory": "from-accent-500 to-accent-600",
                "Math": "from-green-500 to-green-600",
                "Language": "from-yellow-500 to-yellow-600",
                "History": "from-red-500 to-red-600"
              };

              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategorySelect(category)}
                  className={`bg-gradient-to-br ${categoryColors[category]} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center space-y-3`}
                >
                  <ApperIcon name={categoryIcons[category]} className="w-8 h-8" />
                  <span className="font-semibold">{category}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Popular Games */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Popular Games
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of players enjoying these favorites
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={handlePlayGame}
              />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("/games")}
              variant="primary"
              size="lg"
            >
              <ApperIcon name="ArrowRight" className="w-5 h-5 mr-2" />
              View All Games
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 font-display">5+</div>
              <div className="text-white/80">Educational Games</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 font-display">6</div>
              <div className="text-white/80">Learning Categories</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 font-display">∞</div>
              <div className="text-white/80">Fun & Learning</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;