// src/constants.rs

use anchor_lang::prelude::*;

#[constant]
pub const BATCH_SEED: &[u8] = b"batch";

#[constant]
pub const STAGE_SEED: &[u8] = b"stage";

// --- Constantes para Cálculo de Espaço ---


pub const MAX_BATCH_ID_LEN: usize = 32;
pub const MAX_PRODUCER_NAME_LEN: usize = 64;
pub const MAX_STAGE_NAME_LEN: usize = 32;
pub const MAX_DATA_HASH_LEN: usize = 64; 

// Tamanho máximo do vetor de atores autorizados
pub const MAX_AUTHORIZED_ACTORS: usize = 10;