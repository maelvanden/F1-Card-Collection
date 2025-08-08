import React from 'react';
import { Zap, Trophy, Users, TrendingUp, Package, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { dailyShopCards } from '../../data/mockData';

interface HomePageProps {
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, isAuthenticated }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-red-600/10 border border-red-500/20 rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-300 font-medium">La révolution des cartes F1</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">F1 Card</span>
              <br />
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Collectionnez, échangez et vendez les cartes virtuelles les plus rares de la Formule 1. 
              Pilotes légendaires, circuits mythiques, équipes d'exception vous attendent !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" onClick={() => onNavigate('dashboard')}>
                  Voir ma Collection
                </Button>
              ) : (
                <Button size="lg" onClick={() => onNavigate('login')}>
                  Commencer l'Aventure
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => onNavigate('shop')}>
                Explorer la Boutique
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pourquoi choisir F1 Card Collection ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cartes Exclusives</h3>
              <p className="text-gray-300">
                Des cartes uniques de pilotes, circuits et équipes avec des raretés allant de Commune à Mythique.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Communauté Active</h3>
              <p className="text-gray-300">
                Échangez avec des milliers de collectionneurs passionnés du monde entier.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Marché Dynamique</h3>
              <p className="text-gray-300">
                Achetez et vendez vos cartes sur notre marché avec des prix en temps réel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Shop Preview */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Boutique du Jour
            </h2>
            <p className="text-gray-300 text-lg">
              Découvrez notre sélection quotidienne de cartes rares
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {dailyShopCards.map((card) => (
              <div key={card.id} className="flex justify-center">
                <Card card={card} size="md" />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" onClick={() => onNavigate('shop')}>
              <Package className="w-5 h-5 mr-2" />
              Voir toute la Boutique
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">500+</div>
              <div className="text-gray-300">Cartes Uniques</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-gray-300">Collectionneurs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">25M+</div>
              <div className="text-gray-300">Speed Coins Échangés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-red-600/10 to-black/10 border border-red-500/20 rounded-2xl p-8">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à démarrer votre collection ?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Rejoignez des milliers de passionnés et construisez la collection F1 ultime !
            </p>
            {isAuthenticated ? (
              <Button size="lg" onClick={() => onNavigate('packs')}>
                Ouvrir votre premier Pack
              </Button>
            ) : (
              <Button size="lg" onClick={() => onNavigate('login')}>
                Créer un Compte Gratuit
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};