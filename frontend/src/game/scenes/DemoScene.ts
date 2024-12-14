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

    public tilemap!: Phaser.Tilemaps.Tilemap;
    private tileset!: Phaser.Tilemaps.Tileset;

    private cursors;
    private player;

    constructor() {
        super("demo");
    }

    init(): void {}

    async create() {
        this.tilemap = this.make.tilemap({
            key: "city_json",
            tileWidth: 16,
            tileHeight: 16,
        });

        this.tileset = this.tilemap.addTilesetImage(
            "CityTileset",
            "city_tiles"
        );

        const bgLayer = this.tilemap.createLayer(
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

    private addSound(): void {
        this.sound.play(this.world.music, {
            volume: 0.1,
            loop: true,
        });
    }

    private addEvents(): void {}

    update(time: number, delta: number) {}
}

