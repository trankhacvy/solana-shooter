import Phaser from "phaser";
import constants from "../config/constants";
import PlayerStateController from "./PlayerStateController/PlayerStateController";
import AnimationsController from "./AnimationsController";
import Actor from "./Actor";
import PlayerInputController from "./PlayerInputController/PlayerInputController";
import Weapon from "./Weapon/Weapon";
import Enemy from "./EnemyController/Enemy";
import EnemyGroup from "./EnemyController/EnemyGroup";
import PlayerLevelController from "./PlayerLevelController/PlayerLevelController";
import PlayerTypeController from "./PlayerTypeController/PlayerTypeController";
import HealthBar from "./ProgressBar/HealthBar";
import type { PlayerNameType } from "../types/players";
import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";
import { MagicBlockQueue } from "@/libs/engine/magic-block-queue";
import { applyCommandSystem } from "@/libs/connection";
import { PublicKey } from "@solana/web3.js";
import { FindComponentPda } from "@magicblock-labs/bolt-sdk";
import {
    getPlayerComponentOnEphem,
    PLAYER_COMPONENT_PROGRAM_ID,
    PlayerAccount,
} from "@/libs/programs";

export default class Player extends Actor {
    public stateController: PlayerStateController;

    protected gold = 0;
    protected skillUpPoints = 0;
    protected upgradePoints = 0;
    protected regeneration = 0;
    protected attackRate = 0;
    protected bulletSpeed = 0;
    protected bulletDamage = 0;

    private animationsController: AnimationsController;
    private inputController: PlayerInputController;
    private typeController: PlayerTypeController;
    private levelController: PlayerLevelController;

    private playerContainer: Phaser.GameObjects.Container;
    private healthBar: HealthBar;
    private currentType!: PlayerNameType;
    private experienceRequired!: number;
    private weapon: Weapon;
    private closestEnemy: Enemy | null = null;
    private lastFired = 0;
    private lastRegeneration = 0;
    private radiusAttack!: Phaser.Geom.Circle;

    private engine!: MagicBlockEngine;
    private mapPda: PublicKey;
    private playerPda: PublicKey;
    private playerCmpPda: PublicKey;
    private queue!: MagicBlockQueue;

    private playerRef: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        engine: MagicBlockEngine,
        mapPda: PublicKey,
        playerPda: PublicKey,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.playerContainer = this.scene.add.container(this.x, this.y);
        this.playerContainer.setDepth(10);
        this.scene.add.existing(this.playerContainer);

        this.setExperienceRequired = constants.PLAYER.LEVEL_RATE.DEFAULT;

        this.radiusAttack = new Phaser.Geom.Circle(
            this.x,
            this.y,
            constants.PLAYER.DEFAULT.RADIUS_ATTACK
        );

        this.animationsController = new AnimationsController(scene, this);

        this.stateController = new PlayerStateController(this);

        this.inputController = new PlayerInputController(scene, this);
        this.inputController.addJoystick(
            scene.scene.get(constants.SCENES.GAME_UI)
        );

        this.levelController = new PlayerLevelController(
            this.scene.scene.get(constants.SCENES.GAME_UI),
            this
        );

        this.weapon = new Weapon(scene, constants.PLAYER.DEFAULT.WEAPON);

        this.typeController = new PlayerTypeController(this, "main");

        this.chooseType(this.typeController.getNameType);
        this.setCurrentHitPoints = this.getMaximumHitPoints;
        this.setBodyAttackTime = constants.PLAYER.DEFAULT.BODY_ATTACK_TIME;

        this.getBody().setCollideWorldBounds(true);

        const scale = 0.6;
        this.setScale(scale);

        const radius = 50;
        this.setCircle(
            radius,
            -radius + (0.5 * (scale * this.width)) / this.scale,
            -radius + (0.5 * (scale * this.height)) / this.scale
        );

        this.setDepth(10);
        this.setCollideWorldBounds(true);

        this.healthBar = new HealthBar(
            this.scene,
            this.x - constants.HEALTH_BAR.WIDTH / 2 - 5,
            this.y + 60
        );

        this.engine = engine;
        this.queue = new MagicBlockQueue(engine);
        this.mapPda = mapPda;
        this.playerPda = playerPda;
        this.playerCmpPda = FindComponentPda({
            entity: this.playerPda,
            componentId: PLAYER_COMPONENT_PROGRAM_ID,
        });

        // for debug
        this.playerRef = this.scene.add.rectangle(
            x,
            y,
            this.width,
            this.height
        );
        this.playerRef.setStrokeStyle(1, 0xff00ff);
        this.playerRef.setDepth(8);
        // this.playerRef.setVisible(false);

