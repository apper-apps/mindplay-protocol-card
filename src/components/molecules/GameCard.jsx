import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GameCard = ({ game, onPlay, className }) => {
  const categoryColors = {
    Puzzle: "primary",
    Logic: "secondary", 
    Memory: "accent",
    Math: "success",
    Language: "warning",
    History: "danger"
  };

  const categoryIcons = {
    Puzzle: "Puzzle",
    Logic: "Brain",
    Memory: "Zap",
    Math: "Calculator",
    Language: "BookOpen",
    History: "Clock"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card className="game-card border-t-4 border-t-primary-500 overflow-hidden h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                {game.title}
              </h3>
              <Badge variant={categoryColors[game.category]} className="mb-3">
                <ApperIcon name={categoryIcons[game.category]} className="w-4 h-4 mr-1" />
                {game.category}
              </Badge>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 flex-1 text-sm leading-relaxed">
            {game.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <ApperIcon name="Play" className="w-4 h-4 mr-1" />
              <span>{game.playCount} plays</span>
            </div>
<div className="flex items-center">
              <ApperIcon name="BarChart3" className="w-4 h-4 mr-1" />
              <span>{
                typeof game.difficulty === 'object' 
                  ? (game.difficulty?.range || 'Unknown')
                  : (game.difficulty || 'Unknown')
              }</span>
            </div>
          </div>
          
          <Button 
            onClick={() => onPlay(game.id)}
            className="w-full"
            variant="primary"
          >
            <ApperIcon name="Play" className="w-4 h-4 mr-2" />
            Play Game
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default GameCard;