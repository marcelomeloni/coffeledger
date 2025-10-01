import { PublicKey } from '@solana/web3.js';
import { program, wallet } from '../utils/solana.js';
import { supabase } from '../utils/supabase.js';
import { uploadJson } from '../services/ipfsService.js';
import sha256 from 'crypto-js/sha256.js';

const BATCH_SEED = 'batch';
const STAGE_SEED = 'stage';

// POST /api/batches - Dono da Marca cria um novo lote
export const createBatch = async (req, res) => {
    try {
        const { id, producerName, brandOwnerKey, initialHolderKey, participants, ...metadata } = req.body;
        
        if (!id || !brandOwnerKey || !initialHolderKey) {
            return res.status(400).json({ error: 'id, brandOwnerKey e initialHolderKey são obrigatórios.' });
        }

        const brandOwnerPk = new PublicKey(brandOwnerKey);
        const initialHolderPk = new PublicKey(initialHolderKey);
        
        const batchDataHash = sha256(JSON.stringify({ producerName, ...metadata })).toString();
        const [batchPda] = await PublicKey.findProgramAddress([Buffer.from(BATCH_SEED), Buffer.from(id)], program.programId);

        // --- Passo 1: Transação On-chain ---
        const txSignature = await program.methods
            .createBatch(id, producerName || '', batchDataHash, initialHolderPk)
            .accounts({
                batch: batchPda,
                brandOwner: brandOwnerPk,
                payer: wallet.publicKey,
                systemProgram: PublicKey.default,
            })
            .rpc();

        // --- Passo 2: Se a transação on-chain for bem-sucedida, salvar no cache do Supabase ---
        const batchAddress = batchPda.toBase58();

        const { error: batchError } = await supabase.from('batches').insert({
            id: batchAddress,
            brand_owner_key: brandOwnerKey,
            onchain_id: id,
            producer_name: producerName,
            onchain_created_at: new Date().toISOString(),
            current_holder_key: initialHolderKey,
            status: 'inProgress',
            onchain_next_stage_index: 0,
        });

        if (batchError) throw batchError;

        // --- Passo 3: Adicionar os participantes pré-definidos ("Elenco") ao lote ---
        if (participants && participants.length > 0) {
            const participantRows = participants.map(partnerId => ({
                batch_id: batchAddress,
                partner_id: partnerId,
            }));
            const { error: participantsError } = await supabase.from('batch_participants').insert(participantRows);
            if (participantsError) throw participantsError;
        }

        res.status(201).json({ 
            message: 'Lote criado com sucesso na blockchain e no banco de dados!', 
            transaction: txSignature,
            batchAddress: batchAddress,
        });
    } catch (error) {
        console.error("Erro ao criar lote:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/batches - Listar lotes do usuário (lendo do cache rápido do Supabase)
export const getMyBatches = async (req, res) => {
    try {
        const userKey = req.query.user;
        if (!userKey) {
            return res.status(400).json({ error: 'O parâmetro de query "user" é obrigatório.' });
        }

        // Busca lotes onde o usuário é o dono OU o detentor atual da posse
        const { data, error } = await supabase
            .from('batches')
            .select('*')
            .or(`brand_owner_key.eq.${userKey},current_holder_key.eq.${userKey}`);
            
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao listar lotes:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/batches/:id - Detalhes de um lote
export const getBatchDetails = async (req, res) => {
    try {
        const batchAddress = req.params.id;

        // --- Passo 1: Busca os dados ricos do cache do Supabase ---
        // Esta busca já é poderosa e traz o lote e seus parceiros.
        const { data: batchData, error: dbError } = await supabase
            .from('batches')
            .select('*, batch_participants(partner:partners(*))')
            .eq('id', batchAddress)
            .single();
        
        if (dbError) throw dbError;
        if (!batchData) return res.status(404).json({ error: 'Lote não encontrado no banco de dados.' });

        // --- Passo 2: Busca o histórico de etapas (somente on-chain) ---
        // ✨ CORREÇÃO: Removemos o 'program.account.batch.fetch()' redundante.
        // Usamos o 'onchain_next_stage_index' que já veio do Supabase.
        const stagesPromises = [];
        for (let i = 0; i < batchData.onchain_next_stage_index; i++) {
            const indexBytes = Buffer.alloc(2);
            indexBytes.writeUInt16LE(i, 0);
            
            const [stagePda] = await PublicKey.findProgramAddress(
                [Buffer.from(STAGE_SEED), new PublicKey(batchAddress).toBuffer(), indexBytes],
                program.programId
            );
            stagesPromises.push(program.account.stage.fetch(stagePda).then(stageAccount => ({
                publicKey: stagePda.toBase58(),
                ...cleanAccountData(stageAccount),
            })));
        }
        const stages = await Promise.all(stagesPromises);

        // --- Passo 3: Combina tudo e envia para o frontend ---
        res.status(200).json({ 
            details: batchData,
            stages: stages,
        });
    } catch (error) {
        console.error("Erro ao buscar detalhes do lote:", error);
        res.status(500).json({ error: "Ocorreu um erro interno ao processar sua requisição." });
    }
};

// POST /api/batches/:id/stages - Adicionar etapa
export const addStage = async (req, res) => {
    try {
        const { stageName, userKey } = req.body;
        const batchAddress = req.params.id;

        // ... lógica de IPFS e outros metadados ...
        const stageDataHash = sha256(JSON.stringify(req.body)).toString();

        // --- Passo 1: Verificação de segurança no Supabase ---
        const { data: batchData, error: dbError } = await supabase
            .from('batches').select('current_holder_key, status').eq('id', batchAddress).single();
        if (dbError || !batchData) return res.status(404).json({ error: "Lote não encontrado." });
        if (batchData.status !== 'inProgress') return res.status(403).json({ error: "Lote já finalizado." });
        if (batchData.current_holder_key !== userKey) return res.status(403).json({ error: "Usuário não é o detentor da posse." });

        // --- Passo 2: Transação On-chain ---
        const onChainAccount = await program.account.batch.fetch(new PublicKey(batchAddress));
        const indexBytes = Buffer.alloc(2);
        indexBytes.writeUInt16LE(onChainAccount.nextStageIndex, 0);
        const [stagePda] = await PublicKey.findProgramAddress(
            [Buffer.from(STAGE_SEED), new PublicKey(batchAddress).toBuffer(), indexBytes],
            program.programId
        );
        const txSignature = await program.methods
            .addStage(stageName, stageDataHash)
            .accounts({
                batch: new PublicKey(batchAddress),
                stage: stagePda,
                actor: new PublicKey(userKey),
                payer: wallet.publicKey,
                systemProgram: PublicKey.default,
            })
            .rpc();

       res.status(201).json({ message: 'Etapa adicionada com sucesso!', transaction: txSignature });
        
        
        supabase
            .from('batches')
            .update({ onchain_next_stage_index: onChainAccount.nextStageIndex + 1 })
            .eq('id', batchAddress)
            .then(({ error }) => {
                if (error) console.error("Falha ao atualizar o cache de next_stage_index:", error);
            });
    } catch (error) {
        console.error("Erro ao adicionar etapa:", error);
        res.status(500).json({ error: error.message });
    }
};

// POST /api/batches/:id/transfer - Transferir posse
export const transferCustody = async (req, res) => {
    const { currentHolderKey, newHolderPartnerId } = req.body;
    const batchAddress = req.params.id;

    try {
        // --- Passo 1: Verificações de segurança no Supabase ---
        const { data: batchData, error: batchDbError } = await supabase
            .from('batches').select('current_holder_key').eq('id', batchAddress).single();
        if (batchDbError || batchData.current_holder_key !== currentHolderKey) {
            return res.status(403).json({ error: "Apenas o detentor atual pode transferir a posse." });
        }

        const { data: participant, error: checkError } = await supabase
            .from('batch_participants').select('*, partner:partners(public_key)').eq('batch_id', batchAddress).eq('partner_id', newHolderPartnerId).single();
        if (checkError || !participant) {
            return res.status(403).json({ error: "O parceiro de destino não está autorizado para este lote." });
        }
        const newHolderOnChainKey = new PublicKey(participant.partner.public_key);

        // --- Passo 2: Transação On-chain ---
        const txSignature = await program.methods
            .transferCustody(newHolderOnChainKey)
            .accounts({
                batch: new PublicKey(batchAddress),
                currentHolder: new PublicKey(currentHolderKey),
                payer: wallet.publicKey,
            })
            .rpc();

        // --- Passo 3: Atualizar o cache no Supabase ---
        const { error: updateError } = await supabase
            .from('batches').update({ current_holder_key: newHolderOnChainKey.toBase58() }).eq('id', batchAddress);
        if (updateError) throw updateError;
        
        res.status(200).json({ message: 'Posse transferida com sucesso!', transaction: txSignature });
    } catch (error) {
        console.error("Erro ao transferir posse:", error);
        res.status(500).json({ error: error.message });
    }
};

// POST /api/batches/:id/finalize - Finalizar lote
export const finalizeBatch = async (req, res) => {
    const { brandOwnerKey } = req.body;
    const batchAddress = req.params.id;

    try {
        // --- Passo 1: Verificação de segurança no Supabase ---
        const { data: batchData, error: dbError } = await supabase
            .from('batches').select('brand_owner_key').eq('id', batchAddress).single();
        if (dbError || batchData.brand_owner_key !== brandOwnerKey) {
            return res.status(403).json({ error: "Apenas o Dono da Marca pode finalizar o lote." });
        }

        // --- Passo 2: Transação On-chain ---
        const txSignature = await program.methods.finalizeBatch().accounts({
            batch: new PublicKey(batchAddress),
            brandOwner: new PublicKey(brandOwnerKey),
            payer: wallet.publicKey,
        }).rpc();

        // --- Passo 3: Atualizar o cache no Supabase ---
        const { error: updateError } = await supabase
            .from('batches').update({ status: 'completed' }).eq('id', batchAddress);
        if (updateError) throw updateError;

        res.status(200).json({ message: 'Lote finalizado com sucesso!', transaction: txSignature });
    } catch (error) {
        console.error("Erro ao finalizar lote:", error);
        res.status(500).json({ error: error.message });
    }
};