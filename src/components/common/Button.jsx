// src/components/common/Button.jsx
import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

// Usando class-variance-authority para definir variantes de estilo
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'hover:bg-gray-100 text-gray-800',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

// Usando forwardRef para que o botão possa ser usado com bibliotecas de formulário
export const Button = forwardRef(({ className, variant, size, isLoading, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={twMerge(clsx(buttonVariants({ variant, size, className })))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
});

// Como Usar:
/*
  <Button>Botão Primário</Button>
  <Button variant="secondary" size="sm">Botão Secundário</Button>
  <Button variant="destructive" isLoading={true}>Deletando...</Button>
  <Button variant="ghost">Fantasma</Button>
*/