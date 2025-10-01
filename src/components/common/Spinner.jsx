// src/components/common/Spinner.jsx
import { Loader2 } from 'lucide-react';

export function Spinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
      </div>
    );
  }

  return <Loader2 className="h-6 w-6 text-green-600 animate-spin" />;
}

// Como Usar:
/*
  // Spinner simples
  {loading && <Spinner />}

  // Spinner de página inteira
  {pageLoading && <Spinner fullPage />}
*/