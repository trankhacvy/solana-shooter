pub const DEFAULT_MAP_WIDTH: u32 = 3200;
pub const DEFAULT_MAP_HEIGHT: u32 = 3200;

// player
pub const DEFAULT_PLAYER_HP: u32 = 100;
pub const DEFAULT_PLAYER_SPEED: f32 = 50.0;
pub const DEFAULT_BULLET_SPEED: f32 = 100.0;
pub const DEFAULT_BULLET_DAMAGE: u32 = 5;
pub const DEFAULT_ATTACK_RADIUS: u32 = 500;

pub const DEFAULT_ATTACK_TIME: u64 = 1; // 1s

// enemies
pub const DEFAULT_ENEMY_HP: u32 = 10;
pub const DEFAULT_ENEMY_DAMAGE: u32 = 5;
pub const DEFAULT_ENEMY_SPEED: f32 = 30.0;

pub enum LevelRate {
    DEFAULT = 5,
    EARLY = 10,
    MIDDLE = 15,
    LATE = 20,
}

impl Into<u32> for LevelRate {
    fn into(self) -> u32 {
        self as u32
    }
}
