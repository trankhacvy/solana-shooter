import { toSearchParams } from "@/utils";
import {
    isTMA,
    type LaunchParams,
    mockTelegramEnv,
    parseInitData,
    retrieveLaunchParams,
} from "@telegram-apps/sdk-react";
import { useRef } from "react";

export function useClientOnce(fn: () => void): void {
    const canCall = useRef(true);
    if (typeof window !== "undefined" && canCall.current) {
        canCall.current = false;
        fn();
    }
}

/**
 * Mocks Telegram environment in development mode.
 */
export function useTelegramMock(): void {
    useClientOnce(() => {
        if (!sessionStorage.getItem("env-mocked") && isTMA("simple")) {
            return;
        }

        // Determine which launch params should be applied. We could already
        // apply them previously, or they may be specified on purpose using the
        // default launch parameters transmission method.
        let lp: LaunchParams | undefined;
        try {
            lp = retrieveLaunchParams();
        } catch (e) {
            // const initDataRaw = new URLSearchParams([
            //     [
            //         "user",
            //         JSON.stringify({
            //             id: 99281932,
            //             firstName: "Andrew",
            //             lastName: "Rogue",
            //             username: "rogue",
            //             languageCode: "en",
            //             isPremium: true,
            //             allowsWriteToPm: true,
            //         }),
            //     ],
            //     [
            //         "hash",
            //         "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31",
            //     ],
            //     ["authDate", "1716922846"],
            //     ["startParam", "debug"],
            //     ["chatType", "sender"],
            //     ["chatInstance", "8428209589180549439"],
            // ]).toString();

            const initDataRaw = toSearchParams({
                auth_date: 1,
                hash: "abcd",
                signature: "aabb",
                user: {
                    added_to_attachment_menu: true,
                    allows_write_to_pm: false,
                    first_name: "Johny",
                    id: 333,
                    is_bot: false,
                    is_premium: true,
                    language_code: "en",
                    last_name: "Bravo",
                    photo_url: "https://johny.com",
                    username: "johnybravo",
                },
            });

            console.log(parseInitData(initDataRaw));

            lp = {
                themeParams: {
                    accentTextColor: "#6ab2f2",
                    bgColor: "#17212b",
                    buttonColor: "#5288c1",
                    buttonTextColor: "#ffffff",
                    destructiveTextColor: "#ec3942",
                    headerBgColor: "#17212b",
                    hintColor: "#708499",
                    linkColor: "#6ab3f3",
                    secondaryBgColor: "#232e3c",
                    sectionBgColor: "#17212b",
                    sectionHeaderTextColor: "#6ab3f3",
                    subtitleTextColor: "#708499",
                    textColor: "#f5f5f5",
                },
                initData: parseInitData(initDataRaw),
                initDataRaw,
                version: "8",
                platform: "tdesktop",
            };
        }

        sessionStorage.setItem("env-mocked", "1");
        mockTelegramEnv(lp);
        console.warn(
            "⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram."
        );
    });
}

