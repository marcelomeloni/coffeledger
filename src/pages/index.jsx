// src/pages/index.jsx
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBatches } from '../hooks/useBatches';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/features/dashboard/StatCard';
import { DashboardChart } from '../components/features/dashboard/DashboardChart';
import { Plus, Package, Layers, Users } from 'lucide-react';

// Função para obter a saudação baseada na hora local
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde'; // Considerando o horário de SP às 17:27
    return 'Boa noite';
};

// Componente para o estado vazio
const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhum lote de café encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">Comece a rastrear sua produção agora mesmo.</p>
        <div className="mt-6">
            <Link to="/batches/new">
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Lote
                </Button>
            </Link>
        </div>
    </div>
);


export default function Dashboard() {
    const { publicKey } = useAuth();
    const { batches, isLoading, error } = useBatches();

    const stats = useMemo(() => {
        if (!batches || batches.length === 0) {
            return { totalBatches: 0, totalInProgress: 0 };
        }

        // ✨ CORREÇÃO: Calculamos as estatísticas com base nos novos dados do Supabase.
        // Por enquanto, simplifiquei para os dados que temos certeza que existem na tabela.
        const totalInProgress = batches.filter(b => b.status === 'inProgress').length;
        
        return {
            totalBatches: batches.length,
            totalInProgress: totalInProgress,
        };
    }, [batches]);
    
    const greeting = getGreeting();
    const displayName = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : '';

    if (isLoading) return <Spinner fullPage />;
    if (error) return <p className="text-red-500 text-center p-8">Não foi possível carregar os dados do dashboard.</p>;

    return (
        <div>
            <PageHeader
                title={`${greeting}, ${displayName}`}
                subtitle="Aqui está um resumo da sua operação de rastreabilidade."
            >
                <Link to="/batches/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Novo Lote
                    </Button>
                </Link>
            </PageHeader>

            {!batches || batches.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard 
                        title="Total de Lotes" 
                        value={stats.totalBatches}
                        icon={<Package className="h-6 w-6 text-green-600" />} 
                    />
                    <StatCard 
                        title="Lotes em Progresso" 
                        value={stats.totalInProgress}
                        icon={<Layers className="h-6 w-6 text-green-600" />} 
                    />
                    {/* Placeholder para uma futura métrica */}
                    <StatCard 
                        title="Parceiros Ativos" 
                        value={"-"} // Poderíamos buscar isso da tabela de parceiros
                        icon={<Users className="h-6 w-6 text-green-600" />} 
                    />

                    <div className="sm:col-span-2 xl:col-span-3">
                        <Card>
                            <Card.Header>
                                <Card.Title>Lotes Criados por Mês</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <DashboardChart batches={batches} />
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}