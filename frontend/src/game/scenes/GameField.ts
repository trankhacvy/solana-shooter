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
    EnemiesAccount,
    getBulletsComponentOnEphem,
    getEnemiesComponentOnEphem,
    getPlayerComponentOnEphem,
    MAP_COMPONENT_PROGRAM_ID,
    PLAYER_COMPONENT_PROGRAM_ID,
    PlayerAccount,
} from "@/libs/programs";
import { FindComponentPda } from "@magicblock-labs/bolt-sdk";

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

    remoteRef: Phaser.GameObjects.Rectangle;
    private enemies: Record<string, Phaser.GameObjects.Container> = {};
    private bullets: Record<string, Phaser.GameObjects.Rectangle> = {};

    private worker: Worker;

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

        // fake player
        this.remoteRef = this.add.rectangle(
            (constants.LEVEL.WIDTH * constants.LEVEL.TILE_SIZE) / 2,
            (constants.LEVEL.HEIGHT * constants.LEVEL.TILE_SIZE) / 2,
            120,
            120
        );
        this.remoteRef.setStrokeStyle(1, 0xff00ff);
        this.remoteRef.setDepth(8);

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
        this.listenPlayer();
        this.listEnemies();
        this.listenBullet();

        this.worker = new Worker(new URL("../../libs/worker", import.meta.url));
        this.worker.onmessage = (event: MessageEvent<string>) => {
            this.engine.waitSignatureConfirmation(
                "tick",
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

        this.worldController.update();

        this.cheats.update();

        this.elapsedTime += delta;
        while (this.elapsedTime >= this.fixedTimeStep) {
            this.elapsedTime -= this.fixedTimeStep;
            this.tryToApplyTickSystem();
        }

        Object.values(this.enemies).forEach((enemy) => {
            const x = enemy.getData("serverX");
            const y = enemy.getData("serverY");
            const hp = enemy.getData("hp");
            const active = enemy.getData("active");

            if (!!x && !!y) {
                enemy.x = x; //Phaser.Math.Linear(enemy.x, x, 0.2);
                enemy.y = y; //Phaser.Math.Linear(enemy.y, y, 0.2);

                (enemy?.list?.[0] as Phaser.GameObjects.Arc)!.fillColor = active
                    ? 0x00ff44
                    : 0xff00ff;
                (enemy?.list?.[1] as Phaser.GameObjects.Text)?.setText(hp);
            }
        });

        Object.values(this.bullets).forEach((enemy) => {
            const x = enemy.getData("serverX");
            const y = enemy.getData("serverY");
            const active = enemy.getData("active");

            if (!!x && !!y) {
                enemy.x = Phaser.Math.Linear(enemy.x, x, 0.2);
                enemy.y = Phaser.Math.Linear(enemy.y, y, 0.2);
                enemy.fillColor = active ? 0xff0000 : 0x1133ff;
            }
        });
    }

    listenPlayer() {
        if (!this.engine || !this.playerCmpPda) return;

        this.engine.subscribeToEphemAccountInfo(
            this.playerCmpPda,
            (accountInfo) => {
                // If the game doesn't exist in the ephemeral
                if (!accountInfo) {
                    console.log("account not found");
                    return;
                }
                // If we found the game, decode its state
                const coder = getPlayerComponentOnEphem(this.engine).coder;

                const data = coder.accounts.decode<PlayerAccount>(
                    "player",
                    accountInfo.data
                );

                if (data) {
                    this.remoteRef.x = data.x;
                    this.remoteRef.y = data.y;
                    this.player.setCurrentHitPoints = data.hp;
                    console.log("HP", data.hp);
                }
            }
        );
    }

    listEnemies() {
        if (!this.engine || !this.enemiesCmpPda) return;

        this.engine.subscribeToEphemAccountInfo(
            this.enemiesCmpPda,
            (accountInfo) => {
                // If the game doesn't exist in the ephemeral
                if (!accountInfo) {
                    console.log("account not found");
                    return;
                }
                // If we found the game, decode its state
                const coder = getEnemiesComponentOnEphem(this.engine).coder;
                const data = coder.accounts.decode<EnemiesAccount>(
                    "enemies",
                    accountInfo.data
                );
                if (data) {
                    const enemies = data.enemies;
                    const enemyIds = enemies.map((bullet) => bullet.id);

                    console.log("tick enemy", enemies.length);

                    Object.keys(this.enemies).forEach((id) => {
                        if (!enemyIds.includes(id)) {
                            this.enemies[id].destroy();
                            delete this.enemies[id];
                        }
                    });

                    enemies.forEach((enemy) => {
                        if (this.enemies[enemy.id]) {
                            this.enemies[enemy.id].setData("serverX", enemy.x);
                            this.enemies[enemy.id].setData("serverY", enemy.y);
                            this.enemies[enemy.id].setData("hp", enemy.hp);
                            this.enemies[enemy.id].setData(
                                "active",
                                enemy.active
                            );
                        } else {
                            const circleGroup = this.add.container(
                                enemy.x,
                                enemy.y
                            );

                            const entity = this.add.circle(
                                20,
                                20,
                                20,
                                0x00ff44
                            );
                            circleGroup.add(entity);

                            const text = this.add
                                .text(20, 20, enemy.hp, {
                                    fontSize: "24px",
                                    color: "#ffffff",
                                    fontFamily: "Arial",
                                })
                                .setOrigin(0.5, 0.5);
                            circleGroup.add(text);

                            // entity.setStrokeStyle(1, 0x00eeff);
                            circleGroup.setDepth(8);
                            circleGroup.setData("serverX", enemy.x);
                            circleGroup.setData("serverY", enemy.y);
                            circleGroup.setData("hp", enemy.hp);
                            circleGroup.setData("active", enemy.active);

                            this.enemies[String(enemy.id)] = circleGroup;
                        }
                    });
                }
            }
        );
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
                    console.log("enemy nullets len: ", bullets.length);

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

    listenMap() {
        // if (!this.engine || !this.mapCompPda) return;
        // this.engine.subscribeToEphemAccountInfo(
        //     this.mapCompPda,
        //     (accountInfo) => {
        //         if (!accountInfo) {
        //             return;
        //         }
        //         const coder = getMapComponentOnEphem(this.engine).coder;
        //         const data = coder.accounts.decode<MapAccount>(
        //             "map",
        //             accountInfo.data
        //         );
        //         if (data) {
        //             const enemies = data.enemies;
        //             enemies.forEach((enemy) => {
        //                 if (this.enemies[enemy.id]) {
        //                     this.enemies[enemy.id].setData("serverX", enemy.x);
        //                     this.enemies[enemy.id].setData("serverY", enemy.y);
        //                 } else {
        //                     const entity = this.add.circle(
        //                         enemy.x,
        //                         enemy.y,
        //                         30,
        //                         30,
        //                         0x00ff44
        //                     );
        //                     entity.setStrokeStyle(1, 0x00eeff);
        //                     entity.setDepth(8);
        //                     entity.setData("serverX", enemy.x);
        //                     entity.setData("serverY", enemy.y);
        //                     this.enemies[String(enemy.id)] = entity;
        //                 }
        //             });
        //             const bullet = data.bullets;
        //             bullet.forEach((bullet) => {
        //                 if (this.enemies[bullet.id]) {
        //                     this.enemies[bullet.id].setData(
        //                         "serverX",
        //                         bullet.x
        //                     );
        //                     this.enemies[bullet.id].setData(
        //                         "serverY",
        //                         bullet.y
        //                     );
        //                 } else {
        //                     const entity = this.add.circle(
        //                         bullet.x,
        //                         bullet.y,
        //                         15,
        //                         14,
        //                         0xff0000
        //                     );
        //                     entity.setStrokeStyle(1, 0x00eeff);
        //                     entity.setDepth(8);
        //                     entity.setData("serverX", bullet.x);
        //                     entity.setData("serverY", bullet.y);
        //                     this.enemies[String(bullet.id)] = entity;
        //                 }
        //             });
        //         }
        //     }
        // );
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

        console.log("tryToApplyTickSystem");

        // applyColliderSystem(
        //     this.engine,
        //     this.mapPda,
        //     this.playerPda,
        //     this.enemiesPda,
        //     this.bulletsPda
        // );

        // this.worker.postMessage({
        //     type: "apply-tick",
        //     data: {
        //         mapPda: this.mapPda.toBase58(),
        //         playerPda: this.playerPda.toBase58(),
        //         enemiesPda: this.enemiesPda.toBase58(),
        //         bulletsPda: this.bulletsPda.toBase58(),
        //         sessionKey: this.engine.getSessionKey().secretKey,
        //     },
        // });
    }
}

