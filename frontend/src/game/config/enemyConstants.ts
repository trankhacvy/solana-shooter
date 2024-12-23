import type { ItemTypeName } from './itemsConstants'
import type { EnemyType, EnemyTypeV2 } from '../types/enemies'

export type EnemyTypeSettings = {
  index: number
  type: EnemyType
  keyFrame: string
  items: ItemTypeName[]
  health: number
  speed: number
  bodyDamage: number
  experience: number
  bodyAttackTime: number
}

export type EnemyTypeSettingsV2 = {
  index: number
  type: EnemyTypeV2
  texture: string
  keyFrame: string
  items: ItemTypeName[]
  health: number
  speed: number
  bodyDamage: number
  experience: number
  bodyAttackTime: number
}

type EnemyConstantsType = { [key in EnemyType]: EnemyTypeSettings }

type EnemyConstantsTypeV2 = { [key in EnemyTypeV2]: EnemyTypeSettingsV2 }

const defaultEnemyItems: ItemTypeName[] = ['ExpGem', 'GoldCoin', 'PistolHealth']
const defaultBodyAttackTime = 500

const enemyConstants: EnemyConstantsType = {
  AntsInMyEyesJohnson: {
    index: 0,
    type: 'AntsInMyEyesJohnson',
    keyFrame: 'AntsInMyEyesJohnson',
    items: defaultEnemyItems,
    health: 10,
    speed: 200,
    bodyDamage: 5,
    experience: 1.5,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Concerto: {
    index: 1,
    type: 'Concerto',
    keyFrame: 'Concerto',
    items: defaultEnemyItems,
    health: 500,
    speed: 160,
    bodyDamage: 30,
    experience: 4,
    bodyAttackTime: defaultBodyAttackTime,
  },
  FloopyDoops: {
    index: 2,
    type: 'FloopyDoops',
    keyFrame: 'FloopyDoops',
    items: defaultEnemyItems,
    health: 5,
    speed: 140,
    bodyDamage: 5,
    experience: 1,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Froopy5: {
    index: 3,
    type: 'Froopy5',
    keyFrame: 'Froopy5',
    items: defaultEnemyItems,
    health: 10,
    speed: 100,
    bodyDamage: 10,
    experience: 1,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Froopy14: {
    index: 4,
    type: 'Froopy14',
    keyFrame: 'Froopy14',
    items: defaultEnemyItems,
    health: 270,
    speed: 140,
    bodyDamage: 10,
    experience: 5,
    bodyAttackTime: defaultBodyAttackTime,
  },
  FroopyTommy: {
    index: 5,
    type: 'FroopyTommy',
    keyFrame: 'FroopyTommy',
    items: defaultEnemyItems,
    health: 60,
    speed: 50,
    bodyDamage: 1,
    experience: 2,
    bodyAttackTime: defaultBodyAttackTime,
  },
  GeneralGromflamite: {
    index: 6,
    type: 'GeneralGromflamite',
    keyFrame: 'GeneralGromflamite',
    items: defaultEnemyItems,
    health: 3000,
    speed: 120,
    bodyDamage: 15,
    experience: 50,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Gobo: {
    index: 7,
    type: 'Gobo',
    keyFrame: 'Gobo',
    items: defaultEnemyItems,
    health: 30,
    speed: 30,
    bodyDamage: 1,
    experience: 2,
    bodyAttackTime: defaultBodyAttackTime,
  },
  GromflamiteSoldier: {
    index: 8,
    type: 'GromflamiteSoldier',
    keyFrame: 'GromflamiteSoldier',
    items: defaultEnemyItems,
    health: 2500,
    speed: 140,
    bodyDamage: 10,
    experience: 30,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Hamurai: {
    index: 9,
    type: 'Hamurai',
    keyFrame: 'Hamurai',
    items: defaultEnemyItems,
    health: 2000,
    speed: 130,
    bodyDamage: 20,
    experience: 2,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Hemorrhage: {
    index: 10,
    type: 'Hemorrhage',
    keyFrame: 'Hemorrhage',
    items: defaultEnemyItems,
    health: 500,
    speed: 80,
    bodyDamage: 10,
    experience: 3,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Jaguar: {
    index: 11,
    type: 'Jaguar',
    keyFrame: 'Jaguar',
    items: defaultEnemyItems,
    health: 2500,
    speed: 80,
    bodyDamage: 20,
    experience: 25,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Kiara: {
    index: 12,
    type: 'Kiara',
    keyFrame: 'Kiara',
    items: defaultEnemyItems,
    health: 1500,
    speed: 160,
    bodyDamage: 30,
    experience: 1,
    bodyAttackTime: defaultBodyAttackTime,
  },
  MrNimbus: {
    index: 13,
    type: 'MrNimbus',
    keyFrame: 'MrNimbus',
    items: defaultEnemyItems,
    health: 500,
    speed: 80,
    bodyDamage: 20,
    experience: 3,
    bodyAttackTime: defaultBodyAttackTime,
  },
  NoobNoob: {
    index: 14,
    type: 'NoobNoob',
    keyFrame: 'NoobNoob',
    items: defaultEnemyItems,
    health: 15,
    speed: 100,
    bodyDamage: 10,
    experience: 2,
    bodyAttackTime: defaultBodyAttackTime,
  },
  PrincessPoneta: {
    index: 15,
    type: 'PrincessPoneta',
    keyFrame: 'PrincessPoneta',
    items: defaultEnemyItems,
    health: 750,
    speed: 120,
    bodyDamage: 10,
    experience: 3,
    bodyAttackTime: defaultBodyAttackTime,
  },
  RisottoGroupon: {
    index: 16,
    type: 'RisottoGroupon',
    keyFrame: 'RisottoGroupon',
    items: defaultEnemyItems,
    health: 250,
    speed: 120,
    bodyDamage: 10,
    experience: 30,
    bodyAttackTime: defaultBodyAttackTime,
  },
  ScaryTerry: {
    index: 17,
    type: 'ScaryTerry',
    keyFrame: 'ScaryTerry',
    items: defaultEnemyItems,
    health: 500,
    speed: 80,
    bodyDamage: 20,
    experience: 3,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Schleemypants: {
    index: 18,
    type: 'Schleemypants',
    keyFrame: 'Schleemypants',
    items: defaultEnemyItems,
    health: 500_000,
    speed: 1000,
    bodyDamage: 200,
    experience: 0,
    bodyAttackTime: defaultBodyAttackTime,
  },
  ShonoopyBloopers: {
    index: 19,
    type: 'ShonoopyBloopers',
    keyFrame: 'ShonoopyBloopers',
    items: defaultEnemyItems,
    health: 70,
    speed: 100,
    bodyDamage: 10,
    experience: 2.5,
    bodyAttackTime: 500,
  },
  Shnyuk: {
    index: 19,
    type: 'Shnyuk',
    keyFrame: 'Shnyuk',
    items: ['ExpGem', 'GoldCoin'],
    health: 15,
    speed: 100,
    bodyDamage: 10,
    experience: 2.5,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Squanchy: {
    index: 20,
    type: 'Squanchy',
    keyFrame: 'Squanchy',
    items: defaultEnemyItems,
    health: 180,
    speed: 130,
    bodyDamage: 14,
    experience: 2,
    bodyAttackTime: defaultBodyAttackTime,
  },
  TargetBot: {
    index: 21,
    type: 'TargetBot',
    keyFrame: 'TargetBot',
    items: defaultEnemyItems,
    health: 5,
    speed: 140,
    bodyDamage: 5,
    experience: 1,
    bodyAttackTime: defaultBodyAttackTime / 2,
  },
  Terryfold: {
    index: 22,
    type: 'Terryfold',
    keyFrame: 'Terryfold',
    items: defaultEnemyItems,
    health: 50,
    speed: 40,
    bodyDamage: 1,
    experience: 2,
    bodyAttackTime: defaultBodyAttackTime,
  },
}

export const enemyConstantsV2: EnemyConstantsTypeV2 = {
  FlyingEye: {
    index: 0,
    type: 'FlyingEye',
    texture: 'FlyingEyeFlight',
    keyFrame: 'FlyingEyeFlight',
    items: defaultEnemyItems,
    health: 10,
    speed: 200,
    bodyDamage: 5,
    experience: 1.5,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Goblin: {
    index: 0,
    type: 'Goblin',
    texture: 'GoblinIdle',
    keyFrame: 'GoblinIdle',
    items: defaultEnemyItems,
    health: 10,
    speed: 200,
    bodyDamage: 5,
    experience: 1.5,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Mushroom: {
    index: 0,
    type: 'Mushroom',
    texture: 'MushroomIdle',
    keyFrame: 'MushroomIdle',
    items: defaultEnemyItems,
    health: 10,
    speed: 200,
    bodyDamage: 5,
    experience: 1.5,
    bodyAttackTime: defaultBodyAttackTime,
  },
  Skeleton: {
    index: 0,
    type: 'Skeleton',
    texture: 'SkeletonIdle',
    keyFrame: 'SkeletonIdle',
    items: defaultEnemyItems,
    health: 10,
    speed: 200,
    bodyDamage: 5,
    experience: 1.5,
    bodyAttackTime: defaultBodyAttackTime,
  },
}

export default enemyConstants
