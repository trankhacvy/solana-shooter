#!/bin/bash

# Deploy programs using bolt
# bolt deploy --provider.cluster devnet --program-name command -- --max-len 500000
# bolt deploy --provider.cluster devnet --program-name tick -- --max-len 300000
# bolt deploy --provider.cluster devnet --program-name player-attack -- --max-len 300000
# bolt deploy --provider.cluster devnet --program-name collider -- --max-len 300000
# bolt deploy --provider.cluster devnet --program-name map-positions -- --max-len 300000
bolt deploy --provider.cluster devnet --program-name map -- --max-len 500000
# bolt deploy --provider.cluster devnet --program-name wave
bolt deploy --provider.cluster devnet --program-name new-map -- --max-len 300000
bolt deploy --provider.cluster devnet --program-name player -- --max-len 500000
bolt deploy --provider.cluster devnet --program-name bullets -- --max-len 500000
bolt deploy --provider.cluster devnet --program-name enemies -- --max-len 500000

echo "Deployment complete."
