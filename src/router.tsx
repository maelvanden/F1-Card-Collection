import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { Dashboard } from './components/pages/Dashboard';
import { PacksPage } from './components/pages/PacksPage';
import { ShopPage } from './components/pages/ShopPage';
import { MarketplacePage } from './components/pages/MarketplacePage';
import { useGameState } from './hooks/useGameState';

export const AppRouter: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage isAuthenticated={gameState.isAuthenticated} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
