use bolt_lang::*;
use map::{Map, MapError};

declare_id!("7aU6xJtBHNKaSoQoDWxp52ioJa8VSyaD28nKFAJMrniW");

#[system]
pub mod command {

    pub fn execute(ctx: Context<Components>, args: Args) -> Result<Components> {
        let room = &mut ctx.accounts.map;
        let authority = &ctx.accounts.authority;

        require!(room.player.owner == authority.key(), MapError::PlayerIsNotPayer);

        let mut player = room.player;

        match args.command {
            Command::Move { dx, dy } => {
                player.x += player.speed * dx as u32;
                player.y += player.speed * dy as u32;
            }
            _ => {}
        };

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub map: Map,
    }

    #[arguments]
    struct Args {
        command: Command,
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
enum Command {
    Move { dx: i8, dy: i8 },
}
