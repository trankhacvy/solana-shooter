use bolt_lang::*;
use commons::constants::{
    LevelRate, DEFAULT_ATTACK_RADIUS, DEFAULT_ATTACK_TIME, DEFAULT_BULLET_DAMAGE, DEFAULT_BULLET_SPEED, DEFAULT_PLAYER_HP, DEFAULT_PLAYER_SPEED
};

declare_id!("8EN6ywPpLktxHstqhm6Vwjp8WSv7YpnpbVg4YXh3vbCi");

#[component(delegate)]
pub struct Player {
    pub authority: Pubkey,
    pub x: f32,
    pub y: f32,
    pub hp: u32,
    pub max_hp: u32,
    pub speed: f32,
    pub level: u32,
    pub experience: u32,
    pub required_experience: u32,
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
            hp: DEFAULT_PLAYER_HP,
            max_hp: DEFAULT_PLAYER_HP,
            speed: DEFAULT_PLAYER_SPEED,
            level: 1,
            experience: 0,
            required_experience: LevelRate::DEFAULT.into(),
            bullet_speed: DEFAULT_BULLET_SPEED,
            bullet_damage: DEFAULT_BULLET_DAMAGE,
            radius_attack: DEFAULT_ATTACK_RADIUS,
            last_body_damage: 0,
            body_attack_time: DEFAULT_ATTACK_TIME,
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
