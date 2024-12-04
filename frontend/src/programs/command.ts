/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/command.json`.
 */
export type Command = {
  "address": "7aU6xJtBHNKaSoQoDWxp52ioJa8VSyaD28nKFAJMrniW",
  "metadata": {
    "name": "command",
    "version": "0.1.10",
    "spec": "0.1.0",
    "description": "Created with Bolt"
  },
  "instructions": [
    {
      "name": "execute2",
      "discriminator": [
        105,
        108,
        50,
        190,
        253,
        180,
        77,
        227
      ],
      "accounts": [
        {
          "name": "map"
        },
        {
          "name": "player"
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": "bytes"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "map",
      "discriminator": [
        182,
        30,
        142,
        151,
        42,
        241,
        180,
        244
      ]
    },
    {
      "name": "player",
      "discriminator": [
        205,
        222,
        112,
        7,
        165,
        155,
        206,
        218
      ]
    }
  ],
  "types": [
    {
      "name": "boltMetadata",
      "docs": [
        "Metadata for the component."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "enemyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "flyingEye"
          },
          {
            "name": "goblin"
          },
          {
            "name": "mushroom"
          },
          {
            "name": "skeleton"
          }
        ]
      }
    },
    {
      "name": "map",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "boundX",
            "type": "u32"
          },
          {
            "name": "boundY",
            "type": "u32"
          },
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "lastTick",
            "type": "u64"
          },
          {
            "name": "lastWaveSpawn",
            "type": "i64"
          },
          {
            "name": "lastEnemySpawn",
            "type": "i64"
          },
          {
            "name": "waves",
            "type": {
              "vec": {
                "defined": {
                  "name": "wave"
                }
              }
            }
          },
          {
            "name": "currentWaveIndex",
            "type": "i8"
          },
          {
            "name": "currentWaveCount",
            "type": "u32"
          },
          {
            "name": "boltMetadata",
            "type": {
              "defined": {
                "name": "boltMetadata"
              }
            }
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "x",
            "type": "f32"
          },
          {
            "name": "y",
            "type": "f32"
          },
          {
            "name": "hp",
            "type": "u32"
          },
          {
            "name": "maxHp",
            "type": "u32"
          },
          {
            "name": "speed",
            "type": "f32"
          },
          {
            "name": "bulletSpeed",
            "type": "f32"
          },
          {
            "name": "bulletDamage",
            "type": "u32"
          },
          {
            "name": "radiusAttack",
            "type": "u32"
          },
          {
            "name": "lastBodyDamage",
            "type": "u64"
          },
          {
            "name": "bodyAttackTime",
            "type": "u64"
          },
          {
            "name": "lastFire",
            "type": "u64"
          },
          {
            "name": "boltMetadata",
            "type": {
              "defined": {
                "name": "boltMetadata"
              }
            }
          }
        ]
      }
    },
    {
      "name": "wave",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "spawnCount",
            "type": "u32"
          },
          {
            "name": "interval",
            "type": "u32"
          },
          {
            "name": "enemyType",
            "type": {
              "defined": {
                "name": "enemyType"
              }
            }
          }
        ]
      }
    }
  ]
};
