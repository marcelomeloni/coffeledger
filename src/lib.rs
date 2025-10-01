// src/lib.rs
use anchor_lang::prelude::*;

mod state;
mod instructions;
mod constants;
mod events;
mod errors;

use instructions::*;

declare_id!("Gm7ooEjFuvi9hS5vLUk6uK3xavwVm7rJXP7yjc6WHfbq");

#[program]
pub mod coffee_traceability {
    use super::*;

    /// Cria um novo lote de café e designa o primeiro responsável (`initial_holder`).
    pub fn create_batch(ctx: Context<CreateBatch>, id: String, producer_name: String, batch_data_hash: String, initial_holder: Pubkey) -> Result<()> {
        create_batch_handler(ctx, id, producer_name, batch_data_hash, initial_holder)
    }

    /// Adiciona uma nova etapa ao histórico de um lote.
    pub fn add_stage(ctx: Context<AddStage>, stage_name: String, stage_data_hash: String) -> Result<()> {
        add_stage_handler(ctx, stage_name, stage_data_hash)
    }

    /// Transfere a posse e responsabilidade de um lote para uma nova entidade.
    pub fn transfer_custody(ctx: Context<TransferCustody>, new_holder: Pubkey) -> Result<()> {
        transfer_custody_handler(ctx, new_holder)
    }

    /// Finaliza um lote, selando seu histórico de forma permanente.
    pub fn finalize_batch(ctx: Context<FinalizeBatch>) -> Result<()> {
        finalize_batch_handler(ctx)
    }
}