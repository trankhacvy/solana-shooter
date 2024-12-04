use bolt_lang::*;

declare_id!("Em4MRJ849ui5k4hrpULtDTDR771pdxx7aS3fP8qy3DFs");

#[component_deserialize(delegate)]
#[derive(PartialEq)]
pub enum EnemyType {
    FlyingEye,
    Goblin,
    Mushroom,
    Skeleton,
}

#[component_deserialize(delegate)]
pub struct Enemy {
    pub id: u32,
    pub wave_id: u32,
    pub x: f32,
    pub y: f32,
    pub hp: u32,
    pub max_hp: u32,
    pub damage: u32,
    pub speed: f32,
    pub active: bool,
    pub last_body_damage: u64,
    pub body_attack_time: u64,
}

impl Enemy {
    pub fn chase_player(&mut self, player_x: f32, player_y: f32, _seed: &mut u64) {
        // let (x, y) = get_random_point_around(player_x, player_y, 1920, 1080, 1.2, seed);
        let x = player_x;
        let y = player_y;

        let dx = x - self.x;
        let dy = y - self.y;
        let distance = (dx * dx + dy * dy).sqrt();

        if distance > 0.0 {
            let normalized_dx = (dx / distance) * self.speed;
            let normalized_dy = (dy / distance) * self.speed;

            self.x = (self.x + normalized_dx.round()).max(0.0);
            self.y = (self.y + normalized_dy.round()).max(0.0);
        }
    }

    pub fn spawn(id: u32, wave_id: u32, bounds: (u32, u32), seed: u64) -> Self {
        let random_value = xorshift64(seed);
        let corner_index = (random_value % 4) as u32;

        let (x, y) = match corner_index {
            0 => (0, 0),               // Top-left corner
            1 => (bounds.0, 0),        // Top-right corner
            2 => (0, bounds.1),        // Bottom-left corner
            3 => (bounds.0, bounds.1), // Bottom-right corner
            _ => unreachable!(),       // This should never happen
        };

        Self {
            id,
            wave_id,
            x: x as f32,
            y: y as f32,
            hp: 10,
            max_hp: 10,
            damage: 5,
            speed: 30.0,
            active: true,
            last_body_damage: 0,
            body_attack_time: 1,
        }
    }

    pub fn take_damage(&mut self, damage: u32) {
        if damage >= self.hp {
            self.hp = 0;
            self.active = false;
        } else {
            self.hp -= damage;
        }
    }
}

pub fn xorshift64(seed: u64) -> u64 {
    let mut x = seed;
    x ^= x << 13;
    x ^= x >> 7;
    x ^= x << 17;
    x
}

#[component(delegate)]
#[derive(Default)]
pub struct Enemies {
    pub map: Pubkey,
    #[max_len(40)]
    pub enemies: Vec<Enemy>,
}
