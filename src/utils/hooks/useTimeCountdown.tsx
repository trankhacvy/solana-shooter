import React, { useEffect, useState } from "react";

const getCountingDownTime = (countDownInTick: number) => {
    // calculate time left
    // const days = Math.floor(countDownInTick / (1000 * 60 * 60 * 24));
    const hours = Math.floor(countDownInTick / (1000 * 60 * 60));
    const minutes = Math.floor((countDownInTick % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDownInTick % (1000 * 60)) / 1000);

    return [hours, minutes, seconds];
};

export const useCountdown = (targetDate?: Date | null) => {
    const countDownDate = targetDate && new Date(targetDate).getTime();
    const interval = React.useRef<NodeJS.Timeout | null>(null);

    const [countDown, setCountDown] = useState(new Date().getTime() - new Date().getTime());

    const cancel = () => {
        if (interval.current) clearInterval(interval.current);
    };

    useEffect(() => {
        if (!countDownDate) return;
        interval.current = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => {
            if (interval.current) clearInterval(interval.current);
        };
    }, [countDownDate]);

    return { cancel, data: getCountingDownTime(countDown) };
};
