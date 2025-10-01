// src/components/features/dashboard/DashboardChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DashboardChart({ batches }) {
  const monthlyData = useMemo(() => {
    if (!batches || batches.length === 0) return [];

    const monthlyGroups = batches.reduce((acc, batch) => {
      // ✨ CORREÇÃO: Lê a data do campo 'onchain_created_at', que é uma string ISO
      const date = parseISO(batch.onchain_created_at);
      
      if (isNaN(date)) return acc; // Ignora datas inválidas

      const month = format(date, 'MMM yyyy', { locale: ptBR });
      
      if (!acc[month]) {
        acc[month] = { name: month, lotes: 0, date: startOfMonth(date) };
      }
      acc[month].lotes++;
      
      return acc;
    }, {});

    return Object.values(monthlyGroups).sort((a, b) => a.date - b.date);
  }, [batches]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          <Bar dataKey="lotes" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Para otimização, podemos memoizar o componente para evitar re-renderizações desnecessárias
import { useMemo } from 'react';
// ...
// e envolver o 'export default' com memo:
// export default React.memo(DashboardChart); 
// Mas a versão acima com useMemo já resolve o problema principal.