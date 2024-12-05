use bolt_lang::*;

declare_id!("Abh2hXgh1gEK1Vc5hpU2MRSNF8wjtymvbdZuQEbF89kw");

#[component_deserialize(delegate)]
pub struct Bullet {
    pub id: u32,
    pub x: f32,
    pub y: f32,
    pub speed: f32,
    pub enemy_id: u32,
    pub damage: u32,
    pub active: bool,
}

impl Bullet {
    pub fn spawn(id: u32, x: f32, y: f32, speed: f32, enemy_id: u32, damage: u32) -> Self {
        Self {
            id,
            x,
            y,
            speed,
            enemy_id,
            active: true,
            damage,
        }
    }
}

#[component(delegate)]
#[derive(Default)]
pub struct Bullets {
    pub map: Pubkey,
    #[max_len(50)]
    pub bulelts: Vec<Bullet>,
}
