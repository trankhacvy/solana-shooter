import Phaser from "phaser";
import { enemyConstantsV2 } from "../../../config/enemyConstants";
import Enemy from "../EnemyV2";

const baseSettings = enemyConstantsV2.FlyingEye;

export default class FlyingEye extends Enemy {
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
        this.setScale(1.5);
        // new AnimationsController(scene, this).addAnimations(baseSettings.type)
        this.initAnim();
    }

    initAnim() {
        ["up", "down", "left", "right"].forEach((key) => {
            this.scene.anims.create({
                key: baseSettings.type + `_${key}`,
                frames: this.scene.anims.generateFrameNumbers(
                    "FlyingEyeFlight",
                    {
                        start: 0,
                        end: 7,
                    }
                ),
                frameRate: 21,
                repeat: -1,
            });
        });
    }
}

