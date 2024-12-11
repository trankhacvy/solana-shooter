import { ComputeBudgetProgram, PublicKey, Transaction } from "@solana/web3.js";
import {
    AddEntity,
    InitializeComponent,
    InitializeNewWorld,
    createDelegateInstruction,
} from "@magicblock-labs/bolt-sdk";
import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";
import {
    BULLETS_COMPONENT_PROGRAM_ID,
    COLLIDER_SYSTEM_PROGRAM_ID,
    COMMAND_SYSTEM_PROGRAM_ID,
    DEFAULT_WORLD_PUBKEY,
    ENEMIES_COMPONENT_PROGRAM_ID,
    getMapComponentOnEphem,
    getPlayerComponentOnEphem,
    MAP_COMPONENT_PROGRAM_ID,
    MAP_POSITION_SYSTEM_PROGRAM_ID,
    MapAccount,
    NEW_MAP_SYSTEM_PROGRAM_ID,
    PLAYER_ATTACK_SYSTEM_PROGRAM_ID,
    PLAYER_COMPONENT_PROGRAM_ID,
    PlayerAccount,
    TICK_SYSTEM_PROGRAM_ID,
} from "./programs";
import { ApplySystem } from "@/utils/bolt";
import { MagicBlockQueue } from "./engine/magic-block-queue";

export async function createMap(engine: MagicBlockEngine) {
    const worldPda = await getOrCreateWorld(engine);
    console.log("Creating a new map");

    const addEntity = await AddEntity({
        connection: engine.getConnectionChain(),
        payer: engine.getSessionPayer(),
        world: worldPda,
        seed: `map-${Date.now()}`,
    });

    // Initialize the game component
    console.log("Initializing a new map component");
    const initializeComponent = await InitializeComponent({
        payer: engine.getSessionPayer(),
        entity: addEntity.entityPda,
        componentId: MAP_COMPONENT_PROGRAM_ID,
    });

    // Delegate the game component
    console.log("Delegating Map to Ephem rollups");
    const delegateComponentInstruction = createDelegateInstruction(
        {
            entity: addEntity.entityPda,
            account: initializeComponent.componentPda,
            ownerProgram: MAP_COMPONENT_PROGRAM_ID,
            payer: engine.getSessionPayer(),
        },
        undefined,
        1_000_000_000 // We don't want to auto-commit the state of the game
    );

    // Execute all instructions at once
    console.log("Processing creation");
    await engine.processSessionChainTransaction(
        "DelegateMapComponent",
        new Transaction()
            .add(addEntity.instruction)
            .add(initializeComponent.instruction)
            .add(delegateComponentInstruction)
    );

    console.log("Map is ready!: ", addEntity.entityPda.toBase58());
    return addEntity.entityPda;
}

export async function createBulletsComponent(engine: MagicBlockEngine) {
    const worldPda = await getOrCreateWorld(engine);
    console.log("Creating a new bullets");

    const addEntity = await AddEntity({
        connection: engine.getConnectionChain(),
        payer: engine.getSessionPayer(),
        world: worldPda,
        seed: `bullets-${Date.now()}`,
    });

    // Initialize the game component
    console.log("Initializing a new bullets component");
    const initializeComponent = await InitializeComponent({
        payer: engine.getSessionPayer(),
        entity: addEntity.entityPda,
        componentId: BULLETS_COMPONENT_PROGRAM_ID,
    });

    // Delegate the game component
    console.log("Delegating bullets to Ephem rollups");
    const delegateComponentInstruction = createDelegateInstruction(
        {
            entity: addEntity.entityPda,
            account: initializeComponent.componentPda,
            ownerProgram: BULLETS_COMPONENT_PROGRAM_ID,
            payer: engine.getSessionPayer(),
        },
        undefined,
        1_000_000_000 // We don't want to auto-commit the state of the game
    );

    // Execute all instructions at once
    console.log("Processing creation");
    await engine.processSessionChainTransaction(
        "DelegateBulletsComponent",
        new Transaction()
            .add(addEntity.instruction)
            .add(initializeComponent.instruction)
            .add(delegateComponentInstruction)
    );

    console.log("Bullets is ready!: ", addEntity.entityPda.toBase58());
    return addEntity.entityPda;
}

