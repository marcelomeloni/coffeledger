import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createBatch } from '../../../api/batchService';
import { Button } from '../../common/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { usePartners } from '../../../hooks/usePartners';
import { Spinner } from '../../common/Spinner';
import { Check, Package, Users } from 'lucide-react';

const steps = [
  { id: 1, name: 'Dados do Lote', icon: Package },
  { id: 2, name: 'Participantes', icon: Users },
  { id: 3, name: 'Revisão', icon: Check },
];

// ✨ NOVO: Função auxiliar para gerar o ID do lote
const generateBatchId = (producerName) => {
  if (!producerName) return '';
  const year = new Date().getFullYear();
  const initials = producerName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
  // Em um app real, o "001" viria de uma contagem no banco de dados.
  // Aqui, usamos um placeholder simples.
  const sequence = '001'; 
  return `${initials}-${year}-${sequence}`;
};

export function CreateBatchWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    producerName: '',
    initialHolderKey: '',
    participants: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { publicKey } = useAuth();
  const { partners, isLoading: isLoadingPartners } = usePartners();

  // ✨ CORREÇÃO: Hooks movidos para o nível superior do componente
  const holder = useMemo(() => partners?.find(p => p.public_key === formData.initialHolderKey), [partners, formData.initialHolderKey]);
  const participantDetails = useMemo(() => formData.participants.map(id => partners?.find(p => p.id === id)).filter(Boolean), [partners, formData.participants]);

  // ✨ NOVO: Efeito para sugerir o ID automaticamente
  useEffect(() => {
    if (currentStep === 1 && formData.producerName) {
      const suggestedId = generateBatchId(formData.producerName);
      setFormData(prev => ({ ...prev, id: suggestedId }));
    }
  }, [formData.producerName, currentStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipantsChange = (partnerId) => {
    setFormData(prev => {
      const newParticipants = prev.participants.includes(partnerId)
        ? prev.participants.filter(id => id !== partnerId)
        : [...prev.participants, partnerId];
      return { ...prev, participants: newParticipants };
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey) return toast.error("Você precisa estar conectado.");
    
    setIsSubmitting(true);
    
    const batchData = {
      id: formData.id,
      producerName: formData.producerName,
      brandOwnerKey: publicKey.toBase58(),
      initialHolderKey: formData.initialHolderKey,
      participants: formData.participants,
    };

    try {
      const result = await createBatch(batchData);
      toast.success(result.message);
      navigate(`/batches/${result.batchAddress}`);
    } catch (error) {
      toast.error(error.message || 'Ocorreu um erro.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (isLoadingPartners) return <div className="flex justify-center p-8"><Spinner /></div>;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="producerName" className="block text-sm font-medium text-gray-700">Nome do Produtor/Fazenda Associada</label>
              <input type="text" name="producerName" value={formData.producerName} onChange={handleInputChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="Ex: Fazenda Sol Nascente" required />
            </div>
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID Único do Lote (Sugestão)</label>
              <input type="text" name="id" value={formData.id} onChange={handleInputChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 font-mono" placeholder="Gerado automaticamente..." required />
              <p className="mt-2 text-xs text-gray-500">Um ID será sugerido, mas você pode editá-lo se necessário.</p>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-6">
                <div>
                    <label htmlFor="initialHolderKey" className="block text-sm font-medium text-gray-700">Primeiro Responsável (Produtor)</label>
                    <p className="text-xs text-gray-500">Selecione o parceiro que iniciará o processo de rastreabilidade.</p>
                    <select name="initialHolderKey" value={formData.initialHolderKey} onChange={handleInputChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" required>
                        <option value="">Selecione um produtor...</option>
                        {partners?.filter(p => p.role === 'producer').map(p => <option key={p.id} value={p.public_key}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Elenco de Participantes do Lote</label>
                    <p className="text-xs text-gray-500">Selecione todos os parceiros que poderão interagir com este lote.</p>
                    <div className="mt-2 space-y-2 border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto">
                        {partners?.map(p => (
                        <label key={p.id} htmlFor={`partner-${p.id}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input
                            id={`partner-${p.id}`}
                            type="checkbox"
                            checked={formData.participants.includes(p.id)}
                            onChange={() => handleParticipantsChange(p.id)}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <div>
                            <span className="font-medium text-gray-800">{p.name}</span>
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">{p.role}</span>
                            </div>
                        </label>
                        ))}
                    </div>
                </div>
            </div>
        );
      case 3:
        return (
           <div>
            <h4 className="font-semibold text-gray-900 mb-4">Por favor, revise os dados antes de criar o lote.</h4>
            <dl className="space-y-4 text-sm divide-y divide-gray-200">
                <div className="pt-4 flex justify-between"><dt className="font-medium text-gray-600">ID do Lote:</dt><dd className="text-gray-800 font-mono">{formData.id}</dd></div>
                <div className="pt-4 flex justify-between"><dt className="font-medium text-gray-600">Produtor:</dt><dd className="text-gray-800">{formData.producerName}</dd></div>
                <div className="pt-4 flex justify-between"><dt className="font-medium text-gray-600">Primeiro Responsável:</dt><dd className="text-gray-800">{holder?.name || "Não selecionado"}</dd></div>
                <div className="pt-4"><dt className="font-medium text-gray-600">Elenco de Participantes:</dt><dd className="text-gray-800 mt-1">{participantDetails.map(p => p.name).join(', ') || "Nenhum"}</dd></div>
            </dl>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`flex-1 relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              { currentStep > step.id ? (
                <>
                  <div className="flex items-center text-sm font-semibold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                      <Check className="h-5 w-5 text-white" />
                    </span>
                    <span className="ml-2 hidden sm:inline text-gray-800">{step.name}</span>
                  </div>
                  {stepIdx < steps.length -1 && <div className="absolute top-4 left-4 -z-10 h-0.5 w-full bg-green-600" />}
                </>
              ) : currentStep === step.id ? (
                <>
                  <div className="flex items-center text-sm font-semibold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 ring-4 ring-green-200">
                      <step.icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="ml-2 hidden sm:inline text-green-700">{step.name}</span>
                  </div>
                  {stepIdx < steps.length -1 && <div className="absolute top-4 left-4 -z-10 h-0.5 w-full bg-gray-200" />}
                </>
              ) : (
                <>
                  <div className="flex items-center text-sm font-semibold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                      <step.icon className="h-5 w-5 text-gray-500" />
                    </span>
                    <span className="ml-2 hidden sm:inline text-gray-500">{step.name}</span>
                  </div>
                  {stepIdx < steps.length -1 && <div className="absolute top-4 left-4 -z-10 h-0.5 w-full bg-gray-200" />}
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 border-t border-gray-200 pt-8">
        {renderStepContent()}
      </div>

      <div className="mt-10 pt-5 border-t border-gray-200">
        <div className="flex justify-between">
          <Button variant="secondary" onClick={prevStep} disabled={currentStep === 1 || isSubmitting}>
            Voltar
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>Avançar</Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              {isSubmitting ? 'Criando Lote...' : 'Confirmar e Criar Lote'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}