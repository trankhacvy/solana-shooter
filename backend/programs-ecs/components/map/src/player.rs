// use bolt_lang::*;

// use crate::enemy::Enemy;

// #[component_deserialize(delegate)]
// pub struct Player {
//     // actor
//     pub owner: Pubkey,
//     pub x: u32,
//     pub y: u32,
//     pub maximum_hit_points: i32,
//     pub current_hit_points: u32,
//     pub level: u32,
//     pub speed: u32,
//     pub body_damage: u32,
//     pub experience: u32,
//     pub body_attack_time: u32,
//     pub last_body_damage: u32,
//     // player
//     pub gold: u32,
//     pub skill_up_points: u32,
//     pub upgrade_points: u32,
//     pub regeneration: u32,
//     pub attack_rate: u32,
//     pub bullet_speed: u32,
//     pub bullet_damage: u32,
//     pub last_fired: u32,
//     pub last_regeneration: u32,
//     pub radius_attack: u32,
//     pub experience_required: u32,
// }

// impl Default for Player {
//     fn default() -> Self {
//         Self {
//             owner: Pubkey::default(),
//             x: 0,
//             y: 0,
//             maximum_hit_points: -20,
//             current_hit_points: 0,
//             level: 1,
//             speed: 200,
//             body_damage: 0,
//             experience: 0,
//             body_attack_time: 1000,
//             last_body_damage: 0,
//             // player
//             gold: 0,
//             skill_up_points: 0,
//             upgrade_points: 0,
//             regeneration: 0,
//             attack_rate: 0,
//             bullet_speed: 350,
//             bullet_damage: 0,
//             last_fired: 0,
//             last_regeneration: 0,
//             radius_attack: 700,
//             experience_required: 5,
//         }
//     }
// }

// impl Player {
//     pub fn get_closest_enemy<'a>(&self, enemies: &'a Vec<Enemy>) -> Option<&'a Enemy> {
//         enemies.iter().min_by_key(|enemy| {
//             let dx = (self.x as i32 - enemy.x as i32).abs();
//             let dy = (self.y as i32 - enemy.y as i32).abs();
//             dx * dx + dy * dy
//         })
//     }

//     pub fn is_enemy_in_attack_radius(&self, enemy: &Enemy) -> bool {
//         let dx = (self.x as i32 - enemy.x as i32).abs();
//         let dy = (self.y as i32 - enemy.y as i32).abs();
//         let distance_squared = dx * dx + dy * dy;
//         distance_squared <= (self.radius_attack * self.radius_attack) as i32
//     }
// }
