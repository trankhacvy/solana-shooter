/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./layouts/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            maxWidth: {
                "1/4": "25%",
                "1/2": "50%",
                "3/4": "75%",
                "9/10": "90%",
            },
            minWidth: {
                "1/4": "25%",
                "1/2": "50%",
                "3/4": "75%",
                "9/10": "90%",
            },
            colors: {
                web: {
                    gradient1: "#89288C",
                    gradient2: "#3435EE",
                    gradient3: "#43FF98",
                    primary: "#0085FF",
                    secondary: "#43FF98",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                "background-secondary": "hsl(var(--background-secondary))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#f97316",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "white",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                content: {
                    primary: "hsl(var(--content-primary))",
                    secondary: "hsl(var(--content-secondary))",
                    tertiary: "hsl(var(--content-tertiary))",
                    "primary-b": "hsl(var(--content-primary-b))",
                },
                core: {
                    accent: "#EE4D2D",
                    "primary-a": "hsl(var(--core-primary-a))",
                    "primary-b": "hsl(var(--core-primary-b))",
                    positive: "hsl(var(--core-positive))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                circular: "200px",
                "smooth-2": "12px",
                "firm-2": "4px",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "infinite-scroll": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-100%)" },
                },
                "pulse-ring": {
                    "0%": {
                        transform: "scale(.33)",
                    },
                    "80%": {
                        transform: "scale(1.3)",
                    },
                    "100%": {
                        opacity: "0",
                    },
                },
                "pulse-dot": {
                    "0%": {
                        transform: "scale(.95)",
                    },
                    "50%": {
                        transform: "scale(1)",
                    },
                    "100%": {
                        transform: "scale(.95)",
                    },
                },
                linearBackgroundAnimation: {
                    "0%": {
                        /* Continue adjusting this
                           position based on your bg size so the start and end
                           of your animation will line up and be a seamless loop */
                        backgroundPosition: "50% 0%",
                    },
                    "50%": {
                        backgroundPosition: "0 50%",
                    },
                    "100%": {
                        backgroundPosition: "50% 0%",
                    },
                },
                float: {
                    "0%": {
                        transform: "translateY(0px)",
                    },
                    "50%": {
                        transform: "translateY(-20px)",
                    },
                    "100%": {
                        transform: "translateY(0px)",
                    },
                },
            },
            animation: {
                float: "float 5s ease-in-out infinite",
                "accordion-down": "accordion-down 0.5s ease",
                "accordion-up": "accordion-up 0.5s ease",
                "infinite-scroll": "infinite-scroll 25s linear infinite",
                linearBackgroundAnimation: "linearBackgroundAnimation 5s infinite ease !important",
                pulseDot:
                    "pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite !important",
                pulseRing:
                    "pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite !important",
            },
            backgroundSize: {
                "200": "200%",
                "500": "500%",
                4000: "4000%",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
