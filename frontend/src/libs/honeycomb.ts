import base58 from "bs58";
import constants from "@/game/config/constants";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { WalletContextState } from "@solana/wallet-adapter-react";

const API_URL = "https://edge.test.honeycombprotocol.com/";

export const client = createEdgeClient(API_URL, true);

export const createUserAndProfileIfNeeded = async (
    walletState: WalletContextState
) => {
    try {
        let userResponse = await client.findUsers({
            wallets: [walletState.publicKey.toBase58()],
            includeProjectProfiles: [],
        });

        const user = userResponse?.user?.[0];

        if (!user) {
            const { createNewUserWithProfileTransaction: txResponse } =
                await client.createNewUserWithProfileTransaction({
                    project: constants.ADDRESSES.PROJECT_ADDRESS,
                    wallet: walletState.publicKey.toBase58(),
                    payer: walletState.publicKey.toBase58(),
                    profileIdentity: "main",
                    userInfo: {
                        name: "DOGGO",
                        bio: "Make $DOGGO greate again ^^",
                        pfp: "https://euchmlalaurbsxwdhsix.supabase.co/storage/v1/object/public/arcane/arcane-doggo.png",
                    },
                });
            await sendClientTransactions(client, walletState, txResponse);
            userResponse = await client.findUsers({
                wallets: [walletState.publicKey.toBase58()],
            });
            return userResponse?.user?.[0];
        }

        return user;
    } catch (error) {
        throw error;
    }
};

