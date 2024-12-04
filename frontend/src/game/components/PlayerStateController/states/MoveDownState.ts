import Player from "../../Player";

export default class MoveDownState {
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    enter() {
        !this.player.anims.isPlaying &&
            this.player.anims.play(this.player.getCurrentType + "_down", true);

        this.player.moveDown();
        // this.player.setVelocityY(this.player.getSpeed);
        console.log("this.player.getSpeed", this.player.getSpeed);
        this.player.y += this.player.getSpeed;
    }
}

