import React from 'react';
import { Card as CardType, CardRarity } from '../../types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  showPrice?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const rarityColors = {
  [CardRarity.COMMON]: 'from-gray-400 to-gray-600',
  [CardRarity.RARE]: 'from-blue-400 to-blue-600',
  [CardRarity.EPIC]: 'from-purple-400 to-purple-600',
  [CardRarity.LEGENDARY]: 'from-yellow-400 to-orange-500',
  [CardRarity.MYTHIC]: 'from-pink-400 to-red-500'
};

const rarityGlow = {
  [CardRarity.COMMON]: 'shadow-gray-500/20',
  [CardRarity.RARE]: 'shadow-blue-500/30',
  [CardRarity.EPIC]: 'shadow-purple-500/30',
  [CardRarity.LEGENDARY]: 'shadow-yellow-500/40',
  [CardRarity.MYTHIC]: 'shadow-pink-500/50'
};

export const Card: React.FC<CardProps> = ({
  card,
  onClick,
  showPrice = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-32 h-44',
    md: 'w-40 h-56',
    lg: 'w-48 h-72'
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${rarityGlow[card.rarity]} border-2 border-transparent hover:border-red-300`}
      onClick={onClick}
    >
      <div className={`h-3 rounded-t-xl bg-gradient-to-r ${rarityColors[card.rarity]}`} />
      
      <div className="p-3 h-full flex flex-col">
        <div className="flex-1">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-20 object-cover rounded-lg mb-2"
          />
          
          <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">
            {card.name}
          </h3>
          
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {card.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${rarityColors[card.rarity]} text-white`}>
            {card.rarity.toUpperCase()}
          </span>
          
          {showPrice && (
            <div className="flex items-center text-xs font-bold text-yellow-600">
              <span>{card.price.toLocaleString()}</span>
              <span className="ml-1">SC</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};