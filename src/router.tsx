import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { Dashboard } from './components/pages/Dashboard';
import { PacksPage } from './components/pages/PacksPage';
import { ShopPage } from './components/pages/ShopPage';
import { MarketplacePage } from './components/pages/MarketplacePage';
import { CardDetailsPage } from './components/pages/CardDetailsPage';
import AchievementsPanel from './components/pages/AchievementsPanel';
import ProfilePage from './components/pages/ProfilePage';

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/achievements" element={<AchievementsPanel />} />
      <Route path="/packs" element={<PacksPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/card/:id" element={<CardDetailsPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
