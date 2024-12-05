import Phaser from "phaser";
import constants from "../config/constants";
import Cheats from "../components/Cheats/Cheats";
import Player from "../components/Player";
import SceneCamera from "../components/SceneCamera";
import Bullet from "../components/Weapon/Bullet";
import Enemy from "../components/EnemyController/Enemy";
import WaveGenerator from "../components/Waves/WaveGenerator";
import EnemyGroup from "../components/EnemyController/EnemyGroup";
import WorldController from "../components/WorldController/WorldController";
import { WorldConfig } from "../config/worldsConfig";
import WavesController from "../components/WavesController/WavesController";
import type { ControlsType } from "../types";
import { PublicKey } from "@solana/web3.js";
import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";
import { MagicBlockEnginePlugin } from "../plugins/FloatingNumbers/MagicBlockEngine";
import {
    BULLETS_COMPONENT_PROGRAM_ID,
    BulletsAccount,
    ENEMIES_COMPONENT_PROGRAM_ID,
    getBulletsComponentOnEphem,
    MAP_COMPONENT_PROGRAM_ID,
    PLAYER_COMPONENT_PROGRAM_ID,
} from "@/libs/programs";
import { FindComponentPda } from "@magicblock-labs/bolt-sdk";
import EnemyController from "../components/EnemyV2/EnemyController";
import { BulletController } from "../components/Bullet";

export default class GameField extends Phaser.Scene {
    private controls!: ControlsType;
    private cheats!: Cheats;
    private player!: Player;
    private sceneCamera!: SceneCamera;
    private waveGenerator!: WaveGenerator;
    private allEnemies!: EnemyGroup[];
    private gameTime!: number;
    private world!: WorldConfig;
    private worldController!: WorldController;
    private wavesController!: WavesController;
    private engine: MagicBlockEngine;
    private mapPda: PublicKey;
    private playerPda: PublicKey;
    private enemiesPda!: PublicKey;
    private bulletsPda!: PublicKey;

    private mapCompPda: PublicKey;
    private playerCmpPda: PublicKey;
    private enemiesCmpPda: PublicKey;
    private bulletsCompCmpPda: PublicKey;
    private initX: number;
    private initY: number;

    private bullets: Record<string, Phaser.GameObjects.Rectangle> = {};

    private worker: Worker;

    private enemyController: EnemyController;
    private bulletController: BulletController;

    constructor() {
        super(constants.SCENES.GAME_FIELD);
    }

    init(data: {
        world: WorldConfig;
        mapPda: PublicKey;
        playerPda: PublicKey;
        enemiesPda: PublicKey;
        bulletsPda: PublicKey;
        x: number;
        y: number;
    }): void {
        this.world = data.world;
        this.mapPda = data.mapPda;
        this.playerPda = data.playerPda;
        this.enemiesPda = data.enemiesPda;
        this.bulletsPda = data.bulletsPda;
        this.initX = data.x;
        this.initY = data.y;

        this.mapCompPda = FindComponentPda({
            entity: this.mapPda,
            componentId: MAP_COMPONENT_PROGRAM_ID,
        });

        this.playerCmpPda = FindComponentPda({
            entity: this.playerPda,
            componentId: PLAYER_COMPONENT_PROGRAM_ID,
        });

        this.enemiesCmpPda = FindComponentPda({
            entity: this.enemiesPda,
            componentId: ENEMIES_COMPONENT_PROGRAM_ID,
        });

        this.bulletsCompCmpPda = FindComponentPda({
            entity: this.bulletsPda,
            componentId: BULLETS_COMPONENT_PROGRAM_ID,
        });

        this.controls = this.input.keyboard.addKeys({
            pause: Phaser.Input.Keyboard.KeyCodes.ESC,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
        }) as ControlsType;
    }

    async create() {
        // plugin
        const plugin = this.plugins.get(
            "magicBlockEngine"
        ) as MagicBlockEnginePlugin;
        this.engine = plugin.engine;

        this.physics.world.setBounds(
            0,
            0,
            constants.LEVEL.WIDTH * constants.LEVEL.TILE_SIZE,
            constants.LEVEL.HEIGHT * constants.LEVEL.TILE_SIZE
        );

        this.player = new Player(
            this,
            this.engine,
            this.mapPda,
            this.playerPda,
            this.initX,
            this.initY,
            constants.PLAYER.DEFAULT.TYPE,
            constants.PLAYER.DEFAULT.FRAME
        );

        this.cheats = new Cheats(this, this.player);
        this.cheats.enableCheat(constants.CHEATS);

        this.worldController = new WorldController(this, this.player);
        this.worldController.load(this.world.id);

        this.data.set("player", this.player);

        this.sceneCamera = new SceneCamera(this, this.player);
        this.sceneCamera.addMinimap();

        this.wavesController = new WavesController(this, this.player);
        const waves = this.wavesController.getWaves(this.world);
        this.allEnemies = this.wavesController.getAllEnemies;

        this.enemyController = new EnemyController(
            this,
            this.engine,
            this.enemiesPda
        );

        this.bulletController = new BulletController(
            this,
            this.engine,
            this.bulletsPda,
            this.player
        );

        this.physics.add.collider(
            this.player,
            this.allEnemies,
            (playerObject, enemyObject) => {
                const player = playerObject as Player;
                const enemy = enemyObject as Enemy;

                if (this.gameTime > enemy.getLastBodyDamage) {
                    enemy.takeDamage(player.getBodyDamage);
                    enemy.setLastBodyDamage =
                        this.gameTime + player.getBodyAttackTime;
                }

                if (this.gameTime > player.getLastBodyDamage) {
                    player.setLastBodyDamage =
                        this.gameTime + enemy.getBodyAttackTime;
                    player.takeDamage(enemy.getBodyDamage);
                }
            },
            undefined,
            this
        );

        this.physics.add.overlap(
            this.player.getWeapon.ammoGroup,
            this.allEnemies,
            (bulletObject, enemyObject) => {
                const bullet = bulletObject as Bullet;
                const enemy = enemyObject as Enemy;

                const summaryDamage =
                    bullet.getDamage * this.player.getBulletDamage;

                enemy.takeDamage(summaryDamage);
                this.player.getWeapon.ammoGroup.removeBullet(bullet);
            },
            undefined,
            this
        );

        // this.waveGenerator = new WaveGenerator(this, waves);

        this.data.set("enemiesCount", 0);

        this.addSound();
        this.addEvents();

        this.worker = new Worker(new URL("../../libs/worker", import.meta.url));
        this.worker.onmessage = (event: MessageEvent<string>) => {
            this.engine.waitSignatureConfirmation(
                "tickSystem",
                event.data,
                this.engine.getConnectionEphem(),
                "confirmed"
            );
        };
    }

