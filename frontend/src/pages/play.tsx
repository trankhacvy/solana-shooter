import { Inter } from "next/font/google";
// import globalStyles from "../styles/globals.css";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const AppWithoutSSR = dynamic(() => import("../components/App"), {
    ssr: false,
});

// const DemoPage = dynamic(() => import("../components/demo"), {
//     ssr: false,
// });

export default function Home() {
    return (
        <>
            <main className={`${inter.className}`}>
                <AppWithoutSSR />
                {/* <DemoPage /> */}
            </main>
        </>
    );
}

