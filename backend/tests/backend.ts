import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Map } from "../target/types/map";
import { Wavesstate } from "../target/types/wavesstate";
import { NewMap } from "../target/types/new_map";
import { Tick } from "../target/types/tick";
import {
  InitializeNewWorld,
  AddEntity,
  InitializeComponent,
  ApplySystem,
} from "@magicblock-labs/bolt-sdk";
import { expect } from "chai";

describe("Backend", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Constants used to test the program.
  let worldPda: PublicKey;
  let mapEntityPda: PublicKey;
  let mapComponentPda: PublicKey;

  let waveEntityPda: PublicKey;
  let waveComponentPda: PublicKey;

  const mapComponent = anchor.workspace.Map as Program<Map>;
  const waveComponent = anchor.workspace.Wavesstate as Program<Wavesstate>;
  const newMapSystem = anchor.workspace.NewMap as Program<NewMap>;
  const tickSystem = anchor.workspace.Tick as Program<Tick>;

  before(() => {});

  it("InitializeNewWorld", async () => {
    const initNewWorld = await InitializeNewWorld({
      payer: provider.wallet.publicKey,
      connection: provider.connection,
    });
    const txSign = await provider.sendAndConfirm(initNewWorld.transaction);
    worldPda = initNewWorld.worldPda;
    console.log(
      `Initialized a new world (ID=${worldPda}). Initialization signature: ${txSign}`
    );
  });

  it("Add Map an entity", async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    const txSign1 = await provider.sendAndConfirm(addEntity.transaction);
    mapEntityPda = addEntity.entityPda;
    console.log(
      `Initialized a new Entity (ID=${addEntity.entityPda.toBase58()}). Initialization signature: ${txSign1}`
    );

    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: mapEntityPda,
      componentId: mapComponent.programId,
    });
    const txSign2 = await provider.sendAndConfirm(
      initializeComponent.transaction
    );
    mapComponentPda = initializeComponent.componentPda;
    console.log(
      `Initialized the map component. Initialization signature: ${txSign2}`
    );

    const mapAccount = await mapComponent.account.map.fetch(mapComponentPda);

    expect(mapAccount.id).to.equal(0);
    expect(mapAccount.boundX).to.equal(3200);
    expect(mapAccount.boundY).to.equal(3200);
  });

  it("Add Wave an entity", async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    });

    const txSign1 = await provider.sendAndConfirm(addEntity.transaction);
    waveEntityPda = addEntity.entityPda;
    console.log(
      `Initialized a new Entity (ID=${addEntity.entityPda.toBase58()}). Initialization signature: ${txSign1}`
    );

    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: waveEntityPda,
      componentId: waveComponent.programId,
    });

    const txSign2 = await provider.sendAndConfirm(
      initializeComponent.transaction
    );

    waveComponentPda = initializeComponent.componentPda;

    console.log(
      `Initialized the wave component. Initialization signature: ${txSign2}`
    );

    const waveAccount = await waveComponent.account.wavesState.fetch(
      waveComponentPda
    );
    expect(waveAccount.currentWaveIndex).to.equal(-1);
  });

  it("Apply new-map system", async () => {
    // Run the movement system
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: newMapSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: mapEntityPda,
          components: [{ componentId: mapComponent.programId }],
        },
        {
          entity: waveEntityPda,
          components: [{ componentId: waveComponent.programId }],
        },
      ],
    });
    const txSign = await provider.sendAndConfirm(applySystem.transaction);
    console.log(`Applied newMap system. Signature: ${txSign}`);
  });

  it("Apply Tick system", async () => {
    setInterval(async () => {
      // Run the movement system
      const applySystem = await ApplySystem({
        authority: provider.wallet.publicKey,
        systemId: tickSystem.programId,
        world: worldPda,
        entities: [
          {
            entity: mapEntityPda,
            components: [{ componentId: mapComponent.programId }],
          },
          {
            entity: waveEntityPda,
            components: [{ componentId: waveComponent.programId }],
          },
        ],
      });
      const txSign = await provider.sendAndConfirm(applySystem.transaction);
      // console.log(`Applied newMap system. Signature: ${txSign}`);

      await printMap();
    }, 500);
  });

  async function printMap() {
    const map = await mapComponent.account.map.fetch(mapComponentPda);
    const wavesState = await waveComponent.account.wavesState.fetch(
      waveComponentPda
    );

    const { boundX, boundY, player } = map;
    const { enemies } = wavesState;

    // Normalize the bounds to fit within 10x10 units
    const scaleX = Math.min(20 / boundX, 1);
    const scaleY = Math.min(20 / boundY, 1);

    const normalize = (value: number, scale: number) =>
      Math.floor(value * scale);

    const normalizedPlayerX = normalize(player.x, scaleX);
    const normalizedPlayerY = normalize(player.y, scaleY);

    const normalizedEnemies = enemies.map((enemy) => ({
      x: normalize(enemy.x, scaleX),
      y: normalize(enemy.y, scaleY),
    }));

    // Create the map grid
    const grid = Array.from({ length: 20 }, () => Array(20).fill(" "));

    // Place the player on the grid
    if (normalizedPlayerX < 20 && normalizedPlayerY < 20) {
      grid[normalizedPlayerY][normalizedPlayerX] = "X";
    }

    // Place the enemies on the grid
    for (const enemy of normalizedEnemies) {
      if (enemy.x < 10 && enemy.y < 10) {
        grid[enemy.y][enemy.x] = "0";
      }
    }

    // Print the grid with borders
    console.log("Map:");
    console.log("+" + "-".repeat(20) + "+"); // Top border
    for (const row of grid) {
      console.log("|" + row.join("") + "|"); // Rows with side borders
    }
    console.log("+" + "-".repeat(20) + "+"); // Bottom border
  }
});
