use bolt_lang::*;
use bullets::Bullets;
use enemies::{Enemies, Enemy};
use map::Map;
use player::Player;
// use utils::*;

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
        // pub player: Player,
        pub enemies: Enemies,
        // pub bullets: Bullets,
    }
}

// pub fn update_player_attack(player: &Player, enemies: &Vec<Enemy>, bullets: &mut Vec<Bullet>) {
//     let closest_enemy = get_closest_enemy(player, enemies);

//     if let Some(closest_enemy) = closest_enemy {
//         let bullet_count = bullets.len();

//         if is_enemy_in_attack_radius(player, closest_enemy) {
//             bullets.push(Bullet {
//                 id: bullet_count as u32 + 1,
//                 x: player.x,
//                 y: player.y,
//                 speed: player.bullet_speed,
//                 enemy_id: closest_enemy.id,
//                 active: true,
//             });
//         }
//     }
// }

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
