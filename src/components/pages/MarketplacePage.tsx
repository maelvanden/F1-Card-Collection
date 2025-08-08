import React, { useState } from 'react';
import { TrendingUp, Search, Filter, Zap } from 'lucide-react';
import { useGameStateContext } from '../../hooks/useGameState';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { marketListings } from '../../data/mockData';
import { MarketListing } from '../../types';

interface MarketplacePageProps {
  onNavigate: (page: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  const { gameState, updateSpeedCoins } = useGameStateContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');

  const handleBuyCard = (listing: MarketListing) => {
    if (gameState.speedCoins >= listing.price) {
      updateSpeedCoins(-listing.price);
      // Dans une vraie app, on ajouterait la carte à l'inventaire
      console.log('Carte achetée:', listing.card.name);
    }
  };

  const filteredListings = marketListings
    .filter(listing => 
      listing.card.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'date':
          return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
        default:
          return a.card.name.localeCompare(b.card.name);
      }
    });

  if (!gameState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Accès restreint</h2>
          <p className="text-gray-300 mb-8">Connectez-vous pour accéder au marché</p>
          <Button onClick={() => onNavigate('login')}>Se connecter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Hôtel des Ventes</h1>
          <p className="text-gray-300 text-lg mb-6">
            Achetez et vendez vos cartes rares sur le marché
          </p>
          
          <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2">
            <Zap className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-yellow-300 font-bold">
              {gameState.speedCoins.toLocaleString()} Speed Coins
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
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
              <option value="price_asc">Prix Croissant</option>
              <option value="price_desc">Prix Décroissant</option>
              <option value="date">Plus Récent</option>
              <option value="name">Nom</option>
            </select>

            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-300">
                {filteredListings.length} carte(s) disponible(s)
              </span>
            </div>
          </div>
        </div>

        {/* Market Listings */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <Card card={listing.card} size="md" showPrice={false} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Vendeur</span>
                  <span className="text-white font-medium">{listing.sellerUsername}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Prix</span>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 font-bold text-lg">
                      {listing.price.toLocaleString()} SC
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Mise en vente</span>
                  <span className="text-white text-sm">
                    {new Date(listing.listedDate).toLocaleDateString()}
                  </span>
                </div>

                <Button
                  onClick={() => handleBuyCard(listing)}
                  disabled={gameState.speedCoins < listing.price}
                  className="w-full mt-4"
                >
                  {gameState.speedCoins >= listing.price ? 'Acheter' : 'Fonds insuffisants'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucune carte trouvée</h3>
            <p className="text-gray-300">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* Sell Section */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Vendez vos cartes
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Mettez vos cartes en vente et gagnez des Speed Coins
          </p>
          
          <div className="text-center">
            <Button onClick={() => onNavigate('dashboard')} variant="secondary">
              Accéder à ma Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
