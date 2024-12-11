/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/tick.json`.
 */
export type Tick = {
  "address": "FpnrMvegmtFSxu8ndVyEiydXhVCRp8bT31aL3fLnheji",
  "metadata": {
    "name": "tick",
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
          "name": "enemies"
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "enemies",
      "discriminator": [
        90,
        169,
        82,
        176,
        82,
        178,
        52,
        217
      ]
    },
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
      "name": "enemies",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "map",
            "type": "pubkey"
          },
          {
            "name": "dead",
            "type": "u32"
          },
          {
            "name": "enemies",
            "type": {
              "vec": {
                "defined": {
                  "name": "enemy"
                }
              }
            }
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
      "name": "enemy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "waveId",
            "type": "u32"
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
            "name": "damage",
            "type": "u32"
          },
          {
            "name": "speed",
            "type": "f32"
          },
          {
            "name": "experience",
            "type": "u32"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "lastBodyDamage",
            "type": "u64"
          },
          {
            "name": "bodyAttackTime",
            "type": "u64"
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
            "name": "status",
            "type": {
              "defined": {
                "name": "mapStatus"
              }
            }
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
      "name": "mapStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ready"
          },
          {
            "name": "over"
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
