// src/components/features/batch/TransferCustodyForm.jsx
import { useState } from 'react';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { transferCustody } from '../../../api/batchService';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export function TransferCustodyForm({ batch, currentHolderKey, onTransferSuccess }) {
  // Filtra a lista de participantes para mostrar apenas os que ainda não são o holder atual
  const possibleNextHolders = batch.details.batch_participants.filter(
    p => p.partner.public_key !== currentHolderKey
  );

  const [newHolderPartnerId, setNewHolderPartnerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newHolderPartnerId) return toast.error("Selecione um parceiro para transferir.");

    setIsSubmitting(true);
    try {
      await transferCustody(batch.details.id, {
        currentHolderKey,
        newHolderPartnerId,
      });
      toast.success("Posse transferida com sucesso!");
      onTransferSuccess(); // Atualiza a página
    } catch (error) {
      toast.error(error.message || "Falha ao transferir posse.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Transferir Posse do Lote</Card.Title>
        <Card.Description>Passe a responsabilidade para o próximo parceiro na cadeia.</Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Content className="space-y-4">
          <div>
            <label htmlFor="newHolder" className="block text-sm font-medium text-gray-700">Próximo Responsável</label>
            <select
              id="newHolder"
              value={newHolderPartnerId}
              onChange={(e) => setNewHolderPartnerId(e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione um parceiro da lista...</option>
              {possibleNextHolders.map(({ partner }) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name} ({partner.role})
                </option>
              ))}
            </select>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Transferindo...' : 'Confirmar Transferência'}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
}