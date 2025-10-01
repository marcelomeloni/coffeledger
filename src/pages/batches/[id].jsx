// /pages/batches/[id].jsx (VERSÃO ATUALIZADA)
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getBatchById, finalizeBatch } from '../../api/batchService';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StageTimeline } from '../../components/features/batch/StageTimeline';
import { AddStageForm } from '../../components/features/batch/AddStageForm';
import { TransferCustodyForm } from '../../components/features/batch/TransferCustodyForm'; // ✨ NOVO IMPORT
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export default function BatchDetailsPage() {
  const { id } = useParams();
  const { publicKey } = useAuth();

  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBatchById(id);
      setBatchData(data);
    } catch (err) {
      setError('Lote não encontrado ou falha ao carregar.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBatchDetails();
  }, [fetchBatchDetails]);

  const handleFinalize = async () => {
    if (!publicKey) return toast.error("Você precisa estar conectado.");
    const confirmation = window.confirm("Tem certeza que deseja finalizar este lote? Esta ação é irreversível.");
    if (!confirmation) return;

    try {
      await finalizeBatch(id, { brandOwnerKey: publicKey.toBase58() });
      toast.success("Lote finalizado com sucesso!");
      fetchBatchDetails(); // Atualiza os dados
    } catch (error) {
      toast.error(error.message || "Falha ao finalizar o lote.");
    }
  };

  if (loading) return <Spinner fullPage />;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;
  if (!batchData) return null;

  const userAddress = publicKey?.toBase58();
  const isOwner = userAddress === batchData.details.brand_owner_key;
  const isCurrentHolder = userAddress === batchData.details.current_holder_key;
  const isFinalized = batchData.details.status === 'completed';

  return (
    <div>
      <PageHeader
        title={`Lote: ${batchData.details.onchain_id}`}
        subtitle={`Produtor: ${batchData.details.producer_name}`}
      >
        {isOwner && !isFinalized && (
          <Button onClick={handleFinalize}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalizar Lote
          </Button>
        )}
      </PageHeader>
      
      {isFinalized && (
        <div className="p-4 mb-6 text-center bg-green-100 text-green-800 rounded-lg">
          Este lote foi finalizado e seu histórico é imutável.
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header><Card.Title>Histórico de Rastreabilidade</Card.Title></Card.Header>
            <Card.Content>
              <StageTimeline stages={batchData.stages} />
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          {/* ✨ LÓGICA ATUALIZADA: Mostra um dos dois formulários, mas nunca os dois */}
          {isCurrentHolder && !isFinalized && (
            <>
              <AddStageForm batchId={id} onStageAdded={fetchBatchDetails} />
              <TransferCustodyForm 
                batch={batchData} 
                currentHolderKey={userAddress}
                onTransferSuccess={fetchBatchDetails} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}