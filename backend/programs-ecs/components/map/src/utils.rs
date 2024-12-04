// use enemies::Enemy;
// use player::Player;

// pub fn xorshift64(seed: u64) -> u64 {
//     let mut x = seed;
//     x ^= x << 13;
//     x ^= x >> 7;
//     x ^= x << 17;
//     x
// }

// pub fn get_random_point_around(
//     target_x: u32,
//     target_y: u32,
//     width: u32,
//     height: u32,
//     rate_scale: f64,
//     seed: &mut u64,
// ) -> (u32, u32) {
//     let outer_width = (width as f64 * rate_scale) as u32;
//     let outer_height = (height as f64 * rate_scale) as u32;

//     let outer_left = target_x.saturating_sub(outer_width / 2);
//     let outer_top = target_y.saturating_sub(outer_height / 2);

//     let inner_left = target_x.saturating_sub(width / 2);
//     let inner_right = target_x.saturating_add(width / 2);
//     let inner_top = target_y.saturating_sub(height / 2);
//     let inner_bottom = target_y.saturating_add(height / 2);

//     let mut result = (target_x, target_y);

//     for _ in 0..5 {
//         // Generate random x and y
//         let random_x = outer_left + (xorshift64(*seed) as u32 % outer_width);
//         *seed = xorshift64(*seed);
//         let random_y = outer_top + (xorshift64(*seed) as u32 % outer_height);
//         *seed = xorshift64(*seed);

//         result = (random_x, random_y);

//         // Check if the point is outside the inner rectangle
//         if random_x < inner_left
//             || random_x > inner_right
//             || random_y < inner_top
//             || random_y > inner_bottom
//         {
//             return result; // Return as soon as a valid point is found
//         }
//     }

//     // Return the last generated point after 5 attempts
//     result
// }

// pub fn get_closest_enemy<'a>(player: &Player, enemies: &'a Vec<Enemy>) -> Option<&'a Enemy> {
//     enemies.iter().min_by_key(|enemy| {
//         let dx = (player.x as i32 - enemy.x as i32).abs();
//         let dy = (player.y as i32 - enemy.y as i32).abs();
//         dx * dx + dy * dy
//     })
// }

// pub fn is_enemy_in_attack_radius(player: &Player, enemy: &Enemy) -> bool {
//     let dx = (player.x as i32 - enemy.x as i32).abs();
//     let dy = (player.y as i32 - enemy.y as i32).abs();
//     let distance_squared = dx * dx + dy * dy;
//     distance_squared <= (player.radius_attack * player.radius_attack) as i32
// }

// pub fn is_colliding(x1: u32, y1: u32, x2: u32, y2: u32, threshold: u32) -> bool {
//     let dx = (x1 as i32 - x2 as i32).abs();
//     let dy = (y1 as i32 - y2 as i32).abs();
//     (dx * dx + dy * dy) <= (threshold * threshold) as i32
// }

// pub fn check_attack(&self, enemy: &Enemy) -> bool {
//     let dx = (self.x as i32 - enemy.x as i32).abs();
//     let dy = (self.y as i32 - enemy.y as i32).abs();
//     let distance_squared = dx * dx + dy * dy;
//     distance_squared <= (self.radius_attack * self.radius_attack) as i32
// }
