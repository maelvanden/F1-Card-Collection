import React from 'react';
import { Zap, User, ShoppingBag, Home, Package, TrendingUp, LogOut, Trophy } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useGameStateContext } from '../../hooks/useGameState';

export const Header: React.FC = () => {
  const { gameState, logout } = useGameStateContext();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home, path: '/' },
    { id: 'dashboard', label: 'Collection', icon: User, path: '/dashboard' },
    { id: 'shop', label: 'Boutique', icon: ShoppingBag, path: '/shop' },
    { id: 'marketplace', label: 'Marché', icon: TrendingUp, path: '/marketplace' },
    { id: 'packs', label: 'Packs', icon: Package, path: '/packs' },
    { id: 'achievements', label: 'Succès', icon: Trophy, path: '/achievements' }
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
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-red-700/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {gameState.isAuthenticated ? (
              <>
                <div className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>{gameState.speedCoins?.toLocaleString() ?? '0'} SC</span>
                </div>

                <Link to={`/profile/${gameState.user?.username}`} className="flex items-center text-white hover:underline">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">{gameState.user?.username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-red-700/50 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <nav className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-red-700/50'
                    }`
                  }
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
