import gameData from "@/services/mockData/games.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gameService = {
  async getAll() {
    await delay(300);
    return [...gameData];
  },

  async getById(id) {
    await delay(200);
    const game = gameData.find(game => game.Id === parseInt(id));
    if (!game) {
      throw new Error("Game not found");
    }
    return { ...game };
  },

  async getFeatured() {
    await delay(250);
    // Return games marked as featured or first 3
    const featured = gameData.filter(game => game.featured).slice(0, 3);
    return featured.length > 0 ? featured : gameData.slice(0, 3);
  },

  async getByCategory(category) {
    await delay(300);
    if (category === "All") {
      return [...gameData];
    }
    return gameData.filter(game => game.category === category);
  },

  async search(query) {
    await delay(400);
    const lowercaseQuery = query.toLowerCase();
    return gameData.filter(game => 
      game.title.toLowerCase().includes(lowercaseQuery) ||
      game.description.toLowerCase().includes(lowercaseQuery) ||
      game.category.toLowerCase().includes(lowercaseQuery) ||
      game.educationalValue.toLowerCase().includes(lowercaseQuery)
    );
  },

  async incrementPlayCount(id) {
    await delay(100);
    const game = gameData.find(game => game.Id === parseInt(id));
    if (game) {
      game.playCount++;
      return { ...game };
    }
    throw new Error("Game not found");
  }
};