// src/components/common/PageHeader.jsx

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-gray-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm sm:text-base text-gray-500">{subtitle}</p>
        )}
      </div>
      {/* 'children' é usado para renderizar botões de ação ou outros elementos */}
      {children && (
        <div className="flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}

// Como Usar:
/*
  <PageHeader
    title="Meus Lotes de Café"
    subtitle="Gerencie e rastreie todos os seus lotes."
  >
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Criar Novo Lote
    </Button>
  </PageHeader>
*/