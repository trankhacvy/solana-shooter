import { PublicKey } from "@solana/web3.js";

import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";

import { Map } from "@/programs/map";
import { NewMap } from "@/programs/new_map";
import { Command } from "@/programs/command";
import { Tick } from "@/programs/tick";

import * as MapIdl from "@/programs/map.json";
import * as NewMapIdl from "@/programs/new_map.json";
import * as CommandIdl from "@/programs/command.json";
import * as TickIdl from "@/programs/tick.json";

import * as WorldIDL from "@/programs/world.json";

// components
const mapComponent = MapIdl as Map;

// systems
const newMapSystem = NewMapIdl as NewMap;
const commandSystem = CommandIdl as Command;
const tickSystem = TickIdl as Tick;

// world

// components
export const MAP_COMPONENT_PROGRAM_ID = new PublicKey(mapComponent.address);

// systems
export const NEW_MAP_SYSTEM_PROGRAM_ID = new PublicKey(newMapSystem.address);
export const COMMAND_SYSTEM_PROGRAM_ID = new PublicKey(commandSystem.address);
export const TICK_SYSTEM_PROGRAM_ID = new PublicKey(tickSystem.address);

// world
export const WORLD_PROGRAM_ID = new PublicKey(
    "WorLD15A7CrDwLcLy4fRqtaTb9fbd8o8iqiEMUDse2n"
);

export function getMapComponentOnChain(engine: MagicBlockEngine) {
    return engine.getProgramOnChain<Map>(mapComponent);
}

export function getMapComponentOnEphem(engine: MagicBlockEngine) {
    return engine.getProgramOnEphem<Map>(mapComponent);
}

export { WorldIDL };

