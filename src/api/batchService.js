import { API_BASE_URL } from '../lib/constants';

// Função auxiliar para obter um token de autenticação, se houver.
// No futuro, você pode implementar um sistema de JWT aqui.
const getAuthToken = () => {
    return localStorage.getItem('authToken');
}

// Função auxiliar para tratar as respostas da API de forma padronizada.
const handleResponse = async (response) => {
    if (response.ok) {
        if (response.status === 204) return; // No Content
        return response.json();
    } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro de comunicação com a API' }));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }
};

// =============================================
// ==           FUNÇÕES DE PARCEIROS          ==
// =============================================

/**
 * Cria um novo parceiro no banco de dados.
 * @param {object} partnerData - { publicKey, name, role, contactEmail }
 * @param {string} brandOwnerKey - A chave do Dono da Marca que está criando o parceiro.
 */
export const createPartner = async (partnerData, brandOwnerKey) => {
    const response = await fetch(`${API_BASE_URL}/api/partners`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...partnerData, brandOwnerKey }),
    });
    return handleResponse(response);
};

/**
 * Busca a lista de parceiros de um Dono de Marca específico.
 * @param {string} brandOwnerKey - A chave do Dono da Marca.
 */
export const getMyPartners = async (brandOwnerKey) => {
    if (!brandOwnerKey) return [];
    const response = await fetch(`${API_BASE_URL}/api/partners?owner=${brandOwnerKey}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    return handleResponse(response);
};


// =============================================
// ==             FUNÇÕES DE LOTES            ==
// =============================================

/**
 * Cria um novo lote de café.
 * @param {object} batchData - Objeto JSON com todos os dados necessários.
 */
export const createBatch = async (batchData) => {
    const response = await fetch(`${API_BASE_URL}/api/batches`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
    });
    return handleResponse(response);
};

/**
 * Busca a lista de lotes relevantes para um usuário (Dono da Marca ou responsável atual).
 * @param {string} userKey - A chave pública do usuário logado.
 */
export const getMyBatches = async (userKey) => {
    if (!userKey) return [];
    const response = await fetch(`${API_BASE_URL}/api/batches?user=${userKey}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    return handleResponse(response);
};

/**
 * Busca os detalhes completos de um lote específico (dados do DB + etapas on-chain).
 * @param {string} batchId - A PublicKey do lote.
 */
export const getBatchById = async (batchId) => {
    const response = await fetch(`${API_BASE_URL}/api/batches/${batchId}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    return handleResponse(response);
};

/**
 * Adiciona uma nova etapa a um lote existente.
 * @param {string} batchId - A PublicKey do lote.
 * @param {FormData} formData - Os dados da nova etapa (incluindo possíveis arquivos).
 * @param {string} userKey - A chave do usuário que está adicionando a etapa.
 */
export const addStageToBatch = async (batchId, formData, userKey) => {
    formData.append('userKey', userKey);
    const response = await fetch(`${API_BASE_URL}/api/batches/${batchId}/stages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: formData,
    });
    return handleResponse(response);
};

/**
 * Transfere a posse de um lote para um novo parceiro.
 * @param {string} batchId - A PublicKey do lote.
 * @param {object} transferData - { currentHolderKey, newHolderPartnerId }
 */
export const transferCustody = async (batchId, transferData) => {
    const response = await fetch(`${API_BASE_URL}/api/batches/${batchId}/transfer`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
    });
    return handleResponse(response);
};

/**
 * Finaliza um lote, selando seu histórico.
 * @param {string} batchId - A PublicKey do lote.
 * @param {object} ownerData - { brandOwnerKey }
 */
export const finalizeBatch = async (batchId, ownerData) => {
    const response = await fetch(`${API_BASE_URL}/api/batches/${batchId}/finalize`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
    });
    return handleResponse(response);
};