// src/instructions/mod.rs

// Declara os módulos que existem
pub mod create_batch;
pub mod add_stage;
pub mod transfer_custody; 
pub mod finalize_batch;   



// Re-exporta o conteúdo para ser facilmente acessível em outras partes do programa
pub use create_batch::*;
pub use add_stage::*;
pub use transfer_custody::*; 
pub use finalize_batch::*;   

