import Phaser, { Game } from "phaser";
import constants from "./config/constants";
import SceneList from "./config/sceneList";
import { plugins } from "./config/pluginsConfig";
import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";
import { MagicBlockEnginePlugin } from "./plugins/FloatingNumbers/MagicBlockEngine";
import { WalletConnectPlugin, WalletContextStateExtended } from "./plugins/WalletConnect";
import { WalletContextState } from "@solana/wallet-adapter-react";

//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    title: "A Sol game",
    version: "1.0.0",
    type: Phaser.WEBGL,
    parent: "game-wrapper",
    backgroundColor: "#38393D",
    width: constants.WIDTH,
    height: constants.HEIGHT,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: constants.SCALE,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: constants.DEBUG,
            fps: 60,
        },
    },
    fps: {
        target: 60,
        forceSetTimeOut: true,
    },
    render: {
        pixelArt: false,
    },
    autoFocus: true,
    scene: SceneList,
    plugins,
};

const StartGame = (
    parent: string,
    engine: MagicBlockEngine,
    walletState: WalletContextStateExtended
) => {
    window.Phaser = Phaser;

    return new Game({
        ...config,
        plugins: {
            global: [
                {
                    key: "magicBlockEngine",
                    plugin: MagicBlockEnginePlugin,
                    start: true,
                    data: engine,
                },
                {
                    key: "walletConnect",
                    plugin: WalletConnectPlugin,
                    start: true,
                    data: walletState,
                },
            ],
            ...config.plugins,
        },
        parent,
    });
};

export default StartGame;

