use crate::constants::LevelRate;

pub fn calc_exp_required(level: u32) -> u32 {
    let base_exp: u32 = LevelRate::DEFAULT.into();
    let mut level_rate = 0u32;

    if level <= 20 {
        level_rate = Into::<u32>::into(LevelRate::EARLY) + (level - 1);
    } else if level > 20 && level < 40 {
        level_rate = Into::<u32>::into(LevelRate::MIDDLE) + (level - 1);
    } else if level >= 41 {
        level_rate = Into::<u32>::into(LevelRate::LATE) + (level - 1);
    }

    base_exp + level_rate
}


pub fn is_colliding(x1: f32, y1: f32, x2: f32, y2: f32, threshold: f32) -> bool {
    let dx = (x1 - x2).abs();
    let dy = (y1 - y2).abs();
    (dx * dx + dy * dy) <= (threshold * threshold)
}
