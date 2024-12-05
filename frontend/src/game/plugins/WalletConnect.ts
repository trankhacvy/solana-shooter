import { WalletContextState } from "@solana/wallet-adapter-react";

export type WalletContextStateExtended = {
    setVisible: (open: boolean) => void;
} & WalletContextState

export class WalletConnectPlugin extends Phaser.Plugins.BasePlugin {
    public walletState: WalletContextStateExtended;

    constructor(pluginManager: any) {
        super(pluginManager);
    }

    init(data?: any | undefined): void {
        this.walletState = data;
    }

    public connect() {
        this.walletState.setVisible(true)
    }
}

