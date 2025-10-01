// src/components/features/partners/AddPartnerModal.jsx
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../../common/Button';
import { createPartner } from '../../../api/batchService';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

// ✨ MUDANÇA 1: Transformamos o array de roles em um array de objetos
const roles = [
    { value: 'producer', label: 'Produtor' },
    { value: 'logistics', label: 'Logística' },
    { value: 'warehouse', label: 'Armazém' },
    { value: 'grader', label: 'Classificador' },
    { value: 'roaster', label: 'Torrefador' },
    { value: 'packager', label: 'Embalador' },
    { value: 'distributor', label: 'Distribuidor' }
];

export function AddPartnerModal({ isOpen, onClose, onPartnerAdded }) {
  const { publicKey } = useAuth();
  const [formData, setFormData] = useState({ name: '', publicKey: '', role: '', contactEmail: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey) return toast.error("Você não está conectado.");
    
    setIsSubmitting(true);
    try {
      await createPartner({
        name: formData.name,
        publicKey: formData.publicKey,
        role: formData.role, // O valor enviado para a API continua sendo em inglês
        contactEmail: formData.contactEmail
      }, publicKey.toBase58());
      
      toast.success("Parceiro adicionado com sucesso!");
      onPartnerAdded();
      onClose();
    } catch (error) {
      toast.error(error.message || "Falha ao adicionar parceiro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} /* ... */>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} /* ... */>
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Adicionar Novo Parceiro
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                    <input type="text" name="name" id="name" onChange={handleInputChange} className="mt-1 w-full border-gray-300 rounded-md" required />
                  </div>
                  <div>
                    <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700">Chave Pública (Carteira)</label>
                    <input type="text" name="publicKey" id="publicKey" onChange={handleInputChange} className="mt-1 w-full border-gray-300 rounded-md font-mono" required />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Papel do Parceiro</label>
                    <select name="role" id="role" onChange={handleInputChange} className="mt-1 w-full border-gray-300 rounded-md" required>
                      <option value="">Selecione um papel</option>
                      {/* ✨ MUDANÇA 2: Mapeamos o array de objetos para criar as opções */}
                      {roles.map(roleInfo => (
                        <option key={roleInfo.value} value={roleInfo.value}>
                          {roleInfo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">E-mail de Contato (Opcional)</label>
                    <input type="email" name="contactEmail" id="contactEmail" onChange={handleInputChange} className="mt-1 w-full border-gray-300 rounded-md" />
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" isLoading={isSubmitting}>Adicionar Parceiro</Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}