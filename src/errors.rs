// src/errors.rs

use anchor_lang::prelude::*;

#[error_code]
pub enum CoffeeError {
    #[msg("Este ator não tem permissão para realizar esta ação.")]
    UnauthorizedActor,

    #[msg("Este lote já foi finalizado e não pode ser alterado.")]
    BatchIsFinalized,
    
    
}