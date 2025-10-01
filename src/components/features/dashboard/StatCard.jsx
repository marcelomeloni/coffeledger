// src/components/features/dashboard/StatCard.jsx
import { Card } from '../../common/Card';

export function StatCard({ icon, title, value, change }) {
  return (
    <Card>
      <Card.Content className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="text-xs text-gray-400 mt-1">{change}</p>}
        </div>
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
          {icon}
        </div>
      </Card.Content>
    </Card>
  );
}