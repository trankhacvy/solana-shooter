import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";
import Phaser from "phaser";
import { useMagicBlockEngine } from "@/components/magic-block-engine-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import EVENTS from "./config/events";
import { useLoading } from "@/components/loading-provider";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const walletState = useWallet();
        const { setVisible } = useWalletModal();
        const { setIsLoading, isLoading } = useLoading();

        const game = useRef<Phaser.Game | null>(null!);
        const engine = useMagicBlockEngine();

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container", engine, {
                    ...walletState,
                    setVisible,
                });

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref, engine]);

        useEffect(() => {
            const handleGameResize = (event: any) => {
                if (!game.current) return;
                if (game.current.scale.isFullscreen) {
                    if (
                        game.current.scale.autoCenter !=
                        Phaser.Scale.Center.CENTER_BOTH
                    ) {
                        game.current.scale.scaleMode =
                            Phaser.Scale.ScaleModes.ENVELOP; // scalemode in fullscreen does nothing
                        game.current.scale.autoCenter =
                            Phaser.Scale.Center.CENTER_BOTH; // centering in fullscreen
                        game.current.scale.refresh();
                    }
                } else {
                    if (
                        game.current.scale.autoCenter !=
                        Phaser.Scale.Center.CENTER_HORIZONTALLY
                    ) {
                        game.current.scale.autoCenter =
                            Phaser.Scale.Center.CENTER_HORIZONTALLY; // initial centering
                        game.current.scale.scaleMode =
                            Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT; // initial scalemode
                        game.current.scale.refresh();
                    }
                }
            };

            window.addEventListener("resize", handleGameResize, false);

            EventBus.on(
                "current-scene-ready",
                (scene_instance: Phaser.Scene) => {
                    if (
                        currentActiveScene &&
                        typeof currentActiveScene === "function"
                    ) {
                        currentActiveScene(scene_instance);
                    }

                    if (typeof ref === "function") {
                        ref({ game: game.current, scene: scene_instance });
                    } else if (ref) {
                        ref.current = {
                            game: game.current,
                            scene: scene_instance,
                        };
                    }
                }
            );
            return () => {
                EventBus.removeListener("current-scene-ready");
                window.removeEventListener("resize", handleGameResize, false);
            };
        }, [currentActiveScene, ref]);

        useEffect(() => {
            EventBus.emit(EVENTS.WALLET.STATUS, walletState.connected);

            return () => {
                EventBus.removeListener(EVENTS.WALLET.STATUS);
            };
        }, [walletState.connected]);

        useEffect(() => {
            EventBus.on(EVENTS.LOADING.TOGGLE_LOADING, (loading) => {
                setIsLoading(loading);
            });

            return () => {
                EventBus.removeListener(EVENTS.LOADING.TOGGLE_LOADING);
            };
        }, []);

        useEffect(() => {
            EventBus.emit(EVENTS.LOADING.IS_LOADING, isLoading);

            return () => {
                EventBus.removeListener(EVENTS.LOADING.IS_LOADING);
            };
        }, [isLoading]);

        return <div id="game-container" className="w-full h-screen"></div>;
    }
);

