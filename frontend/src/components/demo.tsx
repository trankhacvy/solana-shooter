"use client";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Inter } from "next/font/google";
// import globalStyles from "../styles/globals.css";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "@/libs/honeycomb";
import constants from "@/game/config/constants";

export default function DemoPage() {
    const wallet = useWallet();

    const handleCreate = async () => {
        if (!wallet.publicKey) {
            return;
        }

        // const {
        //     createCreateProjectTransaction: {
        //         project: projectAddress, // This is the project address once it'll be created
        //         tx: txResponse, // This is the transaction response, you'll need to sign and send this transaction
        //     },
        //     // Ez5oTj6awybgXNzPyQAvLqEo1H3smQJE2NMg6yMa72Mk
        // } = await client.createCreateProjectTransaction({
        //     name: "Arcane", // Name of the project
        //     authority: wallet.publicKey.toBase58(), // Public key of the project authority, this authority has complete control over the project
        //     // payer: wallet.publicKey.toBase58(), // Optional public key of the payer, the payer pays the transaction fees for creating this project
        //     // profileDataConfig: {
        //     //     achievements: [
        //     //         // Specify an array of achievements that you want to be able to set on your users' profiles
        //     //         "Pioneer",
        //     //     ],
        //     //     customDataFields: [
        //     //         // Specify an array of custom data fields that you want to be able to set on your users' profiles
        //     //         "NFTs owned",
        //     //     ],
        //     // },
        // });

        const {
            createCreateProfilesTreeTransaction: { tx, treeAddress }, // This is the transaction response, you'll need to sign and send this transaction
        } = await client.createCreateProfilesTreeTransaction({
            payer: wallet.publicKey.toString(),
            project: constants.ADDRESSES.PROJECT_ADDRESS,
            treeConfig: {
                // Provide either the basic or advanced configuration, we recommend using the basic configuration if you don't know the exact values of maxDepth, maxBufferSize, and canopyDepth (the basic configuration will automatically configure these values for you)
                basic: {
                    numAssets: 100000, // The desired number of profiles this tree will be able to store
                },
                // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
                // advanced: {
                //   maxDepth: 20,
                //   maxBufferSize: 64,
                //   canopyDepth: 14,
                // }
            },
        });

        const response = await sendClientTransactions(
            client, // The client instance you created earlier in the setup
            wallet, // The wallet you got from the useWallet hook
            tx // You can pass the transaction response containing either a single transaction or an array of transactions
        );

        console.log("treeAddress", treeAddress);
        console.log("response", response);
    };

    return (
        <>
            demoooo {wallet?.publicKey?.toBase58()}
            <button onClick={handleCreate}>Go go go</button>
        </>
    );
}