export async function createEnemiesComponent(engine: MagicBlockEngine) {
    const worldPda = await getOrCreateWorld(engine);
    console.log("Creating a new enemies");

    const addEntity = await AddEntity({
        connection: engine.getConnectionChain(),
        payer: engine.getSessionPayer(),
        world: worldPda,
        seed: `enemies-${Date.now()}`,
    });

    // Initialize the game component
    console.log("Initializing a new enemies component");
    const initializeComponent = await InitializeComponent({
        payer: engine.getSessionPayer(),
        entity: addEntity.entityPda,
        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
    });

    // Delegate the game component
    console.log("Delegating enemies to Ephem rollups");
    const delegateComponentInstruction = createDelegateInstruction(
        {
            entity: addEntity.entityPda,
            account: initializeComponent.componentPda,
            ownerProgram: ENEMIES_COMPONENT_PROGRAM_ID,
            payer: engine.getSessionPayer(),
        },
        undefined,
        1_000_000_000 // We don't want to auto-commit the state of the game
    );

    // Execute all instructions at once
    console.log("Processing creation");
    await engine.processSessionChainTransaction(
        "DelegateEnemiesComponent",
        new Transaction()
            .add(addEntity.instruction)
            .add(initializeComponent.instruction)
            .add(delegateComponentInstruction)
    );

    console.log("Enemies is ready!: ", addEntity.entityPda.toBase58());
    return addEntity.entityPda;
}

export async function createPlayer(engine: MagicBlockEngine) {
    const worldPda = await getOrCreateWorld(engine);
    console.log("Creating a new player");

    const addEntity = await AddEntity({
        connection: engine.getConnectionChain(),
        payer: engine.getSessionPayer(),
        world: worldPda,
        seed: `player-${Date.now()}`,
    });

    // Initialize the game component
    console.log("Initializing a new player component");
    const initializeComponent = await InitializeComponent({
        payer: engine.getSessionPayer(),
        entity: addEntity.entityPda,
        componentId: PLAYER_COMPONENT_PROGRAM_ID,
    });

    // Delegate the game component
    console.log("Delegating player to Ephem rollups");
    const delegateComponentInstruction = createDelegateInstruction(
        {
            entity: addEntity.entityPda,
            account: initializeComponent.componentPda,
            ownerProgram: PLAYER_COMPONENT_PROGRAM_ID,
            payer: engine.getSessionPayer(),
        },
        undefined,
        1_000_000_000 // We don't want to auto-commit the state of the game
    );

    // Execute all instructions at once
    console.log("Processing creation");
    await engine.processSessionChainTransaction(
        "DelegatePlayerComponent",
        new Transaction()
            .add(addEntity.instruction)
            .add(initializeComponent.instruction)
            .add(delegateComponentInstruction)
    );

    console.log("Player is ready!: ", addEntity.entityPda.toBase58());
    return addEntity.entityPda;
}

