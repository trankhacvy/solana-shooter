use bolt_lang::*;
use player::Player;

pub mod player;

declare_id!("3GtTSM94JcNcpPyTmT9VtS1Rx6iypbsp1DQeZ2r1HHgW");

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
    pub map_type: MapType,
    #[max_len(24)]
    pub title: String,
    #[max_len(64)]
    pub description: String,
    #[max_len(24)]
    pub cover: String,
    #[max_len(24)]
    pub music: String,
    // #[max_len(10)]
    pub player: Player,

    pub tick_next_slot: u64,
}

impl Default for Map {
    fn default() -> Self {
        Self::new(MapInit {
            id: 0,
            bound_x: 3200,
            bound_y: 3200,
            map_type: MapType::Bonk,
            title: String::from("Bonkverse"),
            description: String::from("Bonk"),
            cover: String::from("world_0_cover"),
            music: String::from("world_0"),
            player: Player::default(),
            tick_next_slot: 0,
        })
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