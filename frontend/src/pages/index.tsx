import { Button } from "@/components/shadcn/button";
import Link from "next/link";

const HomePage = () => {
    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <img
                alt=""
                src="bg.jpeg"
                className="after:content-[''] after:absolute after:w-full after:h-full after:bg-black after:top-0 after:left-0 absolute z-0 w-auto min-w-full min-h-full max-w-none"
            />

            {/* Content Overlay */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
                    <span className="block">Welcome to</span>
                    <span className="block text-primary">Arcane</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Embark on a journey through mystical lands, battle fearsome
                    creatures, and become the hero of legend.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                    <Link href="/play">
                        <Button
                            size="lg"
                            className="px-8 py-3 text-lg font-semibold"
                        >
                            Play Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent z-5"></div>
            {/* <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 right-20 w-56 h-56 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div> */}
        </div>
    );
};

export default HomePage;

