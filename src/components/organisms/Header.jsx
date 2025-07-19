import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const categories = ["All", "Puzzle", "Logic", "Memory", "Math", "Language", "History"];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      navigate(`/games?search=${encodeURIComponent(e.target.value.trim())}`);
    }
  };

  const handleCategoryChange = (category) => {
    if (category === "All") {
      navigate("/games");
    } else {
      navigate(`/games?category=${encodeURIComponent(category)}`);
    }
    setShowMobileMenu(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Brain" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-display">
              MindPlay Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search games..."
              className="w-80"
            />
            <nav className="flex items-center space-x-1">
              <Link to="/" className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-150">
                Home
              </Link>
              <Link to="/games" className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-150">
                All Games
              </Link>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden"
          >
            <ApperIcon name={showMobileMenu ? "X" : "Menu"} className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 py-4"
          >
            <div className="space-y-4">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search games..."
                className="w-full"
              />
              
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-150"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/games" 
                  className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-150"
                  onClick={() => setShowMobileMenu(false)}
                >
                  All Games
                </Link>
              </nav>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-3">Categories</p>
                <CategoryFilter
                  categories={categories}
                  selectedCategory="All"
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;