// src/pages/batches/index.jsx (VERSÃO MELHORADA)
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBatches } from '../../hooks/useBatches'; // Usando nosso hook
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { BatchCard } from '../../components/features/batch/BatchCard'; // ✨ Importe o novo componente
import { Plus } from 'lucide-react';

export default function BatchesListPage() {
  const { batches, isLoading, error } = useBatches();
  const { publicKey } = useAuth(); // Pega a chave do usuário logado

  const errorMessage = error ? 'Não foi possível carregar os lotes. Tente novamente.' : null;
  const currentUserPublicKey = publicKey?.toBase58();

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;
    if (!batches || batches.length === 0) {
      return <p className="text-gray-500 text-center">Nenhum lote encontrado.</p>;
    }

    // ✨ Substituímos a <table> por uma grade de cards
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {batches.map((batch) => (
  <BatchCard 
    key={batch.id} 
    batch={batch} 
    currentUserPublicKey={currentUserPublicKey} 
  />
))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Meus Lotes"
        subtitle="Gerencie e rastreie todos os seus lotes de café."
      >
        <Link to="/batches/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo Lote
          </Button>
        </Link>
      </PageHeader>

      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
}