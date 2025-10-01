// src/components/features/batch/StageTimeline.jsx
import { Leaf, Flame, Truck, Warehouse, CheckCircle2 } from 'lucide-react';

// Mapeia nomes de etapas para ícones para uma UI mais rica
const stageIcons = {
  default: <CheckCircle2 className="h-5 w-5 text-white" />,
  colheita: <Leaf className="h-5 w-5 text-white" />,
  torra: <Flame className="h-5 w-5 text-white" />,
  distribuição: <Truck className="h-5 w-5 text-white" />,
  armazenamento: <Warehouse className="h-5 w-5 text-white" />,
};

const getStageIcon = (stageName) => {
  const name = stageName.toLowerCase();
  for (const key in stageIcons) {
    if (name.includes(key)) {
      return stageIcons[key];
    }
  }
  return stageIcons.default;
};

export function StageTimeline({ stages }) {
  if (!stages || stages.length === 0) {
    return <p className="text-gray-500 text-center py-4">Nenhuma etapa registrada ainda.</p>;
  }

  return (
    <ol className="relative border-l border-gray-200 ml-3">
      {stages.map((stage, index) => (
        <li key={stage.publicKey || index} className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-10 h-10 bg-green-500 rounded-full -left-5 ring-4 ring-white">
            {getStageIcon(stage.stageName)}
          </span>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              {stage.stageName}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
              Registrado em: {new Date(stage.timestamp * 1000).toLocaleString('pt-BR')}
            </time>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Ator:</span> 
              <span className="font-mono ml-2 bg-gray-200 px-1 py-0.5 rounded text-xs">{stage.actor.toBase58().slice(0, 8)}...</span>
            </p>
            {/* O hash aponta para o JSON de metadados no IPFS */}
            <a 
              href={`https://ipfs.io/ipfs/${stage.stageDataHash}`} // Exemplo de link para o CID no IPFS
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center mt-3 text-sm font-medium text-green-600 hover:text-green-800"
            >
              Ver detalhes off-chain
            </a>
          </div>
        </li>
      ))}
    </ol>
  );
}