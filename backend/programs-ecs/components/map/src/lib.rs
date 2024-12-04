use bolt_lang::*;
use wave::Wave;

declare_id!("3GtTSM94JcNcpPyTmT9VtS1Rx6iypbsp1DQeZ2r1HHgW");

pub mod wave;

#[component_deserialize]
#[derive(PartialEq)]
pub enum MapType {
    Bonk,
    DogWithHat,
    Popcat,
    PeanutTheSquirrel,
    GoatseusMaximus,
    CatInADogsWorld,
    BookOfMeme,
    JustAChillGuy,
    Fwog,
    BabyDogeCoin,
    WeLoveTits,
}

#[component(delegate)]
pub struct Map {
    pub id: u32,
    pub bound_x: u32,
    pub bound_y: u32,
    pub player: Pubkey,
    pub last_tick: u64,
    // pub last_collider: i64,
    pub last_wave_spawn: i64,
    pub last_enemy_spawn: i64,

    #[max_len(5)]
    pub waves: Vec<Wave>,
    pub current_wave_index: i8,
    pub current_wave_count: u32,
}

impl Default for Map {
    fn default() -> Self {
        Self::new(MapInit {
            id: 0,
            bound_x: 3200,
            bound_y: 3200,
            player: Pubkey::default(),
            last_tick: 0,
            // last_collider: 0,
            last_wave_spawn: 0,
            last_enemy_spawn: 0,
            waves: Vec::new(),
            current_wave_index: -1,
            current_wave_count: 0,
        })
    }
}

impl Map {
    // pub fn update_enemies(&mut self, player_x: u32, player_y: u32, slot: u64) {
    //     for enemy in self.enemies.enemies.iter_mut() {
    //         enemy.chase_player(player_x, player_y, &mut (slot as u64));
    //     }
    // }

    // pub fn update_bullets(&mut self) {
    //     for bullet in self.bullets.iter_mut() {
    //         bullet.update(&self.enemies.enemies);
    //     }
    // }

    // pub fn update_player_attack(&mut self, player: &Player) {
    //     let closest_enemy = get_closest_enemy(player, &self.enemies.enemies);

    //     if let Some(closest_enemy) = closest_enemy {
    //         let bullet_count = self.bullets.len();

    //         if is_enemy_in_attack_radius(player, closest_enemy) {
    //             self.bullets.push(Bullet {
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

    pub fn spawn_wave(&mut self) {
        if self.current_wave_index < (self.waves.len() as i8) {
            self.current_wave_index = self.current_wave_index + 1;
            self.current_wave_count = 0;
        }
    }

    // pub fn spawn_enemy(&mut self, slot: u64) {
    //     if self.current_wave_index >= 0 && self.current_wave_index < self.waves.len() as i8 {
    //         let wave = self.waves[self.current_wave_index as usize];

    //         let enemy = Enemy::spawn(
    //             self.enemies.enemies.len() as u32 + 1,
    //             wave.id,
    //             (self.bound_x, self.bound_y),
    //             slot,
    //         );

    //         self.enemies.enemies.push(enemy);
    //     }
    // }

    // pub fn handle_collisions(&mut self, player: &mut Player) {
    //     // Player collides with enemies
    //     for enemy in &mut self.enemies.enemies {
    //         if enemy.active && is_colliding(player.x, player.y, enemy.x, enemy.y, 5) {
    //             player.current_hit_points -= 1;
    //             // enemy.active = false;
    //         }
    //     }

    //     // Bullets collide with enemies
    //     for bullet in &mut self.bullets {
    //         if !bullet.active {
    //             continue;
    //         }
    //         for enemy in &mut self.enemies.enemies {
    //             if enemy.active && is_colliding(bullet.x, bullet.y, enemy.x, enemy.y, 5) {
    //                 enemy.hp -= 1;
    //                 if enemy.hp <= 0 {
    //                     enemy.active = false;
    //                 }
    //                 bullet.active = false;
    //                 break;
    //             }
    //         }
    //     }
    // }
}

#[error_code]
pub enum MapError {
    #[msg("The room status is not currently set to Generate.")]
    StatusIsNotGenerate,
    #[msg("Player is already in the room")]
    PlayerAlreadyJoined,
    #[msg("The player in this slot doesn't match the payer")]
    PlayerIsNotPayer,
}
