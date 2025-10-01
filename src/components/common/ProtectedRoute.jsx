// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { Spinner } from "./Spinner";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Se ainda estiver verificando a autenticação (ex: lendo do localStorage),
  // mostramos um spinner de página inteira para evitar piscar a tela de login.
  if (isLoading) {
    return <Spinner fullPage />;
  }
  
  // Se não estiver autenticado, redireciona para a página de login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza a página solicitada.
  return children;
}