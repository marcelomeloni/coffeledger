// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Home, Package, PlusCircle, Users } from 'lucide-react';; // Ícones de https://lucide.dev/

const navLinks = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Lotes', href: '/batches', icon: Package },
  { name: 'Meus Parceiros', href: '/partners', icon: Users },
  { name: 'Criar Lote', href: '/batches/new', icon: PlusCircle },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <img src="/src/assets/logo.svg" alt="CaféChain Logo" className="h-8 w-auto" />
        <span className="ml-3 text-lg font-bold text-gray-800">CoffeLedger</span>
      </div>
      <nav className="flex-1 px-4 py-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            end // Garante que a rota '/' não fique ativa para outras rotas
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}