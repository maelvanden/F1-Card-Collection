import React, { useState } from 'react';
import { Search, Package, TrendingUp, Zap, User } from 'lucide-react';
import { useGameStateContext } from '../../hooks/useGameState';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CardRarity, CardType } from '../../types';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { gameState } = useGameStateContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredCards = gameState.userCards
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity;
      const matchesType = filterType === 'all' || card.type === filterType;
      return matchesSearch && matchesRarity && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'rarity': {
          const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
          return (
            rarityOrder[b.rarity as keyof typeof rarityOrder] -
            rarityOrder[a.rarity as keyof typeof rarityOrder]
          );
        }
        case 'date':
          return new Date(b.obtainedDate || 0).getTime() - new Date(a.obtainedDate || 0).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const totalValue = gameState.userCards.reduce((sum, card) => sum + card.price, 0);
  const rarityStats = gameState.userCards.reduce((stats, card) => {
    stats[card.rarity] = (stats[card.rarity] || 0) + 1;
    return stats;
  }, {} as Record<string, number>);

  if (!gameState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Accès restreint</h2>
          <p className="text-gray-300 mb-8">Connectez-vous pour accéder à votre collection</p>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <User className="w-8 h-8 text-red-400 mr-3" />
            <div>
              <h1 className="text-4xl font-bold text-white">Ma Collection</h1>
              <p className="text-gray-300">Bienvenue, {gameState.user?.username} !</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{gameState.userCards.length}</div>
                  <div className="text-gray-300 text-sm">Cartes totales</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{totalValue.toLocaleString()}</div>
                  <div className="text-gray-300 text-sm">Valeur Collection</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{gameState.speedCoins.toLocaleString()}</div>
                  <div className="text-gray-300 text-sm">Speed Coins</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">★</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{rarityStats.legendary || 0}</div>
                  <div className="text-gray-300 text-sm">Légendaires</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une carte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="name">Trier par Nom</option>
              <option value="price">Trier par Prix</option>
              <option value="rarity">Trier par Rareté</option>
              <option value="date">Trier par Date</option>
            </select>

            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes Raretés</option>
              {Object.values(CardRarity).map(rarity => (
                <option key={rarity} value={rarity}>{rarity.toUpperCase()}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous Types</option>
              {Object.values(CardType).map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                size="md"
                onClick={() => console.log('Card clicked:', card.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucune carte trouvée</h3>
            <p className="text-gray-300 mb-6">
              {searchTerm || filterRarity !== 'all' || filterType !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Commencez par acheter quelques packs !'}
            </p>
            <Button onClick={() => navigate('/packs')}>
              Acheter des Packs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
