import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import LoginForm from './components/Auth/LoginForm';

// Import page components (we'll create these next)
import HomePage from './pages/HomePage';
import CompetitionsPage from './pages/CompetitionsPage';
import GamesPage from './pages/GamesPage';
import ResultsPage from './pages/ResultsPage';
import ClassificationPage from './pages/ClassificationPage';
import SchoolsPage from './pages/SchoolsPage';

// Teacher pages
import MyTeamsPage from './pages/teacher/MyTeamsPage';
import MyGamesPage from './pages/teacher/MyGamesPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={!user ? <LoginForm /> : <Navigate to="/" replace />} 
      />
      
      {/* Protected Routes - All users (including visitors) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/competicoes" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CompetitionsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jogos" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <GamesPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resultados" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResultsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/classificacao" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ClassificationPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/escolas" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <SchoolsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Teacher Routes */}
      <Route 
        path="/meus-times" 
        element={
          <ProtectedRoute allowedRoles={['PROFESSOR']}>
            <AppLayout>
              <MyTeamsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meus-jogos" 
        element={
          <ProtectedRoute allowedRoles={['PROFESSOR']}>
            <AppLayout>
              <MyGamesPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['ADM']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

