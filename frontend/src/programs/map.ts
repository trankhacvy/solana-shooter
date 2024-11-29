/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/map.json`.
 */
export type Map = {
  "address": "3GtTSM94JcNcpPyTmT9VtS1Rx6iypbsp1DQeZ2r1HHgW",
  "metadata": {
    "name": "map",
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
  "errors": [
    {
      "code": 6000,
      "name": "statusIsNotGenerate",
      "msg": "The room status is not currently set to Generate."
    },
    {
      "code": 6001,
      "name": "playerAlreadyJoined",
      "msg": "Player is already in the room"
    },
    {
      "code": 6002,
      "name": "playerIsNotPayer",
      "msg": "The player in this slot doesn't match the payer"
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
            "name": "mapType",
            "type": {
              "defined": {
                "name": "mapType"
              }
            }
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "cover",
            "type": "string"
          },
          {
            "name": "music",
            "type": "string"
          },
          {
            "name": "player",
            "type": {
              "defined": {
                "name": "player"
              }
            }
          },
          {
            "name": "tickNextSlot",
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
      "name": "mapType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "bonk"
          },
          {
            "name": "dogWithHat"
          },
          {
            "name": "popcat"
          },
          {
            "name": "peanutTheSquirrel"
          },
          {
            "name": "goatseusMaximus"
          },
          {
            "name": "catInADogsWorld"
          },
          {
            "name": "bookOfMeme"
          },
          {
            "name": "justAChillGuy"
          },
          {
            "name": "fwog"
          },
          {
            "name": "babyDogeCoin"
          },
          {
            "name": "weLoveTits"
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
            "name": "owner",
            "type": "pubkey"
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
            "name": "maximumHitPoints",
            "type": "i32"
          },
          {
            "name": "currentHitPoints",
            "type": "u32"
          },
          {
            "name": "level",
            "type": "u32"
          },
          {
            "name": "speed",
            "type": "u32"
          },
          {
            "name": "bodyDamage",
            "type": "u32"
          },
          {
            "name": "experience",
            "type": "u32"
          },
          {
            "name": "bodyAttackTime",
            "type": "u32"
          },
          {
            "name": "lastBodyDamage",
            "type": "u32"
          },
          {
            "name": "gold",
            "type": "u32"
          },
          {
            "name": "skillUpPoints",
            "type": "u32"
          },
          {
            "name": "upgradePoints",
            "type": "u32"
          },
          {
            "name": "regeneration",
            "type": "u32"
          },
          {
            "name": "attackRate",
            "type": "u32"
          },
          {
            "name": "bulletSpeed",
            "type": "u32"
          },
          {
            "name": "bulletDamage",
            "type": "u32"
          },
          {
            "name": "lastFired",
            "type": "u32"
          },
          {
            "name": "lastRegeneration",
            "type": "u32"
          },
          {
            "name": "radiusAttack",
            "type": "u32"
          },
          {
            "name": "experienceRequired",
            "type": "u32"
          }
        ]
      }
    }
  ]
};
