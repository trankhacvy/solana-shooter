import Phaser from "phaser";
import constants from "../config/constants";
import Player from "../components/Player";
import SceneCamera from "../components/SceneCamera";
import WorldController from "../components/WorldController/WorldController";
import worldsConfig, { WorldConfig } from "../config/worldsConfig";
import type { ControlsType } from "../types";

export default class DemoScene extends Phaser.Scene {
    private controls!: ControlsType;
    // private player!: Player;
    private sceneCamera!: SceneCamera;
    private world!: WorldConfig;
    private worldController!: WorldController;

    public map!: Phaser.Tilemaps.Tilemap;
    private tileset!: Phaser.Tilemaps.Tileset;

    private cursors;
    private player;

    constructor() {
        super("demo");
    }

    init(): void {
        this.world = worldsConfig.HCM;

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

        // this.physics.world.setBounds(
        //     0,
        //     0,
        //     constants.LEVEL.WIDTH * constants.LEVEL.TILE_SIZE,
        //     constants.LEVEL.HEIGHT * constants.LEVEL.TILE_SIZE
        // );

        // this.worldController = new WorldController(this, this.player);
        // this.worldController.load(this.world.id);

        this.map = this.make.tilemap({
            key: "city_json",
            tileWidth: 16,
            tileHeight: 16,
        });

        this.tileset = this.map.addTilesetImage("City", "city_tiles");

        // const worldLayer = this.map.createLayer("World", this.tileset, 0, 0);
        // const belowLayer = this.map.createLayer(
        //     "Below Player",
        //     this.tileset,
        //     0,
        //     0
        // );
        const worldLayer = this.map.createLayer("City", this.tileset, 0, 0);
        // const grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        // const aboveLayer = this.map.createLayer(
        //     "Above Player",
        //     this.tileset,
        //     0,
        //     0
        // );

        // position:  779.9999999999953 1793.3333333333355
        const player = this.physics.add.sprite(180, 1794, "player");
        // player.setCollideWorldBounds(true);
        const camera = this.cameras.main;
        console.log("map ne", this.map.widthInPixels, this.map.heightInPixels);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels); // Map boundaries
        camera.startFollow(player);
        // camera.setSize(1600, 1600);

        // Setup input handling for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player = player;

        // this.data.set("player", this.player);

        // this.cameras.main.setBounds(0, 0, 2000, 2000);

        // this.sceneCamera = new SceneCamera(this, this.player);
        // this.sceneCamera.addMinimap();

        this.data.set("enemiesCount", 0);

        this.addSound();
        this.addEvents();
    }

    private addSound(): void {
        this.sound.play(this.world.music, {
            volume: 0.1,
            loop: true,
        });
    }

    private addEvents(): void {}

    update(time: number, delta: number) {
        // this.worldController.update();

        const speed = 400;
        const { cursors, player } = this;

        // Reset player velocity
        player.setVelocity(0);

        // Handle movement
        if (cursors.left.isDown) {
            player.setVelocityX(-speed);
            player.setFlipX(true); // Flip the player sprite to face left
        } else if (cursors.right.isDown) {
            player.setVelocityX(speed);
            player.setFlipX(false); // Default orientation
        }

        if (cursors.up.isDown) {
            player.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            player.setVelocityY(speed);
        }

        console.log("position: ", this.player.x, this.player.y);
    }
}

