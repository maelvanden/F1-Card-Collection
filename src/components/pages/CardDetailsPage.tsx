import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleCards, dailyShopCards, marketListings } from '../../data/mockData';
import { Card as CardType } from '../../types';
import { Button } from '../ui/Button';

// Helper to gather all available cards (from mock data for now)
const getAllCards = (): CardType[] => {
  const marketCards = marketListings.map((listing) => listing.card);
  return [...sampleCards, ...dailyShopCards, ...marketCards];
};

export const CardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardType | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      // In a real application this would be an API call
      const allCards = getAllCards();
      const found = allCards.find((c) => c.id === id) || null;
      setCard(found);
    };
    fetchCard();
  }, [id]);

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Carte introuvable</h2>
          <Button onClick={() => navigate('/dashboard')}>Retour à la collection</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Button variant="outline" className="mb-6" onClick={() => navigate('/dashboard')}>
          Retour à la collection
        </Button>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 grid md:grid-cols-2 gap-6">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-72 object-cover rounded-lg"
          />

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-4">{card.name}</h1>
            <div className="text-gray-300 mb-6 space-y-1 text-sm">
              <p>Pilote historique de la F1.</p>
              <p>Sept fois champion du monde.</p>
              <p>Totalise 100 victoires et 345 podiums.</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Stats</h2>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>Champion du monde Pilotes : 7</li>
                <li>Nombre de courses gagnées : 100</li>
                <li>Nombre de podium : 345</li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Infos</h2>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>Type de carte : Pilote F1</li>
                <li>Rareté : Légendaire</li>
                <li>Valeur : 15 000</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Historique</h2>
              {card.obtainedDate ? (
                <p className="text-gray-300 text-sm">
                  Obtenue le {new Date(card.obtainedDate).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-gray-300 text-sm">Historique indisponible.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;

