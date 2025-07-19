import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameCard from "@/components/molecules/GameCard";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { gameService } from "@/services/api/gameService";

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const categories = ["All", "Puzzle", "Logic", "Memory", "Math", "Language", "History"];

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await gameService.getAll();
      setGames(data);
    } catch (err) {
      setError("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    
    if (query.trim()) {
      newParams.set("search", query.trim());
    } else {
      newParams.delete("search");
    }
    
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (category === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    
    setSearchParams(newParams);
  };

  const handlePlayGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = searchQuery === "" || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <Loading message="Loading game library..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGames} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 font-display text-center">
          Game Library
        </h1>
        <p className="text-white/80 text-center text-lg mb-8">
          Explore our collection of educational games
        </p>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="flex-1 min-w-0">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search games by title, description, or category..."
                className="w-full"
              />
            </div>
            <div className="w-full lg:w-auto">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg">
          <Empty
            title={searchQuery || selectedCategory !== "All" ? "No games found" : "No games available"}
            description={
              searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or browse different categories."
                : "Games are being added to the library."
            }
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchParams({});
            }}
            icon="Search"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={handlePlayGame}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameLibrary;