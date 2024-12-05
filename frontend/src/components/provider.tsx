import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css");
import { useMemo } from "react";
import { MagicBlockEngineProvider } from "./magic-block-engine-provider";
import { LoadingProvider, useLoading } from "./loading-provider";
import { Spinner } from "./spinner";

export function Providers({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint
    const endpoint = "https://rpc.test.honeycombprotocol.com"; //useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [new PhantomWalletAdapter()],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <MagicBlockEngineProvider>
                        <LoadingProvider>
                            <LoadingWrapper>{children}</LoadingWrapper>
                        </LoadingProvider>
                    </MagicBlockEngineProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

function LoadingWrapper({ children }: { children: React.ReactNode }) {
    const { isLoading } = useLoading();
    return (
        <>
            {isLoading && <Spinner />}
            {children}
        </>
    );
}

