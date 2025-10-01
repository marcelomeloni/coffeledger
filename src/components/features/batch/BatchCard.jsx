// src/components/features/batch/BatchCard.jsx
import { Link } from 'react-router-dom';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Package, Calendar, User, Settings, PlusCircle, Eye } from 'lucide-react';

export function BatchCard({ batch, currentUserPublicKey }) {
  // ✨ CORREÇÃO: Não desestruturamos mais 'publicKey' e 'account'.
  // Lemos os dados diretamente do objeto 'batch' que vem do Supabase.
  
  const isOwner = currentUserPublicKey === batch.brand_owner_key;
  const isCurrentHolder = currentUserPublicKey === batch.current_holder_key;

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <Card.Header>
          <div className="flex items-start justify-between">
            <div>
              <Card.Title>{batch.onchain_id}</Card.Title>
              <Card.Description>Produtor: {batch.producer_name}</Card.Description>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-full text-xs font-semibold ${
              batch.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-700'
            }`}>
              <Package size={16} />
              <span>{batch.status === 'completed' ? 'Finalizado' : 'Em Progresso'}</span>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="space-y-3 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar size={14} className="mr-2" />
            {/* ✨ CORREÇÃO: Usa o campo 'onchain_created_at' e parseISO */}
            <span>Criado em: {new Date(batch.onchain_created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User size={14} className="mr-2" />
            <span className="truncate" title={batch.brand_owner_key}>Dono da Marca: {batch.brand_owner_key.slice(0, 8)}...</span>
          </div>
        </Card.Content>
      </div>

      <Card.Footer className="flex flex-col sm:flex-row gap-2">
        {/* ✨ CORREÇÃO: Lógica de permissão atualizada */}
        {isOwner && (
          // O Dono da Marca sempre vê o botão de "Gerenciar", que permite finalizar o lote.
          <Link to={`/batches/${batch.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              <Settings size={16} className="mr-2" />
              Gerenciar Lote
            </Button>
          </Link>
        )}

        {isCurrentHolder && !isOwner && (
          // O responsável atual (que não é o dono) vê o botão para "Adicionar Etapa".
          <Link to={`/batches/${batch.id}`} className="flex-1">
            <Button variant="primary" className="w-full">
              <PlusCircle size={16} className="mr-2" />
              Adicionar Etapa
            </Button>
          </Link>
        )}

        {!isOwner && !isCurrentHolder && (
           // Qualquer outra pessoa pode apenas visualizar.
           <Link to={`/batches/${batch.id}`} className="flex-1">
             <Button variant="secondary" className="w-full">
               <Eye size={16} className="mr-2" />
               Ver Histórico
             </Button>
           </Link>
        )}
      </Card.Footer>
    </Card>
  );
}