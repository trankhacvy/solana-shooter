use bolt_lang::*;
use map::{Map, MapError};

declare_id!("7aU6xJtBHNKaSoQoDWxp52ioJa8VSyaD28nKFAJMrniW");

#[system]
pub mod command {
    use player::Player;

    pub fn execute(ctx: Context<Components>, args: Args) -> Result<Components> {
        let room = &mut ctx.accounts.map;
        let player = &mut ctx.accounts.player;
        let authority = &ctx.accounts.authority;

        require!(
            player.authority == authority.key(),
            MapError::PlayerIsNotPayer
        );

        require!(room.player == player.key(), MapError::PlayerIsNotPayer);

        let bound_x = room.bound_x;
        let bound_y = room.bound_y;

        msg!("args: {:?}", args);

        match args.command {
            Command::Move { dx, dy } => {
                let new_x =
                    (player.x as i32 + player.speed as i32 * dx as i32).clamp(0, bound_x as i32);
                let new_y =
                    (player.y as i32 + player.speed as i32 * dy as i32).clamp(0, bound_y as i32);

                player.x = new_x as f32;
                player.y = new_y as f32;
            }
        };

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub map: Map,
        pub player: Player,
    }

    #[arguments]
    #[derive(Debug)]
    struct Args {
        command: Command,
    }
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
enum Command {
    Move { dx: i8, dy: i8 },
}
