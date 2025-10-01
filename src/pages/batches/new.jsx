// src/pages/batches/new.jsx
import { PageHeader } from '../../components/common/PageHeader';
import { CreateBatchWizard } from '../../components/features/batch/CreateBatchWizard';

export default function NewBatchPage() {
  return (
    <div>
      <PageHeader
        title="Criar Novo Lote de Café"
        subtitle="Siga os passos para registrar um novo lote na blockchain."
      />
      <div className="mt-8">
        <CreateBatchWizard />
      </div>
    </div>
  );
}