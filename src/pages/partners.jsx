// src/pages/partners.jsx
import { useState } from 'react';
import { usePartners } from '../hooks/usePartners';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { AddPartnerModal } from '../components/features/partners/AddPartnerModal';
import { UserPlus } from 'lucide-react';

export default function PartnersListPage() {
  const { partners, isLoading, error, mutate } = usePartners();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePartnerAdded = () => {
    // A função 'mutate' do SWR diz para ele buscar os dados novamente.
    // Isso atualiza a lista sem precisar recarregar a página!
    mutate();
  };

  return (
    <>
      <PageHeader
        title="Meus Parceiros"
        subtitle="Gerencie as empresas e pessoas que participam da sua cadeia de suprimentos."
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Parceiro
        </Button>
      </PageHeader>

      <div className="mt-8">
        {isLoading && <Spinner />}
        {error && <p className="text-red-500">Falha ao carregar parceiros.</p>}
        {!isLoading && !error && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Papel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chave Pública</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners?.map(partner => (
                  <tr key={partner.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{partner.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {partner.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono truncate" title={partner.public_key}>
                      {partner.public_key}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddPartnerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPartnerAdded={handlePartnerAdded}
      />
    </>
  );
}