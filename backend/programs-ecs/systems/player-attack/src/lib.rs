use bolt_lang::*;
use bullets::{Bullet, Bullets};
use enemies::{Enemies, Enemy};
use map::Map;
use player::Player;

declare_id!("2iyMqaKq2oYESD7NCkx5RrvQjMCXSA4SC5VSccmdDrhZ");

#[system]
pub mod player_attack {
    use map::MapStatus;

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let map = &mut ctx.accounts.map;
        let player = &mut ctx.accounts.player;
        let enemies_state = &mut ctx.accounts.enemies;
        let bullets_state = &mut ctx.accounts.bullets;

        let bullet_count = bullets_state.bulelts.len();

        let clock = Clock::get()?;
        let slot = clock.slot;
        let now = clock.unix_timestamp as u64;

        if slot >= map.last_tick && bullet_count < 5 {
            map.last_tick = map.last_tick + 2;

            msg!("player attack executed!");

            if now >= player.last_fire {
                player.last_fire = now + 2;

                let closest_enemy = get_closest_enemy(player, &enemies_state.enemies);

                if let Some(closest_enemy) = closest_enemy {
                    if is_enemy_in_attack_radius(player, closest_enemy) {
                        bullets_state.bulelts.push(Bullet::spawn(
                            bullet_count as u32 + 1,
                            player.x,
                            player.y,
                            player.bullet_speed,
                            closest_enemy.id,
                            player.bullet_damage,
                        ));
                    }
                }
            }
        }

        if player.hp == 0 {
            map.status = MapStatus::Over;
        }

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

pub fn get_closest_enemy<'a>(player: &Player, enemies: &'a Vec<Enemy>) -> Option<&'a Enemy> {
    enemies
        .iter()
        .filter(|enemy| enemy.active)
        .min_by_key(|enemy| {
            let dx = (player.x as i32 - enemy.x as i32).abs();
            let dy = (player.y as i32 - enemy.y as i32).abs();
            dx * dx + dy * dy
        })
}

pub fn is_enemy_in_attack_radius(player: &Player, enemy: &Enemy) -> bool {
    let dx = (player.x as i32 - enemy.x as i32).abs();
    let dy = (player.y as i32 - enemy.y as i32).abs();
    let distance_squared = dx * dx + dy * dy;
    distance_squared <= (player.radius_attack * player.radius_attack) as i32
}
