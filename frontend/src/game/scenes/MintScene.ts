import Phaser from "phaser";
import constants from "../config/constants";
import {
    Anchor,
    Buttons,
} from "@/phaser3-rex-notes/templates/ui/ui-components";
import { selectButton, unselectButton } from "../utils/selectButton";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { WalletConnectPlugin } from "../plugins/WalletConnect";
import EVENTS from "../config/events";
import { EventBus } from "../EventBus";
import { createUserAndProfileIfNeeded } from "@/libs/honeycomb";

export default class DemoScene extends Phaser.Scene {
    private buttonSelector!: Phaser.GameObjects.Image;
    private plugin: WalletConnectPlugin;
    private walletState: WalletContextState;

    constructor() {
        super(constants.SCENES.MINT);
    }

    init(): void {}

    create() {
        this.plugin = this.plugins.get("walletConnect") as WalletConnectPlugin;
        this.walletState = this.plugin.walletState;

        const { width, height } = this.scale;

        const bg = this.add.image(0, 0, "mint-bg").setOrigin(0.5, 0.5);

        const scale = width / bg.width;
        bg.setScale(scale);

        bg.setX(width / 2);
        bg.setY(height / 2);

        const logo = this.add.image(0, 0, "app-logo").setScale(0.3);
        new Anchor(logo, {
            centerX: "center",
            top: "top+100",
        });

        this.addButtons();
        this.addBank();
        this.addSound();
        this.addEvents();
    }

    private addBank(): void {}

    private addButtons(): void {
        const buttons = new Buttons(this, {
            x: 0,
            y: 0,
            anchor: {
                centerX: "center",
                top: "top+500",
            },
            orientation: "y",
            space: { item: 30 },
            buttons: [
                this.add.image(
                    0,
                    0,
                    "ui-main-menu",
                    this.walletState.connected ? "start" : "shop"
                ),
            ],
            click: {
                mode: "pointerup",
                clickInterval: 300,
            },
        }).layout();
        this.add.existing(buttons);
        buttons.on(
            "button.click",
            (button: Phaser.GameObjects.Image, index: number) => {
                this.sound.play("button", { volume: 1 });
                switch (index) {
                    case 0:
                        this.handleConnectWallet();
                        break;
                }
            }
        );

        buttons.on("button.over", (button: Phaser.GameObjects.Image) => {
            selectButton(button, this.buttonSelector);
        });

        buttons.on("button.out", (button: Phaser.GameObjects.Image) => {
            unselectButton(button, this.buttonSelector);
        });
    }

    private async handleConnectWallet() {
        if (this.walletState.connected) {
            try {
                EventBus.emit(EVENTS.LOADING.TOGGLE_LOADING, true);

                // const user = await createUserAndProfileIfNeeded(
                //     this.walletState
                // );
                // console.log("user", user);

                this.scene.start(constants.SCENES.CITY);
            } catch (error) {
                console.error(error);
            } finally {
                EventBus.emit(EVENTS.LOADING.TOGGLE_LOADING, false);
            }
        } else {
            this.plugin.connect();
        }
    }

    private addSound(): void {
        setTimeout(() => {
            this.sound.play("main-theme", {
                volume: 0.1,
                loop: true,
            });
        }, 200);
    }

    private addEvents(): void {
        this.events.on(
            EVENTS.WALLET.STATUS,
            (status) => {
                console.log("status", status);
            },
            this
        );
    }

    update(_time: number, _delta: number) {}
}

