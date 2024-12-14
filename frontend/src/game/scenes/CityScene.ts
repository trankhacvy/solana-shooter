import Phaser from "phaser";
import constants from "../config/constants";
import AnimationsController from "../components/AnimationsController";

export default class DemoScene extends Phaser.Scene {
    private playerType: string = constants.PLAYER.DEFAULT.TYPE;
    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private animationController: AnimationsController;

    private bankZone: Phaser.GameObjects.Zone;
    private touchBankZone = false;
    private marketplaceZone: Phaser.GameObjects.Zone;
    private touchmarketplaceZone = false;
    private gameStationZone: Phaser.GameObjects.Zone;
    private touchGameStationZone = false;

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

        this.initMap();

        this.addPlayer();

        // this.physics.add.collider(this.player, cityLayer);

        const camera = this.cameras.main;
        camera.setBounds(
            0,
            0,
            this.tilemap.widthInPixels,
            this.tilemap.heightInPixels
        );
        camera.setZoom(3);
        camera.startFollow(this.player, true, 0.1, 0.1);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.addBank();
        this.addMarketplace();
        this.addGameStation();
        this.addSound();
        this.addEvents();
    }

    private initMap(): void {
        this.tilemap = this.make.tilemap({
            key: "city_json",
            tileWidth: 16,
            tileHeight: 16,
        });

        this.tileset = this.tilemap.addTilesetImage(
            "CityTileset",
            "city_tiles"
        );

        const cityLayer = this.tilemap.createLayer(
            "Background",
            this.tileset,
            0,
            0
        );
        this.tilemap.createLayer("Background_decorator", this.tileset, 0, 0);
        this.tilemap.createLayer("Buildings", this.tileset, 0, 0);
        this.tilemap.createLayer("Cars", this.tileset, 0, 0);
        this.tilemap.createLayer("Objects", this.tileset, 0, 0);
    }

    private addPlayer(): void {
        const interactiveObjectsLayer = this.tilemap.getObjectLayer("Objects");
        const playerSpawnPoint = interactiveObjectsLayer.objects.find(
            (obj) => obj.name === "Player"
        );

        this.player = this.physics.add.sprite(
            playerSpawnPoint.x,
            playerSpawnPoint.y,
            this.playerType,
            constants.PLAYER.DEFAULT.FRAME
        );
        this.player.setScale(0.15);
        this.player.setCollideWorldBounds(true);

        this.animationController = new AnimationsController(this, this.player);
        this.animationController.addAnimations(this.playerType, 14, {
            repeat: 0,
        });
    }

    private addBank(): void {
        // bank
        const bankObject = this.tilemap
            .getObjectLayer("Objects")
            .objects.find((obj) => obj.name === "Bank");

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
        textBoxBackground.fillRoundedRect(0, 0, bankObject.width, 32, 10);

        const textBoxText = this.add.text(8, 8, "Press B", {
            fontSize: "16px",
            color: "#ffffff",
        });

        const tooltip = this.add.container(bankObject.x, bankObject.y - 40, [
            textBoxBackground,
            textBoxText,
        ]);

        tooltip.setVisible(false);

        this.physics.world.enable(this.bankZone);
        this.player.on("overlapstart", function () {
            if (!tooltip.visible) {
                tooltip.setVisible(true);
            }
        });
        this.player.on("overlapend", function () {
            tooltip.setVisible(false);
        });

        this.physics.add.overlap(this.player, this.bankZone, () => {
            this.touchBankZone = true;

            const spaceKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            );

            spaceKey.on("down", () => {
                this.scene.launch(constants.SCENES.STAKE_UNSTAKE);
            });
        });
    }

    private addMarketplace(): void {
        const shopObject = this.tilemap
            .getObjectLayer("Objects")
            .objects.find((obj) => obj.name === "Shop");

        this.marketplaceZone = this.add
            .zone(
                shopObject.x,
                shopObject.y,
                shopObject.width,
                shopObject.height
            )
            .setOrigin(0)
            .setInteractive()
            .setName("shop");

        const textBoxBackground = this.add.graphics();
        textBoxBackground.fillStyle(0x000000, 0.8);
        textBoxBackground.fillRoundedRect(0, 0, shopObject.width + 64, 32, 10);

        const textBoxText = this.add.text(8, 8, "Press Space", {
            fontSize: "16px",
            color: "#ffffff",
        });

        const tooltip = this.add.container(shopObject.x, shopObject.y - 40, [
            textBoxBackground,
            textBoxText,
        ]);

        tooltip.setVisible(false);

        this.physics.world.enable(this.marketplaceZone);
        this.player.on("overlapMarketplaceStart", function () {
            if (!tooltip.visible) {
                tooltip.setVisible(true);
            }
        });
        this.player.on("overlapMarketplaceEnd", function () {
            tooltip.setVisible(false);
        });

        this.physics.add.overlap(
            this.player,
            this.marketplaceZone,
            () => {
                this.touchmarketplaceZone = true;

                const spaceKey = this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.SPACE
                );

                spaceKey.on("down", () => {
                    this.scene.start(constants.SCENES.MAP_SELECT);
                });
            },
            (player: Phaser.Physics.Arcade.Sprite, _zone) => {
                return player;
            },
            this
        );
    }

    private addGameStation(): void {
        // bank
        const bankObject = this.tilemap
            .getObjectLayer("Objects")
            .objects.find((obj) => obj.name === "GameStation");

        this.gameStationZone = this.add
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
        textBoxBackground.fillRoundedRect(0, 0, bankObject.width + 64, 32, 10);

        const textBoxText = this.add.text(8, 8, "Press Space", {
            fontSize: "16px",
            color: "#ffffff",
        });

        // Combine the background and text into a container
        const tooltip = this.add.container(bankObject.x, bankObject.y - 32, [
            textBoxBackground,
            textBoxText,
        ]);

        tooltip.setVisible(false);

        this.physics.world.enable(this.gameStationZone);
        this.player.on("overlapGameStationStart", function () {
            if (!tooltip.visible) {
                tooltip.setVisible(true);
            }
        });
        this.player.on("overlapGameStationEnd", function () {
            tooltip.setVisible(false);
        });

        this.physics.add.overlap(
            this.player,
            this.gameStationZone,
            () => {
                this.touchGameStationZone = true;

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

        // bank
        if (this.touchBankZone) {
            this.player.emit("overlapstart");
            this.touchBankZone = false;
        } else {
            this.player.emit("overlapend");
        }

        // shop
        if (this.touchmarketplaceZone) {
            this.player.emit("overlapMarketplaceStart");
            this.touchmarketplaceZone = false;
        } else {
            this.player.emit("overlapMarketplaceEnd");
        }

        // game
        if (this.touchGameStationZone) {
            this.player.emit("overlapGameStationStart");
            this.touchGameStationZone = false;
        } else {
            this.player.emit("overlapGameStationEnd");
        }
    }
}

