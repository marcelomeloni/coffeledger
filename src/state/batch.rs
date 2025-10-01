// src/state/batch.rs

use anchor_lang::prelude::*;
use crate::constants::*;

// ✨ SIMPLIFICADO: Não precisamos mais do Enum Role on-chain.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BatchStatus {
    InProgress,
    Completed,
    Cancelled,
}

#[account]
pub struct Batch {
    /// O Dono da Marca, criador original do registro.
    pub creator: Pubkey,
    /// ID único e legível do lote.
    pub id: String,
    /// Nome do produtor ou fazenda.
    pub producer_name: String,
    /// Timestamp de criação.
    pub created_at: i64,
    /// Índice da próxima etapa.
    pub next_stage_index: u16,
    /// Hash dos metadados do lote.
    pub batch_data_hash: String,
    
    // ✨ SIMPLIFICADO: Apenas status e o detentor atual.
    /// Status atual do lote.
    pub status: BatchStatus,
    /// A chave pública da entidade que tem a posse atual do lote ("dono do bastão").
    pub current_holder: Pubkey,
}

impl Batch {
    /// Calcula o espaço necessário para a conta Batch.
    pub const fn calculate_space(id_len: usize, name_len: usize) -> usize {
        8  // Discriminator
        + 32 // creator: Pubkey
        + 4 + id_len // id: String
        + 4 + name_len // producer_name: String
        + 8  // created_at: i64
        + 2  // next_stage_index: u16
        + 4 + MAX_DATA_HASH_LEN // batch_data_hash: String
        + 1 + 1 // status: BatchStatus (1 para enum, 1 para o valor)
        + 32 // current_holder: Pubkey
    }
}