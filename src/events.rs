// src/events.rs

use anchor_lang::prelude::*;

#[event]
pub struct BatchCreated {
    pub batch_id: String,
    pub creator: Pubkey, // O Dono da Marca
    pub producer_name: String,
    pub timestamp: i64,
}

#[event]
pub struct StageAdded {
    pub batch: Pubkey,
    pub stage_index: u16,
    pub stage_name: String,
    pub actor: Pubkey, // Quem adicionou a etapa (o current_holder no momento)
    pub stage_data_hash: String,
}

#[event]
pub struct CustodyTransferred {
    pub batch: Pubkey,
    pub from: Pubkey, // O detentor anterior
    pub to: Pubkey,   // O novo detentor
}

#[event]
pub struct BatchFinalized {
    pub batch: Pubkey,
    pub timestamp: i64,
}