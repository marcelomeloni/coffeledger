// src/components/features/batch/BatchDetailsDisplay.jsx
import { Card } from '../../common/Card';

export function BatchDetailsDisplay({ batch }) {
  if (!batch) return null;

  const details = [
    { label: 'ID do Lote', value: batch.id },
    { label: 'Nome do Produtor', value: batch.producerName },
    { label: 'Criador (Carteira)', value: batch.creator, isMono: true },
    { label: 'Data de Criação', value: new Date(batch.createdAt * 1000).toLocaleDateString('pt-BR') },
    { label: 'Nº de Etapas', value: batch.nextStageIndex },
    { label: 'Hash dos Metadados', value: batch.batchDataHash, isMono: true, isHash: true },
  ];

  return (
    <Card>
      <Card.Header>
        <Card.Title>Informações do Lote</Card.Title>
        <Card.Description>Dados principais registrados na blockchain.</Card.Description>
      </Card.Header>
      <Card.Content>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          {details.map(({ label, value, isMono, isHash }) => (
            <div key={label}>
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className={`mt-1 text-sm text-gray-900 break-words ${isMono ? 'font-mono' : ''}`}>
                {isHash ? `${value.slice(0, 12)}...` : value}
              </dd>
            </div>
          ))}
        </dl>
      </Card.Content>
    </Card>
  );
}