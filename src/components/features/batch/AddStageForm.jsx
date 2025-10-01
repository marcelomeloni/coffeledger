// /components/features/batch/AddStageForm.jsx (VERSÃO CORRIGIDA)
import { useState } from 'react';
import { addStageToBatch } from '../../../api/batchService';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card'; // Importando Card para consistência visual
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext'; // ✨ 1. Importe o hook de autenticação

export function AddStageForm({ batchId, onStageAdded }) {
  const [stageName, setStageName] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ✨ 2. Pegue a chave pública do usuário logado
  const { publicKey } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✨ 3. Adicione a trava de segurança
    if (!publicKey) {
      return toast.error("Você precisa estar conectado para adicionar uma etapa.");
    }
    
    setLoading(true);

    const formData = new FormData();
    formData.append('stageName', stageName);
    formData.append('notes', notes); 
    if (file) {
      formData.append('attachment', file);
    }
    
    try {
      // ✨ 4. Passe a chave pública como terceiro argumento
      await addStageToBatch(batchId, formData, publicKey.toBase58());

      toast.success('Etapa adicionada com sucesso!');
      // Limpa o formulário
      setStageName('');
      setNotes('');
      setFile(null);
      onStageAdded(); // Atualiza a página de detalhes
    } catch (error) {
      toast.error(error.message || 'Falha ao adicionar etapa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Adicionar Nova Etapa</Card.Title>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Content className="space-y-4">
          <div>
            <label htmlFor="stageName" className="block text-sm font-medium text-gray-700">Nome da Etapa</label>
            <input
              id="stageName"
              type="text"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Ex: Torrefação"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas / Detalhes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Perfil de torra, temperatura, etc."
            />
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Anexo (Foto, PDF)</label>
            <input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
        </Card.Content>
        <Card.Footer>
          <Button type="submit" className="w-full" disabled={loading}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {loading ? 'Adicionando...' : 'Adicionar Etapa'}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
}