        this.listenPlayer();
    }

    public takeDamage(value?: number) {
        this.scene.sound.play("player-hit", { volume: 0.1 });
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.6,
            onRepeat: () => {
                this.setTint(Phaser.Display.Color.GetColor(255, 150, 150));
            },
            onStart: () => {
                if (value) {
                    this.reduceHealth(value);
                    this.takeDamageFloatingText(value);
                }
            },
            onComplete: () => {
                this.clearTint();
                this.setAlpha(1);
            },
        });
    }

    private takeDamageFloatingText(value: number) {
        const valueText = value.toFixed(0);
        this.scene.floatingNumbers.createFloatingText({
            textOptions: {
                fontFamily: "Ubuntu",
                fontSize: "34px",
                color: "#E23C4B",
                strokeThickness: 2,
                stroke: "#000000",
            },
            align: "top-center",
            animation: "fade",
            animationEase: "Sine.easeInOut",
            text: `-${valueText}`,
            parentObject: this,
        });
    }

    public addExperience(value: number) {
        this.experience += value;

        this.scene.events.emit(
            constants.EVENTS.UI.UPDATE_EXP_LEVEL,
            this.getExperience,
            this.getExperienceRequired
        );
    }

    public addLevel(value: number) {
        this.level += value;
        this.experience = 0;

        this.scene.events.emit(
            constants.EVENTS.UI.UPDATE_PLAYER_LEVEL,
            this.getLevel.toString()
        );

        this.scene.events.emit(
            constants.EVENTS.UI.UPDATE_EXP_LEVEL,
            this.getExperience,
            this.getExperienceRequired
        );
    }

    public addGold(value: number): void {
        this.gold += value;
        this.goldFloatingText(value);
        this.scene.events.emit(constants.EVENTS.UI.UPDATE_MONEY, value);
    }

    private goldFloatingText(value: number) {
        const valueText = value.toFixed(0);
        this.scene.floatingNumbers.createFloatingText({
            textOptions: {
                fontFamily: "Ubuntu",
                fontSize: "34px",
                color: "#0E68C3",
                strokeThickness: 2,
                stroke: "#000000",
            },
            align: "top-center",
            animation: "fade",
            animationEase: "Sine.easeInOut",
            text: `+${valueText}`,
            parentObject: this,
        });
    }

    public addSkillUpPoints(value: number) {
        this.skillUpPoints += value;
    }

    public addUpgradePoints(value: number) {
        this.upgradePoints += value;
    }

    public addCurrentHitPoints(value: number) {
        this.currentHitPoints += value;
    }

    public chooseType(playerType: PlayerNameType) {
        this.typeController.chooseType(playerType);

        this.setCurrentType = playerType;
        this.animationsController.addAnimations(playerType, 7, {
            repeat: 0,
        });
        this.weapon.chooseWeapon(this.typeController.getWeapon);

        this.levelController.rebuildSkills();
    }

    public getFlatEnemies(enemies: EnemyGroup[]): Enemy[] {
        const flatEnemies = [];

        for (const enemyGroup of enemies) {
            flatEnemies.push(...enemyGroup.getMatching("active", true));
        }

        return flatEnemies as Enemy[];
    }

    public findClosestEnemy(allEnemies: EnemyGroup[]): Enemy | null {
        const enemies = this.getFlatEnemies(allEnemies);
        const closestObject = this.scene.physics.closest(this, enemies) || null;
        const closestEnemy = closestObject as Enemy | null;
        return closestEnemy || null;
    }

    private getLastAttack(time: number): number {
        const second = 1000;
        const weaponRate = this.weapon.attackRate;
        const playerRate = this.getAttackRate;
        const baseRate = constants.PLAYER.DEFAULT.ATTACK_RATE;

        const attackRate = 1 / (weaponRate / (playerRate / baseRate));

        return second / attackRate + time;
    }

    private checkAttack(time: number) {
        if (this.weapon && time > this.lastFired) {
            this.weapon.attack();
            this.lastFired = this.getLastAttack(time);
        }
    }

    private checkRegeneration(time: number) {
        if (
            this.getCurrentHitPoints < this.getMaximumHitPoints &&
            time > this.lastRegeneration
        ) {
            this.addCurrentHitPoints(this.getRegeneration);
            this.lastRegeneration =
                time + constants.PLAYER.DEFAULT.REGENERATION_TIME;
        }
    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        if (!this.active) {
            return;
        }

        if (this.getCurrentHitPoints <= 0) {
            this.scene.events.emit(constants.EVENTS.GAME.GAME_OVER);
            return;
        }

        // this.levelController.update();
        this.inputController.update();

        this.radiusAttack.setPosition(this.x, this.y);

        this.checkAttack(time);
        this.checkRegeneration(time);

        this.healthBar.setPosition(
            this.x - constants.HEALTH_BAR.WIDTH / 2 - 5,
            this.y + 60
        );

        this.healthBar.animateToFill(
            this.getCurrentHitPoints / this.getMaximumHitPoints
        );
    }

    private listenPlayer() {
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
                    this.playerRef.x = data.x;
                    this.playerRef.y = data.y;

                    this.updatePlayerData(data);
                }
            }
        );
    }

    private updatePlayerData(data: PlayerAccount) {
        // update
        this.healthBar.animateToFill(data.hp / data.maxHp);

        // exp
        console.log("exp: ", this.experience, data.experience);
        if (data.requiredExperience !== this.experienceRequired) {
            this.setExperienceRequired = data.requiredExperience;
        }

        if (data.experience !== this.experience) {
            this.setExperience = data.experience;

            this.scene.events.emit(
                constants.EVENTS.UI.UPDATE_EXP_LEVEL,
                this.getExperience,
                this.getExperienceRequired
            );
        }

        // level
        console.log("level", this.level, data.level);
        this.level = data.level;
        if (this.level === 0) {
            this.level = data.level;
        } else if (this.level !== data.level) {
            this.level = data.level;
            this.experience = 0;

            this.scene.events.emit(
                constants.EVENTS.UI.UPDATE_PLAYER_LEVEL,
                this.getLevel.toString()
            );

            this.scene.events.emit(
                constants.EVENTS.UI.UPDATE_EXP_LEVEL,
                this.getExperience,
                this.getExperienceRequired
            );
        }
    }

    public moveLeft() {
        this.move({ dx: -1, dy: 0 });

        // applyCommandSystem(
        //     this.engine,
        //     this.queue,
        //     this.mapPda,
        //     this.playerPda,
        //     {
        //         command: {
        //             Move: { dx: -1, dy: 0 },
        //         },
        //     }
        // );
    }

    public moveRight() {
        this.move({ dx: 1, dy: 0 });

        // applyCommandSystem(
        //     this.engine,
        //     this.queue,
        //     this.mapPda,
        //     this.playerPda,
        //     {
        //         command: {
        //             Move: { dx: 1, dy: 0 },
        //         },
        //     }
        // );
    }

    public moveUp() {
        this.move({ dx: 0, dy: -1 });

        // applyCommandSystem(
        //     this.engine,
        //     this.queue,
        //     this.mapPda,
        //     this.playerPda,
        //     {
        //         command: {
        //             Move: { dx: 0, dy: -1 },
        //         },
        //     }
        // );
    }

    public moveDown() {
        this.move({ dx: 0, dy: 1 });

        // applyCommandSystem(
        //     this.engine,
        //     this.queue,
        //     this.mapPda,
        //     this.playerPda,
        //     {
        //         command: {
        //             Move: { dx: 0, dy: 1 },
        //         },
        //     }
        // );
    }

    private move(arg: { dx: number; dy: number }): void {
        applyCommandSystem(
            this.engine,
            this.queue,
            this.mapPda,
            this.playerPda,
            {
                command: {
                    Move: arg,
                },
            }
        );
    }

    public set setGold(value: number) {
        this.gold = value;
    }

    public get getGold() {
        return this.gold;
    }

    public set setSkillUpPoints(value: number) {
        this.skillUpPoints = value;
    }

    public get getSkillUpPoints() {
        return this.skillUpPoints;
    }

    public set setUpgradePoints(value: number) {
        this.upgradePoints = value;
    }

    public get getUpgradePoints() {
        return this.upgradePoints;
    }

    public set setCurrentType(type: PlayerNameType) {
        this.currentType = type;
    }

    public get getCurrentType() {
        return this.currentType;
    }

    public get getWeapon() {
        return this.weapon;
    }

    public set setAttackRate(value: number) {
        this.attackRate = value;
    }

    public get getAttackRate() {
        return this.attackRate;
    }

    public set setBulletSpeed(value: number) {
        this.bulletSpeed = value;
    }

    public get getBulletSpeed() {
        return this.bulletSpeed;
    }

    public set setBulletDamage(value: number) {
        this.bulletDamage = value;
    }

    public get getBulletDamage() {
        return this.bulletDamage;
    }

    public set setClosestEnemy(enemy: Enemy | null) {
        this.closestEnemy = enemy;
    }

    public get getClosestEnemy() {
        return this.closestEnemy;
    }

    public set setExperienceRequired(value: number) {
        this.experienceRequired = value;
    }

    public get getExperienceRequired() {
        return this.experienceRequired;
    }

    public set setRegeneration(value: number) {
        this.regeneration = value;
    }

    public get getRegeneration() {
        return this.regeneration;
    }

    public get getTypeController() {
        return this.typeController;
    }

    public get getRadiusAttack() {
        return this.radiusAttack;
    }
}

