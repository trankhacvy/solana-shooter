import {
    ComputeBudgetProgram,
    Connection,
    Keypair,
    PublicKey,
    Transaction,
} from "@solana/web3.js";
import { ApplySystem } from "@/utils/bolt";
import {
    BULLETS_COMPONENT_PROGRAM_ID,
    COLLIDER_SYSTEM_PROGRAM_ID,
    COMMAND_SYSTEM_PROGRAM_ID,
    DEFAULT_WORLD_PUBKEY,
    ENEMIES_COMPONENT_PROGRAM_ID,
    MAP_COMPONENT_PROGRAM_ID,
    MAP_POSITION_SYSTEM_PROGRAM_ID,
    NEW_MAP_SYSTEM_PROGRAM_ID,
    PLAYER_ATTACK_SYSTEM_PROGRAM_ID,
    PLAYER_COMPONENT_PROGRAM_ID,
    TICK_SYSTEM_PROGRAM_ID,
} from "./programs";

addEventListener("message", (event) => {
    console.log("worker event", event.data);
    const data = event.data;

    if (data.type === "apply-new-app") {
        handleApplyNewMap(
            new PublicKey(data.data.mapPda),
            new PublicKey(data.data.playerPda),
            new PublicKey(data.data.enemiesPda),
            new PublicKey(data.data.bulletsPda),
            data.data.sessionKey
        );
    } else if (data.type === "apply-tick") {
        handleApplyTickSystems(
            new PublicKey(data.data.mapPda),
            new PublicKey(data.data.playerPda),
            new PublicKey(data.data.enemiesPda),
            new PublicKey(data.data.bulletsPda),
            data.data.sessionKey
        );
    } else if (data.type === "apply-command") {
        handleApplyCommandSystem(
            new PublicKey(data.data.mapPda),
            new PublicKey(data.data.playerPda),
            data.data.arg,
            data.data.sessionKey
        );
    }
});

const ENDPOINT_EPHEM_RPC = "https://devnet.magicblock.app";
const ENDPOINT_EPHEM_WS = "wss://devnet.magicblock.app:8900";

class MagicBlockQueue {
    private last?: Promise<string>;

    constructor() {
        this.last = undefined;
    }

    async processSessionEphemTransaction(
        connection: Connection,
        transaction: Transaction,
        signer: Keypair
    ): Promise<string> {
        const last = this.last ? () => this.last : undefined;
        const next = (async function () {
            try {
                if (last !== undefined) {
                    last();
                }
            } catch (error) {
                console.error();
                // The error should be handled by another awaiter (from the return)
            }
            const expiration = new Promise<string>((resolve) =>
                setTimeout(() => resolve("expired"), 1000)
            );

            const execution = connection.sendTransaction(
                transaction,
                [signer],
                {
                    skipPreflight: true,
                    maxRetries: 0,
                }
            );

            return await Promise.race([expiration, execution]);
        })();

        this.last = next;
        return next;
    }
}

const queue = new MagicBlockQueue();

const handleApplyNewMap = async (
    mapPda: PublicKey,
    playerPda: PublicKey,
    enemiesPda: PublicKey,
    bulletsPda: PublicKey,
    sessionKey: Uint8Array
) => {
    const connectionEphem = new Connection(ENDPOINT_EPHEM_RPC, {
        wsEndpoint: ENDPOINT_EPHEM_WS,
    });

    const session = Keypair.fromSecretKey(sessionKey);

    const applySystem = await ApplySystem({
        connection: connectionEphem,
        authority: session.publicKey,
        systemId: NEW_MAP_SYSTEM_PROGRAM_ID,
        world: DEFAULT_WORLD_PUBKEY,
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

    console.log("applySystem", applySystem.transaction);

    const signature = await connectionEphem.sendTransaction(
        applySystem.transaction,
        [session],
        { skipPreflight: true, maxRetries: 0 }
    );

    await connectionEphem.confirmTransaction({
        blockhash: applySystem.transaction.recentBlockhash,
        lastValidBlockHeight: applySystem.transaction.lastValidBlockHeight,
        signature,
    });

    console.log("success: ", signature);
};

const handleApplyTickSystems = async (
    mapPda: PublicKey,
    playerPda: PublicKey,
    enemiesPda: PublicKey,
    bulletsPda: PublicKey,
    sessionKey: Uint8Array
) => {
    const connectionEphem = new Connection(ENDPOINT_EPHEM_RPC, {
        wsEndpoint: ENDPOINT_EPHEM_WS,
    });

    const session = Keypair.fromSecretKey(sessionKey);

    const worldPda = DEFAULT_WORLD_PUBKEY; //await getOrCreateWorld(engine);

    const applyColliderSystem = await ApplySystem({
        connection: connectionEphem,
        authority: session.publicKey,
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

    const applyTickSystem = await ApplySystem({
        connection: connectionEphem,
        authority: session.publicKey,
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
                entity: enemiesPda,
                components: [
                    {
                        componentId: ENEMIES_COMPONENT_PROGRAM_ID,
                    },
                ],
            },
        ],
    });

    const applyMapPositionsSystem = await ApplySystem({
        connection: connectionEphem,
        authority: session.publicKey,
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

    const applyPlayerAttackSystem = await ApplySystem({
        connection: connectionEphem,
        authority: session.publicKey,
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

    const { value: blockhash } =
        await connectionEphem.getLatestBlockhashAndContext();
    const recentBlockhash = blockhash.blockhash;

    const tran = new Transaction({
        feePayer: session.publicKey,
        recentBlockhash,
    }).add(
        ...[
            ComputeBudgetProgram.setComputeUnitLimit({
                units: 1200000,
            }),
            applyColliderSystem.instruction,
            applyTickSystem.instruction,
            applyMapPositionsSystem.instruction,
            applyPlayerAttackSystem.instruction,
        ]
    );

    const signature = await connectionEphem.sendTransaction(tran, [session], {
        skipPreflight: true,
        maxRetries: 0,
    });

    postMessage(signature);
};

const handleApplyCommandSystem = async (
    mapPda: PublicKey,
    playerPda: PublicKey,
    args: Object,
    sessionKey: Uint8Array
) => {
    const connectionEphem = new Connection(ENDPOINT_EPHEM_RPC, {
        wsEndpoint: ENDPOINT_EPHEM_WS,
    });

    const session = Keypair.fromSecretKey(sessionKey);

    const worldPda = DEFAULT_WORLD_PUBKEY;

    const applySystem = await ApplySystem({
        connection: connectionEphem,
        authority: session.publicKey,
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

    const { value: blockhash } =
        await connectionEphem.getLatestBlockhashAndContext();
    const recentBlockhash = blockhash.blockhash;

    const tran = new Transaction({
        feePayer: session.publicKey,
        recentBlockhash,
    }).add(applySystem.instruction);

    const signature = await queue.processSessionEphemTransaction(
        connectionEphem,
        tran,
        session
    );

    console.log("signature", signature);

    // postMessage(signature);
};

