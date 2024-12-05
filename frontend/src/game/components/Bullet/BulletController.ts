import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";
import { PublicKey } from "@solana/web3.js";
import Bullet from "./Bullet";
import { FindComponentPda } from "@magicblock-labs/bolt-sdk";
import {
    BULLETS_COMPONENT_PROGRAM_ID,
    BulletsAccount,
    getBulletsComponentOnEphem,
} from "@/libs/programs";
import constants from "@/game/config/constants";
import weaponConstants from "@/game/config/weaponConstants";
import Player from "../Player";

export default class BulletsController {
    private scene: Phaser.Scene;
    private engine: MagicBlockEngine;
    private bulletsPda!: PublicKey;
    private bulletsCmpPda: PublicKey;
    private player: Player;

    private bullets: Record<string, Bullet> = {};

    constructor(
        scene: Phaser.Scene,
        engine: MagicBlockEngine,
        bulletsPda: PublicKey,
        player: Player
    ) {
        this.scene = scene;
        this.engine = engine;
        this.bulletsPda = bulletsPda;
        this.player = player;

        this.bulletsCmpPda = FindComponentPda({
            entity: this.bulletsPda,
            componentId: BULLETS_COMPONENT_PROGRAM_ID,
        });

        this.engine.subscribeToEphemAccountInfo(
            this.bulletsCmpPda,
            (accountInfo) => {
                if (!accountInfo) {
                    console.log("account not found");
                    return;
                }
                const coder = getBulletsComponentOnEphem(this.engine).coder;
                const data = coder.accounts.decode<BulletsAccount>(
                    "bullets",
                    accountInfo.data
                );
                if (data) {
                    this.updateBullets(data);
                }
            }
        );
    }

    private updateBullets(data: BulletsAccount) {
        const bullets = data.bulelts;
        const enemyIds = bullets.map((bullet) => String(bullet.id));

        console.log(
            "bullets",
            bullets.length,
            Object.keys(this.bullets).length
        );

        Object.keys(this.bullets).map((key) => {
            if (!enemyIds.includes(key)) {
                // this.enemies[key].killEnemyV2();
                delete this.bullets[key];
            }
        });

        bullets.forEach((bulletData) => {
            if (this.bullets[bulletData.id]) {
                this.bullets[bulletData.id].setData("serverX", bulletData.x);
                this.bullets[bulletData.id].setData("serverY", bulletData.y);
            } else {
                const enemy = this.scene.children.getByName(
                    `enemy_${bulletData.enemyId}`
                );

                const bullet = new Bullet(
                    this.scene,
                    bulletData.x,
                    bulletData.y,
                    constants.BULLETS.TEXTURE,
                    weaponConstants.Shuriken1.frameKey
                );

                if (enemy) {
                    bullet.fire1(this.player, enemy as any);
                }

                bullet.setData("previousX", bulletData.x);
                bullet.setData("previousY", bulletData.y);

                this.bullets[String(bulletData.id)] = bullet;
            }
        });
    }

    update() {
        // Object.values(this.bullets).forEach((bullet) => {
        //     const serverX = bullet.getData("serverX");
        //     const serverY = bullet.getData("serverY");
        //     // const serverHp = enemy.getData("serverHp");
        //     if (serverX != null && serverY != null) {
        //         // const previousX = enemy.x;
        //         // const previousY = enemy.y;
        //         // const previousHp = enemy.getCurrentHitPoints;
        //         bullet.x = Phaser.Math.Linear(bullet.x, serverX, 0.2);
        //         bullet.y = Phaser.Math.Linear(bullet.y, serverY, 0.2);
        //         // Determine movement direction
        //         // const dx = enemy.x - previousX;
        //         // const dy = enemy.y - previousY;
        //         // if (Math.abs(dx) > Math.abs(dy)) {
        //         //     if (dx > 0) {
        //         //         enemy.move("right");
        //         //     } else {
        //         //         enemy.move("left");
        //         //     }
        //         // } else if (Math.abs(dy) > Math.abs(dx)) {
        //         //     if (dy > 0) {
        //         //         enemy.move("down");
        //         //     } else {
        //         //         enemy.move("up");
        //         //     }
        //         // } else {
        //         //     enemy.move("idle");
        //         // }
        //         // Update previous position for the next tick
        //         bullet.setData("previousX", bullet.x);
        //         bullet.setData("previousY", bullet.y);
        //     }
        // });
    }
}

