import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { Dashboard } from './components/pages/Dashboard';
import { PacksPage } from './components/pages/PacksPage';
import { ShopPage } from './components/pages/ShopPage';
import { MarketplacePage } from './components/pages/MarketplacePage';
import { GameStateProvider } from './context/GameStateContext';
import { useGameStateContext } from './hooks/useGameState';

function App() {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
}

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { gameState } = useGameStateContext();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} isAuthenticated={gameState.isAuthenticated} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'packs':
        return <PacksPage onNavigate={handleNavigate} />;
      case 'shop':
        return <ShopPage onNavigate={handleNavigate} />;
      case 'marketplace':
        return <MarketplacePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} isAuthenticated={gameState.isAuthenticated} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
