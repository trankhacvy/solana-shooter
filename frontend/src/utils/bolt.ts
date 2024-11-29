import {
    FindComponentPda,
    SerializeArgs,
    SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@magicblock-labs/bolt-sdk";
import type web3 from "@solana/web3.js";
import {
    Transaction,
    PublicKey,
    TransactionInstruction,
    Connection,
    Keypair,
} from "@solana/web3.js";
import { AnchorProvider, type Idl, Program } from "@coral-xyz/anchor";
import { WORLD_PROGRAM_ID, WorldIDL } from "@/libs/programs";

const MAX_COMPONENTS = 5;

interface ApplySystemEntity {
    entity: PublicKey;
    components: ApplySystemComponent[];
}

interface ApplySystemComponent {
    componentId: PublicKey;
    seed?: string;
}

interface ApplySystemInstruction {
    connection: Connection;
    authority: PublicKey;
    systemId: PublicKey;
    entities: ApplySystemEntity[];
    world: PublicKey;
    extraAccounts?: web3.AccountMeta[];
    args?: object;
}

function getApplyInstructionFunctionName(componentsCount: number) {
    return `apply${componentsCount > 1 ? componentsCount : ""}`;
}

function getBoltComponentName(index: number, componentsCount: number) {
    if (componentsCount === 1) return "boltComponent";
    return `boltComponent${index + 1}`;
}

function getBoltComponentProgramName(index: number, componentsCount: number) {
    if (componentsCount === 1) return "componentProgram";
    return `componentProgram${index + 1}`;
}

async function createApplySystemInstruction({
    connection,
    authority,
    systemId,
    entities,
    world,
    extraAccounts,
    args,
}: ApplySystemInstruction): Promise<web3.TransactionInstruction> {
    const program = new Program(
        WorldIDL as Idl,
        new AnchorProvider(connection, {
            publicKey: Keypair.generate().publicKey,
            signAllTransactions: async (txns) => txns,
            signTransaction: async (txn) => txn,
        })
    ) as unknown as any;

    let componentCount = 0;
    entities.forEach(function (entity) {
        componentCount += entity.components.length;
    });
    if (componentCount <= 0) {
        throw new Error("No components provided");
    }
    if (componentCount > MAX_COMPONENTS) {
        throw new Error(
            `Not implemented for component counts outside 1-${MAX_COMPONENTS}`
        );
    }

    const applyAccounts = {
        authority: authority ?? WORLD_PROGRAM_ID,
        boltSystem: systemId,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        world,
    };

    let componentIndex = 0;
    entities.forEach(function (entity) {
        entity.components.forEach(function (component) {
            const componentPda = FindComponentPda({
                componentId: component.componentId,
                entity: entity.entity,
                seed: component.seed,
            });
            // @ts-ignore
            applyAccounts[
                getBoltComponentProgramName(componentIndex, componentCount)
            ] = component.componentId;
            // @ts-ignore
            applyAccounts[
                getBoltComponentName(componentIndex, componentCount)
            ] = componentPda;
            componentIndex++;
        });
    });
    return program.methods[getApplyInstructionFunctionName(componentCount)](
        SerializeArgs(args)
    )
        .accounts(applyAccounts)
        .remainingAccounts(extraAccounts ?? [])
        .instruction();
}

export async function ApplySystem({
    connection,
    authority,
    systemId,
    entities,
    world,
    extraAccounts,
    args,
}: {
    connection: Connection;
    authority: PublicKey;
    systemId: PublicKey;
    entities: ApplySystemEntity[];
    world: PublicKey;
    extraAccounts?: web3.AccountMeta[];
    args?: object;
}): Promise<{ instruction: TransactionInstruction; transaction: Transaction }> {
    const applySystemIx = await createApplySystemInstruction({
        connection,
        authority,
        systemId,
        entities,
        world,
        extraAccounts,
        args,
    });
    return {
        instruction: applySystemIx,
        transaction: new Transaction().add(applySystemIx),
    };
}

