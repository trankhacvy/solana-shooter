import * as React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";

const SESSION_LOCAL_STORAGE = "magicblock-session-key";
const SESSION_MIN_LAMPORTS = 0.02 * 1_000_000_000;
const SESSION_MAX_LAMPORTS = 0.05 * 1_000_000_000;

const MagicBlockEngineContext = React.createContext<MagicBlockEngine>(
    {} as MagicBlockEngine
);

export function useMagicBlockEngine(): MagicBlockEngine {
    return React.useContext(MagicBlockEngineContext);
}

export function MagicBlockEngineProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const walletContext = useWallet();
    const [engine, setEngine] = React.useState<MagicBlockEngine | null>(null);

    React.useEffect(() => {
        let sessionKey;

        const sessionKeyString = localStorage.getItem(SESSION_LOCAL_STORAGE);
        if (sessionKeyString) {
            sessionKey = Keypair.fromSecretKey(
                Uint8Array.from(JSON.parse(sessionKeyString))
            );
        } else {
            sessionKey = Keypair.generate();
            localStorage.setItem(
                SESSION_LOCAL_STORAGE,
                JSON.stringify(Array.from(sessionKey.secretKey))
            );
        }

        setEngine(
            new MagicBlockEngine(walletContext, sessionKey, {
                minLamports: SESSION_MIN_LAMPORTS,
                maxLamports: SESSION_MAX_LAMPORTS,
            })
        );
    }, [walletContext]);

    if (!engine) return <div />;

    return (
        <MagicBlockEngineContext.Provider value={engine}>
            {children}
        </MagicBlockEngineContext.Provider>
    );
}

