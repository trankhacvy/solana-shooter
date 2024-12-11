import Phaser from "phaser";
import { enemyConstantsV2 } from "../../../config/enemyConstants";
import Enemy from "../EnemyV2";

const baseSettings = enemyConstantsV2.Goblin;

export default class Skeleton extends Enemy {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(
            scene,
            x,
            y,
            baseSettings.type,
            baseSettings.texture,
            baseSettings.keyFrame
        );

        this.setupConfig(baseSettings);
        this.initAnim();
    }

    initAnim() {
        ["up", "down", "left", "right"].forEach((key) => {
            this.scene.anims.create({
                key: baseSettings.type + `_${key}`,
                frames: this.scene.anims.generateFrameNumbers("SkeletonWalk", {
                    start: 0,
                    end: 7,
                }),
                frameRate: 14,
                repeat: 0,
            });
        });
    }
}

