#!/bin/bash

# Deploy programs using bolt
# bolt deploy --provider.cluster devnet --program-name command
bolt deploy --provider.cluster devnet --program-name tick
# bolt deploy --provider.cluster devnet --program-name player-attack
# bolt deploy --provider.cluster devnet --program-name collider
# bolt deploy --provider.cluster devnet --program-name map-positions
# bolt deploy --provider.cluster devnet --program-name map
# bolt deploy --provider.cluster devnet --program-name wave
# bolt deploy --provider.cluster devnet --program-name new-map
# bolt deploy --provider.cluster devnet --program-name player
# bolt deploy --provider.cluster devnet --program-name bullets
# bolt deploy --provider.cluster devnet --program-name enemies

echo "Deployment complete."
