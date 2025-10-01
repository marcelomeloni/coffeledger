// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Providers e Componentes Estruturais

import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Páginas
import PartnersListPage from './pages/partners';
import Dashboard from './pages/index';
import BatchesListPage from './pages/batches';
import NewBatchPage from './pages/batches/new';
import BatchDetailsPage from './pages/batches/[id]';
import LoginPage from './pages/login';

// Use "export default" para o componente principal
export default function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Rota Pública: Fora do Layout e desprotegida */}
                <Route path="/login" element={<LoginPage />} />

                {/* Rotas Privadas: Agrupadas para serem protegidas */}
                <Route 
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/batches" element={<BatchesListPage />} />
                                    <Route path="/batches/new" element={<NewBatchPage />} />
                                    <Route path="/partners" element={<PartnersListPage />} />
                                    <Route path="/batches/:id" element={<BatchDetailsPage />} />
                                </Routes>
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </AuthProvider>
    );
}