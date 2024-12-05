import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";
import { PublicKey } from "@solana/web3.js";
import EnemyV2 from "./EnemyV2";
import { FindComponentPda } from "@magicblock-labs/bolt-sdk";
import {
    ENEMIES_COMPONENT_PROGRAM_ID,
    EnemiesAccount,
    getEnemiesComponentOnEphem,
} from "@/libs/programs";

export default class EnemyController {
    private scene: Phaser.Scene;
    private engine: MagicBlockEngine;
    private enemiesPda!: PublicKey;
    private enemiesCmpPda: PublicKey;

    private enemies: Record<string, EnemyV2> = {};

    constructor(
        scene: Phaser.Scene,
        engine: MagicBlockEngine,
        enemiesPda: PublicKey
    ) {
        this.scene = scene;
        this.engine = engine;
        this.enemiesPda = enemiesPda;

        this.enemiesCmpPda = FindComponentPda({
            entity: this.enemiesPda,
            componentId: ENEMIES_COMPONENT_PROGRAM_ID,
        });

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

    private updateEnemies(data: EnemiesAccount) {
        const enemies = data.enemies;
        const enemyIds = enemies.map((bullet) => String(bullet.id));

        console.log(
            "enemies",
            enemies.length,
            Object.keys(this.enemies).length
        );

        Object.keys(this.enemies).map((key) => {
            if (!enemyIds.includes(key)) {
                this.enemies[key].killEnemyV2();
                delete this.enemies[key];
            }
        });

        enemies.forEach((enemy) => {
            if (this.enemies[enemy.id]) {
                this.enemies[enemy.id].setData("serverX", enemy.x);
                this.enemies[enemy.id].setData("serverY", enemy.y);
                this.enemies[enemy.id].setData("serverHp", enemy.hp);
                this.enemies[enemy.id].setData("active", enemy.active);
            } else {
                const enemyObj = new EnemyV2(
                    this.scene,
                    enemy.x,
                    enemy.y,
                    "Skeleton"
                );
                enemyObj.setName(`enemy_${enemy.id}`);

                enemyObj.setCurrentHitPoints = enemy.hp;

                enemyObj.setData("previousX", enemy.x);
                enemyObj.setData("previousY", enemy.y);
                enemyObj.setData("previousHp", enemy.hp);

                this.enemies[String(enemy.id)] = enemyObj;
            }
        });
    }

    update() {
        Object.values(this.enemies).forEach((enemy) => {
            const serverX = enemy.getData("serverX");
            const serverY = enemy.getData("serverY");
            const serverHp = enemy.getData("serverHp");

            if (serverX != null && serverY != null) {
                const previousX = enemy.x;
                const previousY = enemy.y;
                const previousHp = enemy.getCurrentHitPoints;

                enemy.x = Phaser.Math.Linear(enemy.x, serverX, 0.2);
                enemy.y = Phaser.Math.Linear(enemy.y, serverY, 0.2);
                enemy.setCurrentHitPoints = serverHp;

                // Determine movement direction
                const dx = enemy.x - previousX;
                const dy = enemy.y - previousY;

                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) {
                        enemy.move("right");
                    } else {
                        enemy.move("left");
                    }
                } else if (Math.abs(dy) > Math.abs(dx)) {
                    if (dy > 0) {
                        enemy.move("down");
                    } else {
                        enemy.move("up");
                    }
                } else {
                    enemy.move("idle");
                }

                if (previousHp > serverHp) {
                    enemy.takeDamage(previousHp - serverHp);
                }

                // Update previous position for the next tick
                enemy.setData("previousX", enemy.x);
                enemy.setData("previousY", enemy.y);
                enemy.setData("previousHp", enemy.getCurrentHitPoints);
            }
        });
    }
}

