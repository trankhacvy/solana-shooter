import Phaser from "phaser";
import { enemyConstantsV2 } from "../../config/enemyConstants";
import getRandomPointAround from "../../utils/getRandomPointAround";
import constants from "../../config/constants";
import type { EnemyTypeV2 } from "../../types/enemies";
import Player from "../Player";
import EnemyV2 from "./EnemyV2";
import FlyingEye from "./types/FlyingEye";
import Goblin from "./types/Goblin";
import Mushroom from "./types/Mushroom";
import Skeleton from "./types/Skeleton";
import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";
import { PublicKey } from "@solana/web3.js";
import { FindComponentPda } from "@magicblock-labs/bolt-sdk";
import {
    ENEMIES_COMPONENT_PROGRAM_ID,
    EnemiesAccount,
    getEnemiesComponentOnEphem,
} from "@/libs/programs";

export default class EnemyGroupV2 extends Phaser.Physics.Arcade.Group {
    private keyFrame = "";

    private engine: MagicBlockEngine;
    private enemiesPda!: PublicKey;
    private enemiesCmpPda: PublicKey;

    private enemies: Record<string, EnemyV2> = {};

    constructor(
        scene: Phaser.Scene,
        engine: MagicBlockEngine,
        enemiesPda: PublicKey
    ) {
        super(scene.physics.world, scene);

        this.engine = engine;
        this.enemiesPda = enemiesPda;

        this.enemiesCmpPda = FindComponentPda({
            entity: this.enemiesPda,
            componentId: ENEMIES_COMPONENT_PROGRAM_ID,
        });

        this.setDepth(10);

        this.scene.physics.add.collider(this, this);

        this.engine.subscribeToEphemAccountInfo(
            this.enemiesCmpPda,
            (accountInfo) => {
                if (!accountInfo) {
                    console.log("account not found");
                    return;
                }
                const coder = getEnemiesComponentOnEphem(this.engine).coder;
                const data = coder.accounts.decode<EnemiesAccount>(
                    "enemies",
                    accountInfo.data
                );
                if (data) {
                    this.updateEnemies(data);
                }
            }
        );
    }

    public update(time: number, delta: number): void {
        for (const enemy of this.getMatching("active", true)) {
            const enemyActor = enemy as EnemyV2;
            enemyActor.update(time, delta);
        }
    }

    private updateEnemies(data: EnemiesAccount) {
        const enemies = data.enemies;
        const enemyIds = enemies.map((bullet) => String(bullet.id));

        Object.keys(this.enemies).map((key) => {
            if (enemyIds.includes(key)) {
                this.enemies[key].killEnemyV2();
            }
        });

        enemies.forEach((enemy) => {
            if (this.enemies[enemy.id]) {
                // this.enemies[enemy.id].setData("serverX", enemy.x);
                // this.enemies[enemy.id].setData("serverY", enemy.y);
                // this.enemies[enemy.id].setData("hp", enemy.hp);
                // this.enemies[enemy.id].setData("active", enemy.active);
                this.enemies[enemy.id].x = enemy.x;
                this.enemies[enemy.id].y = enemy.y;
            } else {
                const enemyObj = new EnemyV2(
                    this.scene,
                    enemy.x,
                    enemy.y,
                    enemyConstantsV2.Skeleton.texture,
                    enemyConstantsV2.Skeleton.keyFrame
                );

                this.enemies[String(enemy.id)] = enemyObj;
            }
        });
    }

    private setupEnemy(type: EnemyTypeV2): void {
        switch (type) {
            case enemyConstantsV2.FlyingEye.type:
                this.classType = FlyingEye;
                this.keyFrame = enemyConstantsV2.FlyingEye.keyFrame;
                break;
            case enemyConstantsV2.Goblin.type:
                this.classType = Goblin;
                this.keyFrame = enemyConstantsV2.Goblin.keyFrame;
                break;
            case enemyConstantsV2.Mushroom.type:
                this.classType = Mushroom;
                this.keyFrame = enemyConstantsV2.Mushroom.keyFrame;
                break;
            case enemyConstantsV2.Skeleton.type:
                this.classType = Skeleton;
                this.keyFrame = enemyConstantsV2.Skeleton.keyFrame;
                break;
        }
    }
}