    private addSound(): void {
        this.sound.play(this.world.music, {
            volume: 0.1,
            loop: true,
        });
    }

    private addEvents(): void {
        this.events.on(
            constants.EVENTS.UI.UPDATE_KILL_COUNT,
            (enemy: Enemy) => {
                this.player.addExperience(enemy.getExperience);
            }
        );

        this.events.on(
            Phaser.Scenes.Events.SHUTDOWN,
            () => this.sound.stopByKey(this.world.music),
            this
        );

        this.events.on(
            Phaser.Scenes.Events.PAUSE,
            () => this.sound.stopByKey(this.world.music),
            this
        );

        this.events.on(
            Phaser.Scenes.Events.RESUME,
            () =>
                this.sound.play(this.world.music, {
                    volume: 0.1,
                    loop: true,
                }),
            this
        );

        this.events.on(
            "changedata-enemiesCount",
            (gameObject: Phaser.GameObjects.GameObject, value: number) => {
                console.log("Enemies:", value);
            }
        );
    }

    private elapsedTime = 0;
    private fixedTimeStep = 1000 / 5;

    update(time: number, delta: number) {
        this.gameTime = time;

        if (this.controls.pause.isDown) {
            this.events.emit(constants.EVENTS.GAME.PAUSE);
        }

        this.player.setClosestEnemy =
            (this.player.findClosestEnemy(this.allEnemies) as Enemy) || null;

        this.player.update(time, delta);

        // this.worldController.update();

        this.cheats.update();

        this.elapsedTime += delta;
        while (this.elapsedTime >= this.fixedTimeStep) {
            this.elapsedTime -= this.fixedTimeStep;
            this.tryToApplyTickSystem();
        }

        this.enemyController.update();
        this.bulletController.update();
    }

    listenBullet() {
        if (!this.engine || !this.bulletsCompCmpPda) return;

        this.engine.subscribeToEphemAccountInfo(
            this.bulletsCompCmpPda,
            (accountInfo) => {
                // If the game doesn't exist in the ephemeral
                if (!accountInfo) {
                    console.log("account not found");
                    return;
                }
                // If we found the game, decode its state
                const coder = getBulletsComponentOnEphem(this.engine).coder;
                const data = coder.accounts.decode<BulletsAccount>(
                    "bullets",
                    accountInfo.data
                );
                if (data) {
                    const bullets = data.bulelts;
                    const bulletIds = bullets.map((bullet) => bullet.id);

                    Object.keys(this.bullets).forEach((id) => {
                        if (!bulletIds.includes(id)) {
                            this.bullets[id].destroy();
                            delete this.bullets[id];
                        }
                    });

                    bullets.forEach((enemy) => {
                        if (this.bullets[enemy.id]) {
                            if (enemy.active) {
                                this.bullets[enemy.id].setData(
                                    "serverX",
                                    enemy.x
                                );
                                this.bullets[enemy.id].setData(
                                    "serverY",
                                    enemy.y
                                );
                                this.bullets[enemy.id].setData(
                                    "active",
                                    enemy.active
                                );
                            }
                        } else {
                            const entity = this.add.rectangle(
                                enemy.x,
                                enemy.y,
                                15,
                                15,
                                0xff0000
                            );
                            entity.setStrokeStyle(1, 0x00eeff);
                            entity.setDepth(8);
                            entity.setData("serverX", enemy.x);
                            entity.setData("serverY", enemy.y);
                            entity.setData("active", enemy.active);

                            this.bullets[String(enemy.id)] = entity;
                        }
                    });
                }
            }
        );
    }

    tryToApplyTickSystem() {
        if (
            !this.engine ||
            !this.mapPda ||
            !this.playerPda ||
            !this.enemiesPda ||
            !this.bulletsPda
        )
            return;

        this.worker.postMessage({
            type: "apply-tick",
            data: {
                mapPda: this.mapPda.toBase58(),
                playerPda: this.playerPda.toBase58(),
                enemiesPda: this.enemiesPda.toBase58(),
                bulletsPda: this.bulletsPda.toBase58(),
                sessionKey: this.engine.getSessionKey().secretKey,
            },
        });
    }
}

