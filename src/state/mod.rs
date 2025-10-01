// src/state/mod.rs

// Declara que existem os submódulos 'batch' e 'stage' dentro deste módulo.
pub mod batch;
pub mod stage;

// Re-exporta todo o conteúdo público de 'batch' e 'stage' para que outros
// arquivos possam usar 'crate::state::Batch' em vez de 'crate::state::batch::Batch'.
pub use batch::*;
pub use stage::*;