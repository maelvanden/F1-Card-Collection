import React, { useState } from 'react';
import { Package, Zap, Star, Gift } from 'lucide-react';
import { useGameStateContext } from '../../hooks/useGameState';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { availablePacks } from '../../data/mockData';
import { openPack } from '../../utils/cardGeneration';
import { Pack, Card as CardType } from '../../types';
import { useNavigate } from 'react-router-dom';

export const PacksPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, updateSpeedCoins, addCards, unlockAchievement, incrementPacksOpened } = useGameStateContext();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [openingPack, setOpeningPack] = useState(false);
  const [openedCards, setOpenedCards] = useState<CardType[]>([]);
  const [showPackResult, setShowPackResult] = useState(false);

  const handleBuyPack = (pack: Pack) => {
    if (gameState.speedCoins >= pack.price) {
      setSelectedPack(pack);
      setOpeningPack(true);
      
      // Simulate pack opening animation
      setTimeout(() => {
        const cards = openPack(pack.type, pack.cardCount);
        setOpenedCards(cards);
        updateSpeedCoins(-pack.price);
        addCards(cards);
        incrementPacksOpened();
        unlockAchievement('daily_pack', 'daily');
        setOpeningPack(false);
        setShowPackResult(true);
      }, 3000);
    }
  };

  const handleCloseResult = () => {
    setShowPackResult(false);
    setOpenedCards([]);
    setSelectedPack(null);
  };

  if (!gameState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Accès restreint</h2>
          <p className="text-gray-300 mb-8">Connectez-vous pour acheter des packs</p>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </div>
      </div>
    );
  }

  // Pack Opening Animation
  if (openingPack && selectedPack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-48 h-64 mx-auto mb-8 animate-pulse">
              <img
                src={selectedPack.imageUrl}
                alt={selectedPack.name}
                className="w-full h-full object-cover rounded-xl shadow-2xl animate-bounce"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent rounded-xl animate-ping" />
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 animate-spin mr-2" />
              <h2 className="text-2xl font-bold text-white">Ouverture du pack...</h2>
              <Star className="w-6 h-6 text-yellow-400 animate-spin ml-2" />
            </div>
            
            <p className="text-gray-300">La magie opère ✨</p>
          </div>
        </div>
      </div>
    );
  }

  // Pack Result Modal
  if (showPackResult && openedCards.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Gift className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">Félicitations !</h2>
            <p className="text-gray-300 text-lg">
              Vous avez obtenu {openedCards.length} nouvelle{openedCards.length > 1 ? 's' : ''} carte{openedCards.length > 1 ? 's' : ''} !
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {openedCards.map((card, index) => (
              <div 
                key={card.id} 
                className="transform transition-all duration-500 hover:scale-110"
                style={{ 
                  animation: `slideInUp 0.5s ease-out ${index * 0.2}s both` 
                }}
              >
                <Card card={card} size="md" />
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleCloseResult}>
              Continuer
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Voir ma Collection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Boutique de Packs</h1>
          <p className="text-gray-300 text-lg mb-6">
            Découvrez des cartes uniques dans nos packs exclusifs
          </p>
          
          <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2">
            <Zap className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-yellow-300 font-bold">
              {gameState.speedCoins.toLocaleString()} Speed Coins disponibles
            </span>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {availablePacks.map((pack) => {
            const canAfford = gameState.speedCoins >= pack.price;
            
            return (
              <div
                key={pack.id}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl ${
                  !canAfford ? 'opacity-50' : ''
                }`}
              >
                <div className="relative mb-6">
                  <img
                    src={pack.imageUrl}
                    alt={pack.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  {!canAfford && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">Fonds insuffisants</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{pack.name}</h3>
                <p className="text-gray-300 mb-4">{pack.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Cartes incluses</span>
                    <span className="text-white font-bold">{pack.cardCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Prix</span>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 font-bold">
                        {pack.price.toLocaleString()} SC
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleBuyPack(pack)}
                  disabled={!canAfford}
                  className="w-full"
                  size="lg"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Acheter Pack
                </Button>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Guide des Raretés
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto mb-2" />
              <div className="text-white font-bold">Commune</div>
              <div className="text-gray-300 text-sm">60-70%</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-2" />
              <div className="text-white font-bold">Rare</div>
              <div className="text-gray-300 text-sm">20-30%</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-2" />
              <div className="text-white font-bold">Épique</div>
              <div className="text-gray-300 text-sm">8-18%</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-2" />
              <div className="text-white font-bold">Légendaire</div>
              <div className="text-gray-300 text-sm">2-17%</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mx-auto mb-2" />
              <div className="text-white font-bold">Mythique</div>
              <div className="text-gray-300 text-sm">0-3%</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
