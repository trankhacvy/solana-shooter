use bolt_lang::*;

declare_id!("8EN6ywPpLktxHstqhm6Vwjp8WSv7YpnpbVg4YXh3vbCi");

#[component(delegate)]
pub struct Player {
    pub authority: Pubkey,
    pub x: f32,
    pub y: f32,
    pub hp: u32,
    pub max_hp: u32,
    pub speed: f32,
    pub bullet_speed: f32,
    pub bullet_damage: u32,
    pub radius_attack: u32,
    pub last_body_damage: u64,
    pub body_attack_time: u64,
    pub last_fire: u64,
}

impl Default for Player {
    fn default() -> Self {
        Self::new(PlayerInit {
            authority: Pubkey::default(),
            x: 0.0,
            y: 0.0,
            hp: 100,
            max_hp: 100,
            speed: 50.0,
            bullet_speed: 80.0,
            bullet_damage: 5,
            radius_attack: 400,
            last_body_damage: 0,
            body_attack_time: 1,
            last_fire: 0,
        })
    }
}

impl Player {
    pub fn take_damage(&mut self, damage: u32) {
        if damage >= self.hp {
            self.hp = 0;
        } else {
            self.hp -= damage;
        }
    }
}
