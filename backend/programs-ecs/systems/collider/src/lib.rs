use bolt_lang::*;
use bullets::{Bullet, Bullets};
use enemies::{Enemies, Enemy};
use map::Map;
use player::Player;

declare_id!("9hkRMKUZo9rMNn7AnCK3zuV74ru6UYP6KaPvr15URkJs");

#[system]
pub mod collider {

    pub fn execute(ctx: Context<Components>) -> Result<Components> {
        let map = &mut ctx.accounts.map;
        let player = &mut ctx.accounts.player;
        let enemies_state = &mut ctx.accounts.enemies;
        let bullets_state = &mut ctx.accounts.bullets;

        let clock = Clock::get()?;
        let slot = clock.slot;
        let now = clock.unix_timestamp;

        if slot >= map.last_tick {
            map.last_tick = map.last_tick + 2;

            msg!("collider executed!");

            handle_player_collisions(player, &mut enemies_state.enemies, now as u64);
            handle_enemies_collisions(&mut enemies_state.enemies, &mut bullets_state.bulelts);
        }

        map.reload()?;

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub map: Map,
        pub player: Player,
        pub enemies: Enemies,
        pub bullets: Bullets,
    }
}

pub fn handle_player_collisions(player: &mut Player, enemies: &mut Vec<Enemy>, game_time: u64) {
    // Player collides with enemies
    for enemy in enemies {
        if enemy.active && is_colliding(player.x, player.y, enemy.x, enemy.y, 10.0) {
            // if game_time > enemy.last_body_damage {
            //     enemy.take_damage(player.bullet_damage);
            //     enemy.last_body_damage = game_time + player.body_attack_time;
            // }

            if game_time > player.last_body_damage {
                player.take_damage(enemy.damage);
                player.last_body_damage = game_time + enemy.body_attack_time;
            }
        }
    }
}

pub fn handle_enemies_collisions(enemies: &mut Vec<Enemy>, bullets: &mut Vec<Bullet>) {
    // Bullets collide with enemies
    for bullet in bullets {
        if !bullet.active {
            continue;
        }

        for enemy in enemies.iter_mut() {
            if enemy.active && is_colliding(bullet.x, bullet.y, enemy.x, enemy.y, 5.0) {
                enemy.take_damage(bullet.damage);

                bullet.active = false;
                break;
            }
        }
    }
}

fn is_colliding(x1: f32, y1: f32, x2: f32, y2: f32, threshold: f32) -> bool {
    let dx = (x1 - x2).abs();
    let dy = (y1 - y2).abs();
    (dx * dx + dy * dy) <= (threshold * threshold)
}