import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GameHeader = ({ 
  title, 
  score, 
  onShowInstructions, 
  onQuit, 
  showScore = true,
  rightContent 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onQuit}
            className="text-gray-600 hover:text-gray-800"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {showScore && score !== undefined && (
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-lg font-bold">
              Score: {score}
            </div>
          )}
          {rightContent}
          <Button
            variant="outline"
            size="sm"
            onClick={onShowInstructions}
          >
            <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
            Help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;