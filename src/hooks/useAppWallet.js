// src/hooks/useAppWallet.js
import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';

export const useAppWallet = () => {
    const walletAdapter = useWallet();
    const auth = useAuth();

    const appWallet = useMemo(() => {
        // Prioridade 1: Carteira externa (Phantom, etc.)
        if (walletAdapter.connected && walletAdapter.publicKey) {
            return {
                ...walletAdapter,
                walletType: 'adapter',
            };
        }

        // Prioridade 2: Carteira local (login/senha)
        if (auth.isAuthenticated && auth.keypair) {
            return {
                connected: true,
                connecting: auth.isLoading,
                disconnecting: false,
                publicKey: auth.publicKey,
                walletType: 'local',
                disconnect: auth.logout,
                signTransaction: async (transaction) => {
                    transaction.partialSign(auth.keypair);
                    return transaction;
                },
                signAllTransactions: async (transactions) => {
                    for (const tx of transactions) {
                        tx.partialSign(auth.keypair);
                    }
                    return transactions;
                },
            };
        }

        // Caso Padrão: Desconectado
        return {
            ...walletAdapter,
            connected: false,
            publicKey: null,
            walletType: 'none',
        };
    }, [walletAdapter, auth]);

    return appWallet;
};