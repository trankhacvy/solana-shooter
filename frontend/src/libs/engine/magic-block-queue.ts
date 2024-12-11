import { Transaction } from "@solana/web3.js";

import { MagicBlockEngine } from "./magic-block-engine";

export class MagicBlockQueue {
    private engine: MagicBlockEngine;
    private last?: Promise<string>;

    constructor(engine: MagicBlockEngine) {
        this.engine = engine;
        this.last = undefined;
    }

    getSessionPayer() {
        return this.engine.getSessionPayer();
    }

    async processSessionEphemTransaction(
        name: string,
        transaction: Transaction
    ): Promise<string> {
        const engine = this.engine;
        const last = this.last ? () => this.last : undefined;
        const next = (async function () {
            try {
                if (last !== undefined) {
                    last();
                }
            } catch (error) {
                // The error should be handled by another awaiter (from the return)
            }
            const expiration = new Promise<string>((resolve) =>
                setTimeout(() => resolve(""), 100)
            );
            const execution = engine.isLocalhost()
                ? engine.processSessionChainTransaction(name, transaction)
                : engine.processSessionEphemTransaction(name, transaction);

            return Promise.race([expiration, execution]);
        })();

        this.last = next;
        return next;
    }
}

