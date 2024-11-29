use bolt_lang::*;
use map::Map;

declare_id!("FpnrMvegmtFSxu8ndVyEiydXhVCRp8bT31aL3fLnheji");

const TICKS_PER_SECOND: u64 = 20;

#[system]
pub mod tick {

    pub fn execute(ctx: Context<Components>) -> Result<Components> {
        let map = &mut ctx.accounts.map;

        // Check that the game tick cooldown has elapsed
        let mut incremented_times = 0;
        while Clock::get()?.slot >= map.tick_next_slot {
            map.tick_next_slot = map.tick_next_slot + 1;

            // Everything happens on ticks mutliples of 1 second, we can ignore everything else
            if map.tick_next_slot % TICKS_PER_SECOND != 0 {
                continue;
            }

            // handle tick

            // We can only process a few ticks per transaction (we are CU limited)
            incremented_times += 1;
            if incremented_times >= 5 {
                break;
            }
        }

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub map: Map,
    }
}
