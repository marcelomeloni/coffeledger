// src/instructions/transfer_custody.rs
use anchor_lang::prelude::*;
use crate::state::batch::{Batch, BatchStatus};
use crate::errors::CoffeeError;
use crate::events::CustodyTransferred;

pub fn transfer_custody_handler(ctx: Context<TransferCustody>, new_holder: Pubkey) -> Result<()> {
    let batch = &mut ctx.accounts.batch;

    require!(batch.status == BatchStatus::InProgress, CoffeeError::BatchIsFinalized);
    require_keys_eq!(ctx.accounts.current_holder.key(), batch.current_holder, CoffeeError::UnauthorizedActor);

    let old_holder = batch.current_holder;
    batch.current_holder = new_holder; // Simplesmente troca o detentor da posse

    emit!(CustodyTransferred {
        batch: batch.key(),
        from: old_holder,
        to: new_holder,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct TransferCustody<'info> {
    #[account(mut)]
    pub batch: Account<'info, Batch>,
    
    /// O detentor atual da posse, que está autorizando a transferência.
    pub current_holder: UncheckedAccount<'info>,
    
    /// A carteira da API que paga e assina.
    #[account(mut)]
    pub payer: Signer<'info>,
}