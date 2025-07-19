import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import GameLibraryPage from "@/components/pages/GameLibraryPage";
import GamePage from "@/components/pages/GamePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GameLibraryPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="!top-20"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;