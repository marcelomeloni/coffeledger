// src/hooks/useBatches.js
import useSWR from 'swr';
import { getMyBatches } from '../api/batchService'; // ✨ NOME CORRIGIDO AQUI
import { useAuth } from '../contexts/AuthContext';

export function useBatches() {
  const { publicKey } = useAuth();
  const userKey = publicKey?.toBase58();

  const cacheKey = userKey ? `/api/batches?user=${userKey}` : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey, 
    () => getMyBatches(userKey) // ✨ E AQUI TAMBÉM
  );

  return {
    batches: data,
    isLoading,
    error,
    mutate,
  };
}