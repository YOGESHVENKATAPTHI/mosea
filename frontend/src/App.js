import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/:type/:id"
          element={
            <ProtectedRoute>
              <WatchPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;