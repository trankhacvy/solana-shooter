use bolt_lang::*;
use commons::constants::{DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH};
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

#[component_deserialize(delegate)]
#[derive(PartialEq)]
pub enum MapStatus {
    Ready,
    Over,
}

#[component(delegate)]
pub struct Map {
    pub id: u32,
    pub bound_x: u32,
    pub bound_y: u32,
    pub player: Pubkey,
    pub last_tick: u64,
    pub last_wave_spawn: i64,
    pub last_enemy_spawn: i64,

    #[max_len(5)]
    pub waves: Vec<Wave>,
    pub current_wave_index: i8,
    pub current_wave_count: u32,
    pub status: MapStatus,
}

impl Default for Map {
    fn default() -> Self {
        Self::new(MapInit {
            id: 0,
            bound_x: DEFAULT_MAP_WIDTH,
            bound_y: DEFAULT_MAP_HEIGHT,
            player: Pubkey::default(),
            last_tick: 0,
            last_wave_spawn: 0,
            last_enemy_spawn: 0,
            waves: Vec::new(),
            current_wave_index: -1,
            current_wave_count: 0,
            status: MapStatus::Ready,
        })
    }
}

impl Map {
    pub fn spawn_wave(&mut self) {
        if self.current_wave_index < (self.waves.len() as i8) {
            self.current_wave_index = self.current_wave_index + 1;
            self.current_wave_count = 0;
        }
    }
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
