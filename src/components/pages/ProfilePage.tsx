import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameStateContext } from '../../hooks/useGameState';
import { bannerOptions } from '../../data/banners';
import { Button } from '../ui/Button';

export const ProfilePage: React.FC = () => {
  const { username } = useParams();
  const { gameState, updateUserProfile } = useGameStateContext();
  const user = gameState.user;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatarUrl || '');
      setBannerUrl(user.bannerUrl || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!user || user.username !== username) {
    return <div className="text-white p-8">Profil introuvable</div>;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSelect = (url: string) => {
    setBannerUrl(url);
  };

  const handleSave = () => {
    updateUserProfile({ avatarUrl, bannerUrl, bio });
  };

  const topCards = [...gameState.userCards]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-48 bg-gray-700">
        {bannerUrl && (
          <img src={bannerUrl} alt="Bannière" className="w-full h-full object-cover" />
        )}
        <div className="absolute top-2 right-2 flex space-x-2">
          {bannerOptions.map((url) => (
            <button
              key={url}
              onClick={() => handleBannerSelect(url)}
              className="w-10 h-10 rounded overflow-hidden border-2 border-white"
            >
              <img src={url} alt="Banner option" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="relative flex items-end">
          <div className="relative -mt-16">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-500" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              size="sm"
              className="absolute bottom-0 right-0 translate-y-1/2"
              onClick={() => fileInputRef.current?.click()}
            >
              Changer
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Ajoutez une biographie"
            className="w-full mt-2 p-2 bg-black/30 rounded"
          />
          <p className="mt-2 text-sm text-gray-300">
            Compte créé le {new Date(user.registrationDate).toLocaleDateString('fr-FR')}
          </p>
          <p className="mt-1 text-sm text-gray-300">
            Nombre de cartes : {gameState.userCards.length}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Top 3 cartes les plus chères</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topCards.map((card) => (
              <div key={card.id} className="bg-black/30 p-4 rounded">
                <img src={card.imageUrl} alt={card.name} className="w-full h-32 object-cover rounded" />
                <div className="mt-2 text-center">
                  <p className="font-medium text-sm">{card.name}</p>
                  <p className="text-xs text-gray-300">{card.price} SC</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button>Échanger</Button>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
