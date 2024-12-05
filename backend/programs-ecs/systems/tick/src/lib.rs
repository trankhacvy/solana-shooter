use bolt_lang::*;
use enemies::{Enemies, Enemy};
use map::Map;

declare_id!("FpnrMvegmtFSxu8ndVyEiydXhVCRp8bT31aL3fLnheji");

mod utils;

#[system]
pub mod tick {

    pub fn execute(ctx: Context<Components>) -> Result<Components> {
        let map = &mut ctx.accounts.map;
        let enemies_state = &mut ctx.accounts.enemies;

        let clock = Clock::get()?;
        let slot = clock.slot;
        let now = clock.unix_timestamp;

        if map.current_wave_index < 0 {
            map.current_wave_index = 0;
        }

        //spawn wave every 30s
        if now >= map.last_wave_spawn + 10 {
            map.last_wave_spawn = map.last_wave_spawn + 10;

            map.spawn_wave();
        }

        //spawn enemies every 2s
        if now >= map.last_enemy_spawn + 2 {
            map.last_enemy_spawn = map.last_enemy_spawn + 2;

            spawn_enemy(map, &mut enemies_state.enemies, slot);
        }

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub map: Map,
        pub enemies: Enemies,
    }
}

pub fn spawn_enemy(map: &mut Map, enemies: &mut Vec<Enemy>, slot: u64) {
    let wave = map.waves.get(map.current_wave_index as usize);

    if let Some(wave) = wave {
        if map.current_wave_count < wave.spawn_count {
            let enemy = Enemy::spawn(
                enemies.len() as u32 + 1,
                wave.id,
                (map.bound_x, map.bound_y),
                slot,
            );

            enemies.push(enemy);
            map.current_wave_count = map.current_wave_count + 1;
        }
    }
}
