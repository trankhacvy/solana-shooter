import Enemy from "./EnemyV2";

export class IdleState {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    enter() {
        !this.enemy.anims.isPlaying &&
            this.enemy.setFrame(this.enemy.getType + "_down_1");
    }
}

export class DeadState {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    enter() {
        const bloods = this.enemy.getBloods;

        const randomIndex = Math.floor(Math.random() * bloods.length);
        const blood = bloods[randomIndex];
        blood.setVisible(true);
        blood.setPosition(this.enemy.x, this.enemy.y);
        blood.play("dead").on("animationcomplete", () => {
            blood.setVisible(false);
        });
        this.enemy.anims.play(this.enemy.getType + "_dead", true);
    }
}

export class MoveDownState {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    enter() {
        this.enemy.anims.play(this.enemy.getType + "_down", true);
    }
}

export class MoveLeftState {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    enter() {
        this.enemy.anims.play(this.enemy.getType + "_left", true);
        // this.enemy.checkFlip();
    }
}

export class MoveRightState {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    enter() {
        this.enemy.anims.play(this.enemy.getType + "_right", true);
        this.enemy.checkFlip();
    }
}

export class MoveUpState {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    enter() {
        this.enemy.anims.play(this.enemy.getType + "_up", true);
    }
}

