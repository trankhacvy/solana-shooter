// use bolt_lang::*;

// use crate::utils;

// #[component_deserialize(delegate)]
// #[derive(PartialEq)]
// pub enum EnemyType {
//     FlyingEye,
//     Goblin,
//     Mushroom,
//     Skeleton,
// }

// #[component_deserialize(delegate)]
// pub struct Enemy {
//     pub id: u32,
//     pub wave_id: u32,
//     pub x: u32,
//     pub y: u32,
//     pub hp: u32,
//     pub speed: u32,
//     pub active: bool,
// }

// impl Enemy {
//     pub fn chase_player(&mut self, player_x: u32, player_y: u32, _seed: &mut u64) {
//         // let (x, y) = get_random_point_around(player_x, player_y, 1920, 1080, 1.2, seed);
//         let x = player_x;
//         let y = player_y;

//         let dx = x as i32 - self.x as i32;
//         let dy = y as i32 - self.y as i32;
//         let distance = ((dx * dx + dy * dy) as f64).sqrt();

//         if distance > 0.0 {
//             let normalized_dx = (dx as f64 / distance) * self.speed as f64;
//             let normalized_dy = (dy as f64 / distance) * self.speed as f64;

//             self.x = (self.x as i32 + normalized_dx.round() as i32).max(0) as u32;
//             self.y = (self.y as i32 + normalized_dy.round() as i32).max(0) as u32;
//         }
//     }

//     pub fn spawn(id: u32, wave_id: u32, bounds: (u32, u32), seed: u64) -> Self {
//         let random_value = utils::xorshift64(seed);
//         let corner_index = (random_value % 4) as u32;

//         let (x, y) = match corner_index {
//             0 => (0, 0),               // Top-left corner
//             1 => (bounds.0, 0),        // Top-right corner
//             2 => (0, bounds.1),        // Bottom-left corner
//             3 => (bounds.0, bounds.1), // Bottom-right corner
//             _ => unreachable!(),       // This should never happen
//         };

//         Self {
//             id,
//             wave_id,
//             x,
//             y,
//             hp: 100,
//             speed: 40,
//             active: true,
//         }
//     }
// }

