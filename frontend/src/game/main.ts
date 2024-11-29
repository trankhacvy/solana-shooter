import Phaser, { Game } from 'phaser'
import constants from './config/constants'
import SceneList from './config/sceneList'
import { plugins } from './config/pluginsConfig'

//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    title: 'A Sol game',
    version: '1.0.0',
    type: Phaser.WEBGL,
    parent: 'game-wrapper',
    backgroundColor: '#38393D',
    width: constants.WIDTH,
    height: constants.HEIGHT,
    scale: {
      mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom: constants.SCALE,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: constants.DEBUG,
        fps: 61,
      },
    },
    render: {
      pixelArt: false,
    },
    autoFocus: true,
    scene: SceneList,
    plugins,
};

const StartGame = (parent: string) => {

    window.Phaser = Phaser
    return new Game({ ...config, parent});

}

export default StartGame;
