use bolt_lang::*;

declare_id!("AdmDkU6FYZiGRoD9fpoxmqWmdZXgcvno7wCPZPRUnJrf");

#[component]
#[derive(Default)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}
