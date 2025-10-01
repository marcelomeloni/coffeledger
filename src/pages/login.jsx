// src/pages/login.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/features/auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Efeito para redirecionar o usuário caso ele já esteja logado
  // e acesse a página de login diretamente.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redireciona para o Dashboard
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/'); // Redireciona para o Dashboard após o login
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <img src="/src/assets/logo.svg" alt="CaféChain Logo" className="mx-auto h-12 w-auto" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          CaféChain
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Rastreabilidade de café na velocidade da Solana.
        </p>
      </div>
      
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}