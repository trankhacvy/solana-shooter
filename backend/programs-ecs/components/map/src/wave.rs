use bolt_lang::*;
use enemies::EnemyType;

#[component_deserialize(delegate)]
#[derive(PartialEq)]
pub struct Wave {
    pub id: u32,
    pub spawn_count: u32,
    pub interval: u32,
    pub enemy_type: EnemyType,
}

impl Wave {
    pub fn init_waves() -> Vec<Wave> {
        let waves = vec![
            Wave {
                id: 1,
                spawn_count: 3,
                interval: 1,
                enemy_type: EnemyType::FlyingEye,
            },
            Wave {
                id: 2,
                spawn_count: 4,
                interval: 1,
                enemy_type: EnemyType::Goblin,
            },
            Wave {
                id: 3,
                spawn_count: 5,
                interval: 1,
                enemy_type: EnemyType::Mushroom,
            },
        ];

        waves
    }
}
