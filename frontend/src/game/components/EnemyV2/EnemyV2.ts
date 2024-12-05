import Phaser from "phaser";
import constants from "../../config/constants";
import Actor from "../Actor";
import EnemyStateController from "./EnemyStateController";
import ItemController from "../ItemController/ItemController";
import Item from "../Item/Item";
import {
    enemyConstantsV2,
    type EnemyTypeSettingsV2,
} from "../../config/enemyConstants";
import type { EnemyTypeV2 } from "../../types/enemies";
import Player from "../Player";

export default class EnemyV2 extends Actor {
    private target!: Player;
    private stateController!: EnemyStateController;
    private enemyType: EnemyTypeV2;
    private killed = false;
    private readonly itemController: ItemController;
    private bloods: Phaser.GameObjects.Sprite[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, type: EnemyTypeV2) {
        const enemyType = enemyConstantsV2[type];

        super(scene, x, y, enemyType.texture, enemyType.keyFrame);

        this.enemyType = type;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.itemController = new ItemController(scene);

        this.addBloods();

        // const scale = 1.3;
        const scale = 1.3;
        this.setScale(scale);

        const radius = 20;
        this.setCircle(
            radius,
            -radius + (0.5 * (scale * this.width)) / this.scale,
            -radius + (0.5 * (scale * this.height)) / this.scale
        );

        this.stateController = new EnemyStateController(this);
        this.initAnim();
    }

    private addBloods(): void {
        this.createBlood(1);
        this.createBlood(2);
        this.createBlood(3);
        this.createBlood(4);
        this.createBlood(5);
    }

    private createBlood(index: number): void {
        const blood = this.scene.add
            .sprite(0, 0, "anim-blood-" + index, "1_0")
            .setScale(1.5)
            .setVisible(false);

        blood.anims.create({
            key: "dead",
            frames: this.scene.anims.generateFrameNames("anim-blood-" + index, {
                prefix: "1_",
                start: 0,
                end: 28,
            }),
            frameRate: 27,
            duration: 1000,
            repeat: 0,
        });

        this.bloods.push(blood);
    }

    public spawn(x: number, y: number): void {
        this.killed = false;
        this.enableBody(true, x, y, true, true);
        this.setCurrentHitPoints = this.getMaximumHitPoints;
        this.stateController = new EnemyStateController(this);

        this.scene.data.set(
            "enemiesCount",
            this.scene.data.get("enemiesCount") + 1
        );
    }

    private showTakenDamage(value: number, enemy: EnemyV2): void {
        if (constants.ENEMY.SHOW_FLOAT_DAMAGE && value >= 1) {
            const valueText = value.toFixed(0);
            this.scene.floatingNumbers.createFloatingText({
                textOptions: {
                    fontFamily: "Ubuntu",
                    fontSize: "34px",
                    color: "#FF003D",
                    strokeThickness: 2,
                    stroke: "#000000",
                },
                align: "top-center",
                animation: "fade",
                animationEase: "Sine.easeInOut",
                text: valueText,
                parentObject: enemy,
            });
        }
    }

    public takeDamage(value?: number): void {
        if (value && value > 0) {
            this.scene.sound.play("enemy-hit", { volume: 0.1 });
            this.showTakenDamage(value, this);
        }
    }

    private getDirectionFromAngle(radians: number) {
        const deg = Phaser.Math.RadToDeg(radians);

        if ((deg >= 0 && deg <= 45) || (deg <= 0 && deg >= -45)) {
            return "right";
        } else if (deg > 45 && deg <= 135) {
            return "up";
        } else if ((deg <= -135 && deg >= -180) || (deg > 135 && deg <= 180)) {
            return "left";
        } else if (deg > -135 && deg < -45) {
            return "down";
        } else {
            return "idle";
        }
    }

    private movementAnimate(angleRadians: number): void {
        const direction = this.getDirectionFromAngle(angleRadians);

        this.stateController.setState("idle");

        if (direction === "left") {
            this.stateController.setState("moveLeft");
        } else if (direction === "right") {
            this.stateController.setState("moveRight");
        }

        if (direction === "up") {
            this.stateController.setState("moveUp");
        } else if (direction === "down") {
            this.stateController.setState("moveDown");
        }

        if (direction === "idle") {
            this.stateController.setState("idle");
        }
    }

