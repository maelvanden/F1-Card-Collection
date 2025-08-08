import React from 'react';
import { ShoppingBag, Clock, Zap, Star } from 'lucide-react';
import { useGameStateContext } from '../../hooks/useGameState';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { dailyShopCards } from '../../data/mockData';
import { Card as CardType } from '../../types';

interface ShopPageProps {
  onNavigate: (page: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate }) => {
  const { gameState, updateSpeedCoins, addCards } = useGameStateContext();

  const handleBuyCard = (card: CardType) => {
    if (gameState.speedCoins >= card.price) {
      updateSpeedCoins(-card.price);
      addCards([{ ...card, obtainedDate: new Date() }]);
      console.log('Carte achetée:', card.name);
    }
  };

  // Calculate time until next refresh (mock - always shows 6 hours)
  const getTimeUntilRefresh = () => {
    const now = new Date();
    const nextRefresh = new Date(now);
    nextRefresh.setHours(now.getHours() + 6, 0, 0, 0);
    
    const diff = nextRefresh.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!gameState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Accès restreint</h2>
          <p className="text-gray-300 mb-8">Connectez-vous pour accéder à la boutique</p>
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
          <ShoppingBag className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Boutique Journalière</h1>
          <p className="text-gray-300 text-lg mb-6">
            Sélection quotidienne de cartes exclusives
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-300 font-bold">
                {gameState.speedCoins.toLocaleString()} Speed Coins
              </span>
            </div>
            
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-300 font-medium">
                Renouvellement dans {getTimeUntilRefresh()}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Cards */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">Cartes du Jour</h2>
            <Star className="w-6 h-6 text-yellow-400 ml-2" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {dailyShopCards.map((card) => {
              const canAfford = gameState.speedCoins >= card.price;
              
              return (
                <div
                  key={card.id}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                    !canAfford ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <Card card={card} size="lg" showPrice={false} />
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-white">{card.name}</h3>
                    <p className="text-gray-300 text-sm">{card.description}</p>

                    <div className="flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 font-bold text-xl">
                        {card.price.toLocaleString()} SC
                      </span>
                    </div>

                    <Button
                      onClick={() => handleBuyCard(card)}
                      disabled={!canAfford}
                      className="w-full"
                      size="lg"
                    >
                      {canAfford ? 'Acheter' : 'Fonds insuffisants'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-2xl p-8 hover:from-red-600/30 hover:to-red-800/30 transition-all duration-300 cursor-pointer"
               onClick={() => onNavigate('packs')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Packs de Cartes</h3>
              <p className="text-gray-300 mb-4">
                Découvrez des cartes aléatoirement dans nos packs exclusifs
              </p>
              <Button variant="outline">Explorer les Packs</Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-2xl p-8 hover:from-green-600/30 hover:to-green-800/30 transition-all duration-300 cursor-pointer"
               onClick={() => onNavigate('marketplace')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Marché des Cartes</h3>
              <p className="text-gray-300 mb-4">
                Achetez et vendez avec d'autres collectionneurs
              </p>
              <Button variant="outline">Accéder au Marché</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
