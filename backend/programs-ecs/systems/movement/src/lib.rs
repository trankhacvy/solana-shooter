use bolt_lang::*;
use position::Position;

declare_id!("6dsofRYAJMq2XPpbgN2aAFzkzANnP7DYG8JBSjXHKs9V");

#[system]
pub mod movement {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let position = &mut ctx.accounts.position;
        position.x += 1;
        position.y += 1;
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub position: Position,
    }

}