import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { Dashboard } from './components/pages/Dashboard';
import { PacksPage } from './components/pages/PacksPage';
import { ShopPage } from './components/pages/ShopPage';
import { MarketplacePage } from './components/pages/MarketplacePage';

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/packs" element={<PacksPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
