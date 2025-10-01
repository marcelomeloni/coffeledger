// src/instructions/create_batch.rs
use anchor_lang::prelude::*;
use crate::state::batch::*;
use crate::constants::*;
use crate::events::*;

pub fn create_batch_handler(ctx: Context<CreateBatch>, id: String, producer_name: String, batch_data_hash: String, initial_holder: Pubkey) -> Result<()> {
    let batch = &mut ctx.accounts.batch;
    
    batch.creator = ctx.accounts.brand_owner.key();
    batch.id = id.clone();
    batch.producer_name = producer_name.clone();
    batch.created_at = Clock::get()?.unix_timestamp;
    batch.next_stage_index = 0;
    batch.batch_data_hash = batch_data_hash;
    batch.status = BatchStatus::InProgress;
    batch.current_holder = initial_holder; // Define o primeiro responsável

    emit!(BatchCreated {
        batch_id: id,
        creator: ctx.accounts.brand_owner.key(),
        producer_name: producer_name,
        timestamp: batch.created_at,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: String, producer_name: String)]
pub struct CreateBatch<'info> {
    #[account(
        init,
        payer = payer,
        space = Batch::calculate_space(id.len(), producer_name.len()),
        seeds = [BATCH_SEED, id.as_bytes()],
        bump
    )]
    pub batch: Account<'info, Batch>,

    /// O Dono da Marca que está criando o registro.
    pub brand_owner: UncheckedAccount<'info>,
    
    /// A carteira da API que vai pagar as taxas.
    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}