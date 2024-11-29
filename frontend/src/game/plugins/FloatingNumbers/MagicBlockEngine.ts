import { MagicBlockEngine } from "@/libs/engine/magic-block-engine";

export class MagicBlockEnginePlugin extends Phaser.Plugins.BasePlugin {
    public engine: MagicBlockEngine;

    constructor(pluginManager: any) {
        super(pluginManager);
    }

    init(data?: any | undefined): void {
        this.engine = data;
    }
}
