import {
    initData,
    miniApp,
    useLaunchParams,
    useSignal,
} from "@telegram-apps/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppRoot } from "@telegram-apps/telegram-ui";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css");
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { MagicBlockEngineProvider } from "./magic-block-engine-provider";
import { LoadingProvider, useLoading } from "./loading-provider";
import { Spinner } from "./spinner";
import { useClientOnce, useTelegramMock } from "@/hooks/use-telgram-mock";
import { init } from "@/libs/telegram";

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
                        <TelegramWrapper>
                            <LoadingProvider>
                                <LoadingWrapper>{children}</LoadingWrapper>
                            </LoadingProvider>
                        </TelegramWrapper>
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

function useDidMount(): boolean {
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        setDidMount(true);
    }, []);

    return didMount;
}

function TelegramProvider({ children }: { children: React.ReactNode }) {
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTelegramMock();
    }

    const lp = useLaunchParams();
    const debug = isDev || lp.startParam === "debug";

    // Initialize the library.
    useClientOnce(() => {
        init(debug);
    });

    const isDark = useSignal(miniApp.isDark);
    // const initDataUser = useSignal(initData.user);

    return (
        <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
            <AppRoot
                appearance={isDark ? "dark" : "light"}
                platform={
                    ["macos", "ios"].includes(lp.platform) ? "ios" : "base"
                }
            >
                {children}
            </AppRoot>
        </TonConnectUIProvider>
    );
}

export function TelegramWrapper({ children }: { children: React.ReactNode }) {
    const didMount = useDidMount();

    return didMount ? (
        <TelegramProvider>{children}</TelegramProvider>
    ) : (
        <div className="root__loading">Loading</div>
    );
}
