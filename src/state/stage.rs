// src/state/stage.rs

use anchor_lang::prelude::*;
use crate::constants::*;

/// Representa uma única etapa no ciclo de vida do lote de café.
#[account]
pub struct Stage {
    /// Chave da conta Batch à qual esta etapa pertence.
    pub batch: Pubkey,
    /// Nome da etapa (ex: "Colheita", "Torra").
    pub stage_name: String,
    /// Timestamp de registro da etapa.
    pub timestamp: i64,
    /// Ator que registrou esta etapa.
    pub actor: Pubkey,
    /// Hash SHA-256 de um JSON off-chain com detalhes ricos da etapa (fotos, parâmetros, etc).
    pub stage_data_hash: String,
}

impl Stage {
    /// Calcula o espaço necessário para a conta Stage.
    pub const fn calculate_space(name_len: usize) -> usize {
        8 // Discriminator
        + 32 // batch: Pubkey
        + 4 + name_len // stage_name: String
        + 8 // timestamp: i64
        + 32 // actor: Pubkey
        + 4 + MAX_DATA_HASH_LEN // stage_data_hash: String
    }
}