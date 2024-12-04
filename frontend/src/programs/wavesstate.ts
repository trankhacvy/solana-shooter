/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/wavesstate.json`.
 */
export type Wavesstate = {
  "address": "GNb8HMSPe2hx2h91SV3xv1c2nbJYnLmszWTc5oCex9Gh",
  "metadata": {
    "name": "wavesstate",
    "version": "0.1.10",
    "spec": "0.1.0",
    "description": "Created with Bolt"
  },
  "instructions": [
    {
      "name": "delegate",
      "discriminator": [
        90,
        147,
        75,
        178,
        85,
        88,
        4,
        137
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "entity"
        },
        {
          "name": "account",
          "writable": true
        },
        {
          "name": "ownerProgram"
        },
        {
          "name": "buffer",
          "writable": true
        },
        {
          "name": "delegationRecord",
          "writable": true
        },
        {
          "name": "delegateAccountSeeds",
          "writable": true
        },
        {
          "name": "delegationProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "validUntil",
          "type": "i64"
        },
        {
          "name": "commitFrequencyMs",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "data",
          "writable": true
        },
        {
          "name": "entity"
        },
        {
          "name": "authority"
        },
        {
          "name": "instructionSysvarAccount",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "processUndelegation",
      "discriminator": [
        196,
        28,
        41,
        206,
        48,
        37,
        51,
        167
      ],
      "accounts": [
        {
          "name": "delegatedAccount",
          "writable": true
        },
        {
          "name": "buffer"
        },
        {
          "name": "payer",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "accountSeeds",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    },
    {
      "name": "undelegate",
      "discriminator": [
        131,
        148,
        180,
        198,
        91,
        104,
        42,
        238
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "delegatedAccount",
          "writable": true
        },
        {
          "name": "magicContext",
          "writable": true,
          "address": "MagicContext1111111111111111111111111111111"
        },
        {
          "name": "magicProgram",
          "address": "Magic11111111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "update",
      "discriminator": [
        219,
        200,
        88,
        176,
        158,
        63,
        253,
        127
      ],
      "accounts": [
        {
          "name": "boltComponent",
          "writable": true
        },
        {
          "name": "authority"
        },
        {
          "name": "instructionSysvarAccount",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "bytes"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "entity",
      "discriminator": [
        46,
        157,
        161,
        161,
        254,
        46,
        79,
        24
      ]
    },
    {
      "name": "wavesState",
      "discriminator": [
        239,
        60,
        50,
        232,
        163,
        74,
        208,
        3
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
      "name": "bullet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "x",
            "type": "u32"
          },
          {
            "name": "y",
            "type": "u32"
          },
          {
            "name": "speed",
            "type": "u32"
          },
          {
            "name": "enemyId",
            "type": "u32"
          },
          {
            "name": "active",
            "type": "bool"
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
            "type": "u32"
          },
          {
            "name": "y",
            "type": "u32"
          },
          {
            "name": "hp",
            "type": "u32"
          },
          {
            "name": "speed",
            "type": "u32"
          },
          {
            "name": "active",
            "type": "bool"
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
      "name": "entity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
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
    },
    {
      "name": "wavesState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "map",
            "type": "pubkey"
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
            "name": "activeWave",
            "type": "bool"
          },
          {
            "name": "lastSpawnTime",
            "type": "i64"
          },
          {
            "name": "lastWaveSpawnTime",
            "type": "i64"
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
            "name": "bullets",
            "type": {
              "vec": {
                "defined": {
                  "name": "bullet"
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
    }
  ]
};