export async function applyNewMapSystem(
    engine: MagicBlockEngine,
    mapPda: PublicKey,
    playerPda: PublicKey,
    enemiesPda: PublicKey,
    bulletsPda: PublicKey
) {
    const worldPda = await getOrCreateWorld(engine);

    const applySystem = await ApplySystem({
        connection: engine.isLocalhost()
            ? engine.getConnectionChain()
            : engine.getConnectionEphem(),
        authority: engine.getSessionPayer(),
        systemId: NEW_MAP_SYSTEM_PROGRAM_ID,
        world: worldPda,
        entities: [
            {
                entity: mapPda,
                components: [
                    {
                        componentId: MAP_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: playerPda,
                components: [
                    {
                        componentId: PLAYER_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: enemiesPda,
                components: [
                    {
                        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: bulletsPda,
                components: [
                    {
                        componentId: BULLETS_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
        ],
    });

    return engine.isLocalhost()
        ? await engine.processSessionChainTransaction(
              "newMapSystem",
              applySystem.transaction
          )
        : await engine.processSessionEphemTransaction(
              "newMapSystem",
              applySystem.transaction
          );
}

export async function applyTickSystem(
    engine: MagicBlockEngine,
    mapPda: PublicKey,
    playerPda: PublicKey,
    enemiesPda: PublicKey,
    bulletsPda: PublicKey
) {
    const worldPda = DEFAULT_WORLD_PUBKEY; //await getOrCreateWorld(engine);

    const applySystem = await ApplySystem({
        connection: engine.isLocalhost()
            ? engine.getConnectionChain()
            : engine.getConnectionEphem(),
        authority: engine.getSessionPayer(),
        systemId: TICK_SYSTEM_PROGRAM_ID,
        world: worldPda,
        entities: [
            {
                entity: mapPda,
                components: [
                    {
                        componentId: MAP_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: playerPda,
                components: [
                    {
                        componentId: PLAYER_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: enemiesPda,
                components: [
                    {
                        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: bulletsPda,
                components: [
                    {
                        componentId: BULLETS_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
        ],
    });

    return engine.isLocalhost()
        ? await engine.processSessionChainTransaction(
              "tickSystem",
              applySystem.transaction
          )
        : await engine.processSessionEphemTransaction(
              "tickSystem",
              applySystem.transaction
          );
}

export async function applyColliderSystem(
    engine: MagicBlockEngine,
    mapPda: PublicKey,
    playerPda: PublicKey,
    enemiesPda: PublicKey,
    bulletsPda: PublicKey
) {
    const worldPda = DEFAULT_WORLD_PUBKEY; //await getOrCreateWorld(engine);

    const applySystem = await ApplySystem({
        connection: engine.isLocalhost()
            ? engine.getConnectionChain()
            : engine.getConnectionEphem(),
        authority: engine.getSessionPayer(),
        systemId: COLLIDER_SYSTEM_PROGRAM_ID,
        world: worldPda,
        entities: [
            {
                entity: mapPda,
                components: [
                    {
                        componentId: MAP_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: playerPda,
                components: [
                    {
                        componentId: PLAYER_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: enemiesPda,
                components: [
                    {
                        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: bulletsPda,
                components: [
                    {
                        componentId: BULLETS_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
        ],
    });

    const applySystem2 = await ApplySystem({
        connection: engine.isLocalhost()
            ? engine.getConnectionChain()
            : engine.getConnectionEphem(),
        authority: engine.getSessionPayer(),
        systemId: TICK_SYSTEM_PROGRAM_ID,
        world: worldPda,
        entities: [
            {
                entity: mapPda,
                components: [
                    {
                        componentId: MAP_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            // {
            //     entity: playerPda,
            //     components: [
            //         {
            //             componentId: PLAYER_COMPONENT_PROGRAM_ID,
            //         },
            //     ],
            // },
            {
                entity: enemiesPda,
                components: [
                    {
                        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            // {
            //     entity: bulletsPda,
            //     components: [
            //         {
            //             componentId: BULLETS_COMPONENT_PROGRAM_ID,
            //         },
            //     ],
            // },
        ],
    });

    const applySystem3 = await ApplySystem({
        connection: engine.isLocalhost()
            ? engine.getConnectionChain()
            : engine.getConnectionEphem(),
        authority: engine.getSessionPayer(),
        systemId: MAP_POSITION_SYSTEM_PROGRAM_ID,
        world: worldPda,
        entities: [
            {
                entity: mapPda,
                components: [
                    {
                        componentId: MAP_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: playerPda,
                components: [
                    {
                        componentId: PLAYER_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: enemiesPda,
                components: [
                    {
                        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: bulletsPda,
                components: [
                    {
                        componentId: BULLETS_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
        ],
    });

    const applySystem4 = await ApplySystem({
        connection: engine.isLocalhost()
            ? engine.getConnectionChain()
            : engine.getConnectionEphem(),
        authority: engine.getSessionPayer(),
        systemId: PLAYER_ATTACK_SYSTEM_PROGRAM_ID,
        world: worldPda,
        entities: [
            {
                entity: mapPda,
                components: [
                    {
                        componentId: MAP_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: playerPda,
                components: [
                    {
                        componentId: PLAYER_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: enemiesPda,
                components: [
                    {
                        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: bulletsPda,
                components: [
                    {
                        componentId: BULLETS_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
        ],
    });

    const { value: blockhash } = await engine
        .getConnectionEphem()
        .getLatestBlockhashAndContext();
    const recentBlockhash = blockhash.blockhash;

    const tran = new Transaction({
        feePayer: applySystem.transaction.feePayer,
        recentBlockhash,
    }).add(
        ...[
            ComputeBudgetProgram.setComputeUnitLimit({
                units: 1200000,
            }),
            applySystem.instruction,
            applySystem2.instruction,
            applySystem3.instruction,
            applySystem4.instruction,
        ]
    );

    return engine.isLocalhost()
        ? await engine.processSessionChainTransaction("tickSystem", tran)
        : await engine.processSessionEphemTransaction("tickSystem", tran);
}

export async function getOrCreateWorld(engine: MagicBlockEngine) {
    try {
        // await engine.fundSessionFromWallet();
        if (engine.isLocalhost()) {
            await engine.fundSessionFromAirdrop();
        }
    } catch (error) {
        console.log("Could not airdrop to fund the session key");
    }
    // Check if the world exists, or try to create it
    let worldPda = DEFAULT_WORLD_PUBKEY;

    const worldAccountInfo = await engine.getChainAccountInfo(worldPda);

    if (!worldAccountInfo.data.byteLength) {
        const initializeNewWorld = await InitializeNewWorld({
            connection: engine.getConnectionChain(),
            payer: engine.getSessionPayer(),
        });

        await engine.processSessionChainTransaction(
            "InitializeNewWorld",
            initializeNewWorld.transaction
        );

        console.log(
            "InitializeNewWorld: ",
            initializeNewWorld.worldPda.toBase58()
        );

        worldPda = initializeNewWorld.worldPda;
    }
    // By now, we hopefully have a valid world we can use as expected
    return worldPda;
}

export async function applyCommandSystem(
    engine: MagicBlockEngine,
    queue: MagicBlockQueue,
    mapPda: PublicKey,
    playerPda: PublicKey,
    args: Object
) {
    const worldPda = DEFAULT_WORLD_PUBKEY; //await getOrCreateWorld(engine);

    const applySystem = await ApplySystem({
        connection: engine.isLocalhost()
            ? engine.getConnectionChain()
            : engine.getConnectionEphem(),
        authority: engine.getSessionPayer(),
        systemId: COMMAND_SYSTEM_PROGRAM_ID,
        world: worldPda,
        entities: [
            {
                entity: mapPda,
                components: [
                    {
                        componentId: MAP_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
            {
                entity: playerPda,
                components: [
                    {
                        componentId: PLAYER_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
        ],
        args,
    });

    const dudu = await queue.processSessionEphemTransaction(
        "SystemCommand:",
        applySystem.transaction
    );

    return dudu;
}

export async function getMapAccount(
    engine: MagicBlockEngine,
    mapCompPda: PublicKey
) {
    const account = await engine.getEphemAccountInfo(mapCompPda);

    if (!account) {
        console.log("account not found");
        return null;
    }
    // If we found the game, decode its state
    const coder = getMapComponentOnEphem(engine).coder;

    const data = coder.accounts.decode<MapAccount>("map", account.data);

    return data;
}

export async function getPlayerAccount(
    engine: MagicBlockEngine,
    playerCompPda: PublicKey
) {
    const account = await engine.getEphemAccountInfo(playerCompPda);

    if (!account) {
        console.log("account not found");
        return null;
    }
    // If we found the game, decode its state
    const coder = getPlayerComponentOnEphem(engine).coder;

    const data = coder.accounts.decode<PlayerAccount>("player", account.data);

    return data;
}

