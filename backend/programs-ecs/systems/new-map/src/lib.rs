use bolt_lang::*;
use map::{player::Player, Map};

declare_id!("8PJTiVhRq2MCyHE8D3CrbuktWRkr4VswvLiS16VFqEsh");

#[system]
pub mod new_map {

    pub fn execute(ctx: Context<Components>) -> Result<Components> {
        let map = &mut ctx.accounts.map;
        let authority = &ctx.accounts.authority;

        let player = Player::new(authority.key());

        map.player = player;

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub map: Map,
    }
}
