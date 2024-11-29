/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/position.json`.
 */
export type Position = {
  "address": "AdmDkU6FYZiGRoD9fpoxmqWmdZXgcvno7wCPZPRUnJrf",
  "metadata": {
    "name": "position",
    "version": "0.1.10",
    "spec": "0.1.0",
    "description": "Created with Bolt"
  },
  "instructions": [
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
      "name": "position",
      "discriminator": [
        170,
        188,
        143,
        228,
        122,
        64,
        247,
        208
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
      "name": "position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "x",
            "type": "i64"
          },
          {
            "name": "y",
            "type": "i64"
          },
          {
            "name": "z",
            "type": "i64"
          },
          {
            "name": "description",
            "type": "string"
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
