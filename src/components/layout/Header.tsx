import React from 'react';
import { Zap, User, ShoppingBag, Home, Package, TrendingUp, LogOut } from 'lucide-react';
import { useGameStateContext } from '../../hooks/useGameState';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { gameState, logout } = useGameStateContext();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'dashboard', label: 'Collection', icon: User },
    { id: 'shop', label: 'Boutique', icon: ShoppingBag },
    { id: 'marketplace', label: 'Marché', icon: TrendingUp },
    { id: 'packs', label: 'Packs', icon: Package }
  ];

  return (
    <header className="bg-gradient-to-r from-black via-red-900 to-black shadow-2xl border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mr-3">
                <Zap className="text-white w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                F1 Card <span className="text-red-400">Collection</span>
              </h1>
            </div>

            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-red-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {gameState.isAuthenticated ? (
              <>
                <div className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>{gameState.speedCoins.toLocaleString()} SC</span>
                </div>
                
                <div className="flex items-center text-white">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">{gameState.user?.username}</span>
                </div>
                
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-red-700/50 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Connexion
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <nav className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-red-700/50'
                  }`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};