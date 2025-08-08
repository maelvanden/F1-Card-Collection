import React, { useState } from 'react';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGameStateContext } from '../../hooks/useGameState';
import { mockUser } from '../../data/mockData';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login } = useGameStateContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation de l'authentification
    const user = {
      ...mockUser,
      email: email || mockUser.email,
      username: username || mockUser.username
    };
    
    login(user);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h1>
            <p className="text-gray-300">
              {isLogin 
                ? 'Accédez à votre collection F1'
                : 'Créez votre compte de collectionneur'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="SpeedRacer"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              <span>{isLogin ? 'Se connecter' : 'Créer le compte'}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              {isLogin 
                ? "Pas encore de compte ? S'inscrire"
                : "Déjà un compte ? Se connecter"
              }
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs text-gray-400 text-center">
              Mode démo activé - Connectez-vous avec n'importe quelles données
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};