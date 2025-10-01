// src/components/features/auth/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import toast from 'react-hot-toast';

export function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Obtém a função de login e os estados do nosso AuthContext
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Chama a função de login do contexto. A lógica de derivar a chave está lá.
    const success = await login(username, password);

    if (success) {
      toast.success('Login realizado com sucesso!');
      if (onLoginSuccess) {
        onLoginSuccess(); // Chama a função de callback para redirecionar
      }
    } 
    // Se não for sucesso, o AuthContext já terá um 'error' que podemos exibir.
  };

  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title>Acessar Plataforma</Card.Title>
        <Card.Description>
          Use suas credenciais para gerar sua carteira e acessar o dashboard.
        </Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Content className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700"
            >
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="ex: fazenda-sol-nascente"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          {/* Exibe a mensagem de erro vinda do AuthContext */}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </Card.Content>
        <Card.Footer>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
}