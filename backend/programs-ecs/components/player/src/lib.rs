use bolt_lang::*;

declare_id!("8EN6ywPpLktxHstqhm6Vwjp8WSv7YpnpbVg4YXh3vbCi");

#[component(delegate)]
#[derive(Default)]
pub struct Player {
    // actor
    pub owner: Pubkey,
    pub maximum_hit_points: u32,
    pub current_hit_points: u32,
    pub level: u32,
    pub speed: u32,
    pub body_damage: u32,
    pub experience: u32,
    pub body_attack_time: u32,
    pub last_body_damage: u32,
    // player
    pub gold: u32,
    pub skill_up_points: u32,
    pub upgrade_points: u32,
    pub regeneration: u32,
    pub attack_rate: u32,
    pub bullet_speed: u32,
    pub bullet_damage: u32,
    pub last_fired: u32,
    pub last_regeneration: u32,
    pub radius_attack: u32,
}

// impl Default for Player {
//     fn default() -> Self {
//         Self::new(GameInit {
//             status: GameStatus::Generate,
//             size_x: 16,
//             size_y: 8,
//             players: [GamePlayer::default(); 2],
//             cells: [GameCell::field(); 128],
//             tick_next_slot: 0,
//         })
//     }
// }

impl Player {
    pub fn set_maximum_hit_points(&mut self, value: u32) {
        self.maximum_hit_points = value;
    }

    pub fn get_maximum_hit_points(&self) -> u32 {
        self.maximum_hit_points
    }

    pub fn set_current_hit_points(&mut self, value: u32) {
        self.current_hit_points = value;
    }

    pub fn get_current_hit_points(&self) -> u32 {
        self.current_hit_points
    }

    pub fn set_level(&mut self, value: u32) {
        self.level = value;
    }

    pub fn get_level(&self) -> u32 {
        self.level
    }

    pub fn set_speed(&mut self, value: u32) {
        self.speed = value;
    }

    pub fn get_speed(&self) -> u32 {
        self.speed
    }

    pub fn set_body_damage(&mut self, value: u32) {
        self.body_damage = value;
    }

    pub fn get_body_damage(&self) -> u32 {
        self.body_damage
    }

    pub fn set_experience(&mut self, value: u32) {
        self.experience = value;
    }

    pub fn get_experience(&self) -> u32 {
        self.experience
    }

    pub fn set_last_body_damage(&mut self, value: u32) {
        self.last_body_damage = value;
    }

    pub fn get_last_body_damage(&self) -> u32 {
        self.last_body_damage
    }

    pub fn set_body_attack_time(&mut self, value: u32) {
        self.body_attack_time = value;
    }

    pub fn get_body_attack_time(&self) -> u32 {
        self.body_attack_time
    }

    pub fn check_flip(&self) {
        println!("Check flip logic would go here.");
    }

    pub fn reduce_health(&mut self, value: Option<u32>) {
        if let Some(val) = value {
            self.current_hit_points = self.current_hit_points.saturating_sub(val);
        }
    }
}
