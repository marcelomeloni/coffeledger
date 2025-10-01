// src/hooks/usePartners.js
import useSWR from 'swr';
import { getMyPartners } from '../api/batchService'; // A função que criamos na API
import { useAuth } from '../contexts/AuthContext';

export function usePartners() {
  const { publicKey } = useAuth();
  const brandOwnerKey = publicKey?.toBase58();

  const cacheKey = brandOwnerKey ? `/api/partners?owner=${brandOwnerKey}` : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey, 
    () => getMyPartners(brandOwnerKey)
  );

  return {
    partners: data,
    isLoading,
    error,
    mutate, // Essencial para atualizar a lista após adicionar um novo parceiro
  };
}