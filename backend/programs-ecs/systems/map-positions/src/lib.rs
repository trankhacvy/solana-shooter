use bolt_lang::*;
use bullets::{Bullet, Bullets};
use enemies::{Enemies, Enemy};
use map::Map;
use player::Player;

declare_id!("BVP8yo2HZtskmxjEk7ig54RwKSimLNkubF7aqj5KJZzy");

#[system]
pub mod map_positions {

    pub fn execute(ctx: Context<Components>) -> Result<Components> {
        let map = &mut ctx.accounts.map;
        let player = &mut ctx.accounts.player;
        let enemies_state = &mut ctx.accounts.enemies;
        let bullets_state = &mut ctx.accounts.bullets;

        let clock = Clock::get()?;
        let slot = clock.slot;

        if slot >= map.last_tick {
            map.last_tick = map.last_tick + 2;

            // if (map.last_tick as u64) % TICKS_PER_SECOND == 0 {
            msg!("map position executed!");

            update_enemies(&mut enemies_state.enemies, player.x, player.y, slot);
            update_bullets(&mut bullets_state.bulelts, &enemies_state.enemies);
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

pub fn update_enemies(enemies: &mut Vec<Enemy>, player_x: f32, player_y: f32, slot: u64) {
    enemies.retain(|enemy| enemy.active);

    for enemy in enemies.iter_mut() {
        enemy.chase_player(player_x, player_y, &mut (slot as u64));
    }
}

pub fn update_bullets(bullets: &mut Vec<Bullet>, enemies: &Vec<Enemy>) {
    bullets.retain(|bullet| bullet.active);

    for bullet in bullets.iter_mut() {
        if let Some(target) = enemies.iter().find(|enemy| enemy.id == bullet.enemy_id) {
            move_to(bullet, target);
        }
    }
}

// Normalize a vector represented by a tuple
fn normalize(direction: (f32, f32)) -> (f32, f32) {
    let magnitude = (direction.0.powi(2) + direction.1.powi(2)).sqrt();
    if magnitude == 0.0 {
        (0.0, 0.0)
    } else {
        (direction.0 / magnitude, direction.1 / magnitude)
    }
}

// Calculate distance between two points
fn distance(a: (f32, f32), b: (f32, f32)) -> f32 {
    ((b.0 - a.0).powi(2) + (b.1 - a.1).powi(2)).sqrt()
}

pub fn move_to(bullet: &mut Bullet, enemy: &Enemy) {
    if !bullet.active || !enemy.active {
        return; // Skip if either the bullet or enemy is inactive
    }

    let bullet_position = (bullet.x as f32, bullet.y as f32);
    let enemy_position = (enemy.x as f32, enemy.y as f32);

    let direction = (
        enemy_position.0 - bullet_position.0,
        enemy_position.1 - bullet_position.1,
    );
    let normalized_direction = normalize(direction);
    let distance_to_enemy = distance(bullet_position, enemy_position);

    // Calculate the step to move
    let step = (
        normalized_direction.0 * bullet.speed,
        normalized_direction.1 * bullet.speed,
    );

    // Stop if the step overshoots the target
    if distance_to_enemy <= (step.0.powi(2) + step.1.powi(2)).sqrt() {
        bullet.x = enemy.x;
        bullet.y = enemy.y;
    } else {
        bullet.x += step.0;
        bullet.y += step.1;
    }
}
