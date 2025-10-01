// src/components/common/Card.jsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Componente principal do Card
const Card = ({ className, children, ...props }) => (
  <div
    className={twMerge(clsx('bg-white rounded-lg border border-gray-200 shadow-sm', className))}
    {...props}
  >
    {children}
  </div>
);

// Sub-componente para o cabeçalho
const CardHeader = ({ className, children, ...props }) => (
  <div className={twMerge(clsx('p-4 sm:p-6 border-b border-gray-200', className))} {...props}>
    {children}
  </div>
);

// Sub-componente para o título
const CardTitle = ({ className, children, ...props }) => (
  <h3 className={twMerge(clsx('text-lg font-semibold text-gray-900', className))} {...props}>
    {children}
  </h3>
);

// Sub-componente para a descrição
const CardDescription = ({ className, children, ...props }) => (
  <p className={twMerge(clsx('mt-1 text-sm text-gray-500', className))} {...props}>
    {children}
  </p>
);

// Sub-componente para o conteúdo principal
const CardContent = ({ className, children, ...props }) => (
  <div className={twMerge(clsx('p-4 sm:p-6', className))} {...props}>
    {children}
  </div>
);

// Sub-componente para o rodapé
const CardFooter = ({ className, children, ...props }) => (
  <div className={twMerge(clsx('p-4 sm:p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg', className))} {...props}>
    {children}
  </div>
);

// Anexando os sub-componentes ao componente principal
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card };

// Como Usar:
/*
  <Card>
    <Card.Header>
      <Card.Title>Título do Card</Card.Title>
      <Card.Description>Descrição opcional.</Card.Description>
    </Card.Header>
    <Card.Content>
      <p>Conteúdo principal do card vai aqui.</p>
    </Card.Content>
    <Card.Footer>
      <Button variant="secondary">Ação no Rodapé</Button>
    </Card.Footer>
  </Card>
*/