import Phaser from "phaser";
import constants from "../config/constants";
import { WorldConfig } from "../config/worldsConfig";
import { PublicKey } from "@solana/web3.js";

export default class MainGame extends Phaser.Scene {
    private gameFieldScene!: Phaser.Scene;
    private gameUIScene!: Phaser.Scene;
    private pauseScene!: Phaser.Scene;
    private gameOverScene!: Phaser.Scene;
    private world!: WorldConfig;
    private mapPda!: PublicKey;
    private playerPda!: PublicKey;
    private enemiesPda!: PublicKey;
    private bulletsPda!: PublicKey;

    private initX!: number;
    private initY!: number;

    constructor() {
        super(constants.SCENES.GAME_MAIN);
    }

    init(data: {
        world: WorldConfig;
        mapPda: PublicKey;
        playerPda: PublicKey;
        enemiesPda: PublicKey;
        bulletsPda: PublicKey;
        x: number;
        y: number;
    }) {
        this.world = data.world;
        this.mapPda = data.mapPda;
        this.playerPda = data.playerPda;
        this.enemiesPda = data.enemiesPda;
        this.bulletsPda = data.bulletsPda;
        this.initX = data.x;
        this.initY = data.y;
    }

    create() {
        this.gameFieldScene = this.scene.get(constants.SCENES.GAME_FIELD);
        this.gameUIScene = this.scene.get(constants.SCENES.GAME_UI);
        this.pauseScene = this.scene.get(constants.SCENES.GAME_PAUSE);
        this.gameOverScene = this.scene.get(constants.SCENES.GAME_OVER);

        this.scene.launch(constants.SCENES.GAME_FIELD, {
            world: this.world,
            mapPda: this.mapPda,
            playerPda: this.playerPda,
            enemiesPda: this.enemiesPda,
            bulletsPda: this.bulletsPda,
            x: this.initX,
            y: this.initY,
        });
        this.scene.launch(constants.SCENES.GAME_UI);

        this.initEvents();
    }

    private initEvents(): void {
        this.initGameFieldEvents();
        this.initGameUIEvents();
        this.initPauseGameEvents();
        this.initGameOverEvents();
    }

    private initGameFieldEvents(): void {
        this.gameFieldScene.events.on(
            constants.EVENTS.GAME.PAUSE,
            this.handlePauseGame,
            this
        );

        this.gameFieldScene.events.on(
            constants.EVENTS.GAME.GAME_OVER,
            this.handleGameOverGame,
            this
        );
    }

    private initGameUIEvents(): void {
        this.gameUIScene.events.on(
            constants.EVENTS.GAME.PAUSE,
            this.handlePauseGame,
            this
        );
    }

    private initPauseGameEvents(): void {
        this.pauseScene.events.on(
            constants.EVENTS.GAME.RESUME,
            this.handleResumeGame,
            this
        );

        this.pauseScene.events.on(
            constants.EVENTS.GAME.EXIT,
            this.handleExitGame,
            this
        );
    }

    private initGameOverEvents(): void {
        this.gameOverScene.events.on(
            constants.EVENTS.GAME.EXIT,
            this.handleExitGame,
            this
        );
    }

    private handlePauseGame(): void {
        this.scene.pause(constants.SCENES.GAME_FIELD);
        this.scene.pause(constants.SCENES.GAME_UI);

        this.scene.launch(constants.SCENES.GAME_PAUSE);
    }

    private handleResumeGame(): void {
        this.scene.stop(constants.SCENES.GAME_PAUSE);

        this.scene.resume(constants.SCENES.GAME_FIELD);
        this.scene.resume(constants.SCENES.GAME_UI);
    }

    private handleExitGame(): void {
        this.scene.stop(constants.SCENES.GAME_FIELD);
        this.scene.stop(constants.SCENES.GAME_UI);
        this.scene.stop(constants.SCENES.GAME_PAUSE);
        this.scene.stop(constants.SCENES.GAME_OVER);
        this.scene.stop(constants.SCENES.GAME_SKILL_UP);

        this.scene.start(constants.SCENES.MAIN_MENU);
    }

    private handleGameOverGame(): void {
        this.scene.pause(constants.SCENES.GAME_FIELD);
        this.scene.pause(constants.SCENES.GAME_UI);
        this.scene.pause(constants.SCENES.GAME_PAUSE);
        this.scene.pause(constants.SCENES.GAME_SKILL_UP);

        this.scene.launch(constants.SCENES.GAME_OVER);
    }
}

