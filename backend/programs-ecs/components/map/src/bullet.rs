// use bolt_lang::*;
// use enemies::Enemy;

// #[component_deserialize(delegate)]
// pub struct Bullet {
//     pub id: u32,
//     pub x: u32,
//     pub y: u32,
//     pub speed: u32,
//     pub enemy_id: u32,
//     pub active: bool,
// }

// impl Bullet {
//     pub fn update(&mut self, enemies: &Vec<Enemy>) {
//         if let Some(target) = enemies.iter().find(|enemy| enemy.id == self.enemy_id) {
//             let dx = target.x as i32 - self.x as i32;
//             let dy = target.y as i32 - self.y as i32;
//             let distance = ((dx * dx + dy * dy) as f64).sqrt();

//             if distance > 0.0 {
//                 // Normalize and update bullet position
//                 self.x = (self.x as f64 + self.speed as f64 * dx as f64 / distance) as u32;
//                 self.y = (self.y as f64 + self.speed as f64 * dy as f64 / distance) as u32;
//             }
//         }
//     }
// }
