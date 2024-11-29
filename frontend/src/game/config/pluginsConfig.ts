import { FloatingNumbersPlugin } from "../plugins/FloatingNumbers";

export const plugins = {
    scene: [
        {
            key: "floatingNumbers",
            plugin: FloatingNumbersPlugin,
            sceneKey: "floatingNumbers",
            mapping: "floatingNumbers",
            systemKey: "floatingNumbers",
        },
        {
          key: 'rexuiplugin',
        //   url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
          sceneKey: 'rexUI'
        },
    ],
};

