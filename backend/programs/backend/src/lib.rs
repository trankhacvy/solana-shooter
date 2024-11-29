use anchor_lang::prelude::*;

declare_id!("7U3VZHAzemHbFwxGehSssuMrq1k3SidDTHHTnUnR9RH3");

#[program]
pub mod backend {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
