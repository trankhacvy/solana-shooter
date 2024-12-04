use bolt_lang::*;
use bullets::Bullets;
use enemies::Enemies;
use map::{wave::Wave, Map};
use player::Player;

declare_id!("8PJTiVhRq2MCyHE8D3CrbuktWRkr4VswvLiS16VFqEsh");

#[system]
pub mod new_map {
    pub fn execute(ctx: Context<Components>) -> Result<Components> {
        let clock = Clock::get()?;

        let map = &mut ctx.accounts.map;
        let player = &mut ctx.accounts.player;
        let enemies = &mut ctx.accounts.enemies;
        let bullets = &mut ctx.accounts.bullets;

        let authority = &ctx.accounts.authority;

        player.x = map.bound_x as f32 / 2.0;
        player.y = map.bound_y as f32 / 2.0;
        player.hp = 100;
        player.max_hp = 100;

        map.player = player.key();
        map.last_tick = clock.slot;
        map.last_wave_spawn = clock.unix_timestamp as i64;
        map.last_enemy_spawn = clock.unix_timestamp as i64;
        map.current_wave_index = -1;
        map.waves = Wave::init_waves();

        enemies.map = map.key();
        enemies.enemies = Vec::new();

        bullets.map = map.key();
        bullets.bulelts = Vec::new();

        player.authority = authority.key();
        player.x = map.bound_x as f32 / 2.0;
        player.y = map.bound_y as f32 / 2.0;

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub map: Map,
        pub player: Player,
        pub enemies: Enemies,
        pub bullets: Bullets,
    }

    // #[arguments]
    // #[derive(Debug)]
    // struct Args {
    //     player_speed: Command,
    // }
}
