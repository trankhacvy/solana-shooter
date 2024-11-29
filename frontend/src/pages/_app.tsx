import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import { Providers } from "@/components/provider";
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Providers>
            <main className={inter.className}>
                <Head>
                    <title>A Sol game with Phaser and NextJS</title>
                    <meta
                        name="description"
                        content="A Phaser 3 Next.js project template that demonstrates Next.js with React communication and uses Vite for bundling."
                    />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <link rel="icon" href="/favicon.png" />
                    <link
                        rel="prefetch"
                        as="font"
                        href="assets/font/Ubuntu-Bold.ttf"
                        type="font/ttf"
                        crossOrigin="anonymous"
                    />
                </Head>
                <Component {...pageProps} />
            </main>
        </Providers>
    );
}

