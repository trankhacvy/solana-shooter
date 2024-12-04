import { PublicKey } from "@solana/web3.js";

import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";

import { Map } from "@/programs/map";
import { Player } from "@/programs/player";
import { Enemies } from "@/programs/enemies";
import { Bullets } from "@/programs/bullets";
import { NewMap } from "@/programs/new_map";
import { Command } from "@/programs/command";
import { Tick } from "@/programs/tick";
import { Collider } from "@/programs/collider";
import { MapPositions } from "@/programs/map_positions";
import { PlayerAttack } from "@/programs/player_attack";

import * as MapIdl from "@/programs/map.json";
import * as PlayerIdl from "@/programs/player.json";
import * as EnemiesIdl from "@/programs/enemies.json";
import * as BulletsIdl from "@/programs/bullets.json";
import * as NewMapIdl from "@/programs/new_map.json";
import * as CommandIdl from "@/programs/command.json";
import * as TickIdl from "@/programs/tick.json";
import * as ColliderIdl from "@/programs/collider.json";
import * as MapPositionIdl from "@/programs/map_positions.json";
import * as PlayerAttackIdl from "@/programs/player_attack.json";

import * as WorldIDL from "@/programs/world.json";
import { IdlAccounts } from "@coral-xyz/anchor";

// components
const mapComponent = MapIdl as Map;
export type MapAccount = IdlAccounts<Map>["map"];
const playerComponent = PlayerIdl as Player;
export type PlayerAccount = IdlAccounts<Player>["player"];

const enemiesComponent = EnemiesIdl as Enemies;
export type EnemiesAccount = IdlAccounts<Enemies>["enemies"];

const bulletsComponent = BulletsIdl as Bullets;
export type BulletsAccount = IdlAccounts<Bullets>["bullets"];

// systems
const newMapSystem = NewMapIdl as NewMap;
const commandSystem = CommandIdl as Command;
const tickSystem = TickIdl as Tick;
const colliderSystem = ColliderIdl as Collider;
const mapPositionsSystem = MapPositionIdl as MapPositions;
const playerAttackSystem = PlayerAttackIdl as PlayerAttack;

// world
export const DEFAULT_WORLD_PUBKEY = new PublicKey(
    "7qjHPstGJoj5LhP5gf4eZ1HwaZQhdPdtZ5YSp2i5LDWz" // dev
    // "7qjHPstGJoj5LhP5gf4eZ1HwaZQhdPdtZ5YSp2i5LDWz" // local
);

export const FAKE_MAP_PDA = new PublicKey(
    "DNrxWMZrdbUL2meEfkUyKHdsHmNDG9Ph4HCNtFQ56Zuj"
);

export const FAKE_PLAYER_PDA = new PublicKey(
    "GCbYBLNi3g1Rn9XoAezbhe9sJHkoWK1EWWkeJ3GmcR66"
);

export const FAKE_ENEMIES_PDA = new PublicKey(
    "FwWmwyMoDGZYLrvDYHzc96hrjqNjr8wX5mXgjTX1zf1H"
);

export const FAKE_BULLETS_PDA = new PublicKey(
    "F2Kr4fzhGXmwaDddeDipxwUgKxW2YQaVwnxJyY4AXPkK"
);

// components
export const MAP_COMPONENT_PROGRAM_ID = new PublicKey(mapComponent.address);
export const ENEMIES_COMPONENT_PROGRAM_ID = new PublicKey(
    enemiesComponent.address
);
export const PLAYER_COMPONENT_PROGRAM_ID = new PublicKey(
    playerComponent.address
);
export const BULLETS_COMPONENT_PROGRAM_ID = new PublicKey(
    bulletsComponent.address
);

// systems
export const NEW_MAP_SYSTEM_PROGRAM_ID = new PublicKey(newMapSystem.address);
export const COMMAND_SYSTEM_PROGRAM_ID = new PublicKey(commandSystem.address);
export const TICK_SYSTEM_PROGRAM_ID = new PublicKey(tickSystem.address);
export const COLLIDER_SYSTEM_PROGRAM_ID = new PublicKey(colliderSystem.address);
export const MAP_POSITION_SYSTEM_PROGRAM_ID = new PublicKey(
    mapPositionsSystem.address
);
export const PLAYER_ATTACK_SYSTEM_PROGRAM_ID = new PublicKey(
    playerAttackSystem.address
);

// world
export const WORLD_PROGRAM_ID = new PublicKey(
    "WorLD15A7CrDwLcLy4fRqtaTb9fbd8o8iqiEMUDse2n"
);

export function getMapComponentOnChain(engine: MagicBlockEngine) {
    return engine.getProgramOnChain<Map>(mapComponent);
}

export function getPlayerComponentOnChain(engine: MagicBlockEngine) {
    return engine.getProgramOnChain(playerComponent);
}

export function getMapComponentOnEphem(engine: MagicBlockEngine) {
    return engine.getProgramOnEphem<Map>(mapComponent);
}

export function getPlayerComponentOnEphem(engine: MagicBlockEngine) {
    return engine.getProgramOnEphem(playerComponent);
}

export function getEnemiesComponentOnEphem(engine: MagicBlockEngine) {
    return engine.getProgramOnEphem(enemiesComponent);
}

export function getBulletsComponentOnEphem(engine: MagicBlockEngine) {
    return engine.getProgramOnEphem(bulletsComponent);
}

export { WorldIDL };

