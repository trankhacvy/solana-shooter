/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/new_map.json`.
 */
export type NewMap = {
  "address": "8PJTiVhRq2MCyHE8D3CrbuktWRkr4VswvLiS16VFqEsh",
  "metadata": {
    "name": "newMap",
    "version": "0.1.10",
    "spec": "0.1.0",
    "description": "Created with Bolt"
  },
  "instructions": [
    {
      "name": "execute",
      "discriminator": [
        130,
        221,
        242,
        154,
        13,
        193,
        189,
        29
      ],
      "accounts": [
        {
          "name": "map"
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
