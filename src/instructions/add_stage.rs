// src/instructions/add_stage.rs
use anchor_lang::prelude::*;
use crate::state::{batch::*, stage::*};
use crate::errors::CoffeeError;
use crate::constants::*;
use crate::events::*;

pub fn add_stage_handler(ctx: Context<AddStage>, stage_name: String, stage_data_hash: String) -> Result<()> {
    let batch = &mut ctx.accounts.batch;

    // ✨ SIMPLIFICADO: Verificações de segurança mais diretas
    require!(batch.status == BatchStatus::InProgress, CoffeeError::BatchIsFinalized);
    require_keys_eq!(ctx.accounts.actor.key(), batch.current_holder, CoffeeError::UnauthorizedActor);

    let stage = &mut ctx.accounts.stage;
    stage.batch = batch.key();
    stage.stage_name = stage_name.clone();
    stage.timestamp = Clock::get()?.unix_timestamp;
    stage.actor = ctx.accounts.actor.key();
    stage.stage_data_hash = stage_data_hash.clone();

    batch.next_stage_index = batch.next_stage_index.checked_add(1).unwrap();

    emit!(StageAdded {
        batch: batch.key(),
        stage_index: batch.next_stage_index - 1,
        stage_name,
        actor: ctx.accounts.actor.key(),
        stage_data_hash,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(stage_name: String)]
pub struct AddStage<'info> {
    #[account(mut)]
    pub batch: Account<'info, Batch>,
    
    #[account(
        init,
        payer = payer,
        space = Stage::calculate_space(stage_name.len()),
        seeds = [
            STAGE_SEED, 
            batch.key().as_ref(),
            batch.next_stage_index.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub stage: Account<'info, Stage>,

    /// O usuário real (detentor da posse) que está adicionando a etapa.
    pub actor: UncheckedAccount<'info>,

    /// A carteira da API que paga e assina.
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}