    public move(direction: "up" | "left" | "right" | "down" | "idle"): void {
        this.stateController.setState("idle");

        if (direction === "left") {
            this.stateController.setState("moveLeft");
        } else if (direction === "right") {
            this.stateController.setState("moveRight");
        }

        if (direction === "up") {
            this.stateController.setState("moveUp");
        } else if (direction === "down") {
            this.stateController.setState("moveDown");
        }

        if (direction === "idle") {
            this.stateController.setState("idle");
        }
    }

    private dropItem(item: Item) {
        const random = Math.random();
        if (random < constants.ENEMY.DROP_ITEM_RATE) {
            const place = new Phaser.Geom.Circle(
                this.x,
                this.y,
                this.getBody().width * 1.5
            );
            const randomPoint = place.getRandomPoint();

            item.setPosition(this.x, this.y);
            item.setScale(0);

            this.scene.add.tween({
                targets: item,
                scale: 1,
                x: randomPoint.x,
                y: randomPoint.y,
                ease: "Sine.easeInOut",
                duration: 700,
            });

            this.scene.add.existing(item);
            this.scene.physics.add.existing(item);
        }
    }

    private checkDropItem(): void {
        const randomItem = this.getItemController.getRandom();
        if (randomItem) {
            this.dropItem(randomItem);
        }
    }

    private killEnemy(): void {
        this.killed = true;
        this.stateController.setState("dead");
        this.checkDropItem();
        this.scene.events.emit(constants.EVENTS.UI.UPDATE_KILL_COUNT, this);

        this.scene.data.set(
            "enemiesCount",
            this.scene.data.get("enemiesCount") - 1
        );
    }

    public killEnemyV2(): void {
        this.killed = true;
        this.stateController.setState("dead");
    }

    private moveToTarget(): void {
        this.movementAnimate(
            Phaser.Math.Angle.Between(
                this.target.x,
                this.target.y,
                this.x,
                this.y
            )
        );
        this.scene.physics.moveTo(
            this,
            this.target.x,
            this.target.y,
            this.getSpeed
        );
    }

    // public preUpdate(time: number, delta: number): void {
    //     super.preUpdate(time, delta);

    //     if (!this.active || !this.visible || this.killed) {
    //         return;
    //     }

    //     if (this.getCurrentHitPoints <= 0) {
    //         this.killEnemy();
    //         return;
    //     }

    //     this.checkFlip();
    //     this.moveToTarget();
    // }

    protected setupConfig(config: EnemyTypeSettingsV2): void {
        // this.typeEnemy = config.type;
        this.setMaximumHitPoints = config.health;
        this.setCurrentHitPoints = config.health;
        this.setSpeed = config.speed;
        this.setBodyDamage = config.bodyDamage;
        this.setExperience = config.experience;
        this.setBodyAttackTime = config.bodyAttackTime;
        this.getItemController.setItems(config.items);
    }

    public set setTarget(target: Player) {
        this.target = target;
    }

    public get getItemController(): ItemController {
        return this.itemController;
    }

    public get getBloods(): Phaser.GameObjects.Sprite[] {
        return this.bloods;
    }

    public get getKilled(): boolean {
        return this.killed;
    }

    public get getType(): EnemyTypeV2 {
        return this.enemyType;
    }

    initAnim() {
        ["up", "down", "left", "right", "dead"].forEach((key) => {
            if (key === "dead") {
                const enemyType = enemyConstantsV2[this.getType];

                this.scene.anims.create({
                    key: this.getType + `_${key}`,
                    frames: this.scene.anims.generateFrameNumbers(
                        `${enemyType.type}Death`,
                        {
                            start: 0,
                            end: 3,
                        }
                    ),
                    frameRate: 9,
                    repeat: 0,
                });
            } else {
                this.scene.anims.create({
                    key: this.getType + `_${key}`,
                    frames: this.scene.anims.generateFrameNumbers(
                        "FlyingEyeFlight",
                        {
                            start: 0,
                            end: 7,
                        }
                    ),
                    frameRate: 14,
                    repeat: 0,
                });
            }
        });
    }
}

