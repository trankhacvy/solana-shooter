import Phaser from "phaser";
import constants from "../config/constants";
import AnimationsController from "../components/AnimationsController";

export default class DemoScene extends Phaser.Scene {
    private playerType: string = constants.PLAYER.DEFAULT.TYPE;
    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private animationController: AnimationsController;

    private bankZone: Phaser.GameObjects.Zone;

    private tilemap: Phaser.Tilemaps.Tilemap;
    private tileset!: Phaser.Tilemaps.Tileset;

    constructor() {
        super(constants.SCENES.CITY);
    }

    init(): void {}

    create() {
        this.physics.world.setBounds(
            0,
            0,
            constants.LEVEL.WIDTH * constants.LEVEL.TILE_SIZE,
            constants.LEVEL.HEIGHT * constants.LEVEL.TILE_SIZE
        );

        this.tilemap = this.make.tilemap({
            key: "city_json",
            tileWidth: 16,
            tileHeight: 16,
        });

        this.tileset = this.tilemap.addTilesetImage("City", "city_tiles");

        const cityLayer = this.tilemap.createLayer("City", this.tileset, 0, 0);
        cityLayer.setCollisionByProperty({ collidable: true });

        // const tileLayer = this.tilemap.createLayer('Tile Layer Name', this.tileset, 0, 0);

        this.addPlayer();

        this.physics.add.collider(this.player, cityLayer);

        const camera = this.cameras.main;
        camera.setBounds(
            0,
            0,
            this.tilemap.widthInPixels,
            this.tilemap.heightInPixels
        );
        camera.setZoom(2);
        camera.startFollow(this.player, true, 0.1, 0.1);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.addBank();
        this.addTrunks();
        this.addSound();
        this.addEvents();
    }

    private addPlayer(): void {
        const interactiveObjectsLayer =
            this.tilemap.getObjectLayer("InteractiveObjects");
        const playerSpawnPoint = interactiveObjectsLayer.objects.find(
            (obj) => obj.name === "Player"
        );

        this.player = this.physics.add.sprite(
            playerSpawnPoint.x,
            playerSpawnPoint.y,
            this.playerType,
            constants.PLAYER.DEFAULT.FRAME
        );
        this.player.setScale(0.3);
        this.player.setCollideWorldBounds(true);

        this.animationController = new AnimationsController(this, this.player);
        this.animationController.addAnimations(this.playerType, 14, {
            repeat: 0,
        });
    }

    private addBank(): void {
        // bank
        const bankObject = this.tilemap
            .getObjectLayer("InteractiveObjects")
            .objects.find((obj) => obj.name === "bank");

        this.bankZone = this.add
            .zone(
                bankObject.x,
                bankObject.y,
                bankObject.width,
                bankObject.height
            )
            .setOrigin(0)
            .setInteractive()
            .setName("bank");

        const textBoxBackground = this.add.graphics();
        textBoxBackground.fillStyle(0x000000, 0.8);
        textBoxBackground.fillRoundedRect(
            0,
            0,
            bankObject.width * 4 + 16,
            50,
            10
        );

        const textBoxText = this.add.text(
            8,
            8,
            "Press the Space key\n to start the game.",
            {
                fontSize: "16px",
                color: "#ffffff",
            }
        );

        // Combine the background and text into a container
        const tooltip = this.add.container(
            bankObject.x - bankObject.width * 2 + 16,
            bankObject.y - 60,
            [textBoxBackground, textBoxText]
        );

        tooltip.setVisible(false);

        this.physics.world.enable(this.bankZone);
        this.physics.add.overlap(
            this.player,
            this.bankZone,
            () => {
                if (!tooltip.visible) {
                    tooltip.setVisible(true);
                }

                const spaceKey = this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.SPACE
                );

                spaceKey.on("down", () => {
                    this.scene.start(constants.SCENES.MAP_SELECT);
                });
            },
            (player: Phaser.Physics.Arcade.Sprite, zone) => {
                return player;
            },
            this
        );
    }

    private addTrunks(): void {}

    private addSound(): void {
        // this.sound.play("main-theme", {
        //     volume: 0.1,
        //     loop: true,
        // });
    }

    private addEvents(): void {}

    update(_time: number, _delta: number) {
        const speed = 400;
        const { cursors, player } = this;

        player.setVelocity(0);

        if (cursors.left.isDown) {
            this.player.anims.play(this.playerType + "_left", true);
            player.setVelocityX(-speed);
            player.setFlipX(false);
        } else if (cursors.right.isDown) {
            this.player.anims.play(this.playerType + "_right", true);
            player.setVelocityX(speed);
            player.setFlipX(true);
        }

        if (cursors.up.isDown) {
            player.setVelocityY(-speed);
            this.player.anims.play(this.playerType + "_up", true);
        } else if (cursors.down.isDown) {
            this.player.anims.play(this.playerType + "_down", true);
            player.setVelocityY(speed);
        }
    }
}

