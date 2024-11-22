import Phaser from 'phaser'
import weaponConstants from '../../../config/weaponConstants'
import Bullet from '../Bullet'
import constants from '../../../config/constants'

export default class GaussGun2 extends Bullet {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const config = weaponConstants.GaussGun2
    super(scene, x, y, constants.BULLETS.TEXTURE, config.frameKey)

    this.setupConfig(config)
  }

  public attack(): void {
    this.fire()
  }
}
