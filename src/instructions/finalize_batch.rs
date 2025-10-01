// src/instructions/finalize_batch.rs

use anchor_lang::prelude::*;
use crate::state::batch::{Batch, BatchStatus};
use crate::errors::CoffeeError;
use crate::events::BatchFinalized;

pub fn finalize_batch_handler(ctx: Context<FinalizeBatch>) -> Result<()> {
    let batch = &mut ctx.accounts.batch;

    // Apenas o criador original (Dono da Marca) pode finalizar o lote
    require_keys_eq!(ctx.accounts.brand_owner.key(), batch.creator, CoffeeError::UnauthorizedActor);

    batch.status = BatchStatus::Completed;

    emit!(BatchFinalized {
        batch: batch.key(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct FinalizeBatch<'info> {
    #[account(mut)]
    pub batch: Account<'info, Batch>,
    
    /// O Dono da Marca que está finalizando o lote.
    pub brand_owner: UncheckedAccount<'info>,

    /// A carteira da API que paga e assina.
    #[account(mut)]
    pub payer: Signer<'info>,
}