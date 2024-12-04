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

#[component(delegate)]
#[derive(Default)]
pub struct Bullets {
    pub map: Pubkey,
    #[max_len(50)]
    pub bulelts: Vec<Bullet>,
}
