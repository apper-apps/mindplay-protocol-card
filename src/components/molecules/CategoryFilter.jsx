import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const categoryIcons = {
    "All": "Grid3X3",
    "Puzzle": "Puzzle",
    "Logic": "Brain",
    "Memory": "Zap",
    "Math": "Calculator",
    "Language": "BookOpen",
    "History": "Clock"
  };

  const categoryColors = {
    "All": "default",
    "Puzzle": "primary",
    "Logic": "secondary", 
    "Memory": "accent",
    "Math": "success",
    "Language": "warning",
    "History": "danger"
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
            selectedCategory === category
              ? "bg-primary-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <ApperIcon 
            name={categoryIcons[category]} 
            className="w-4 h-4 mr-2" 
          />
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;