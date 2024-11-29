// useScrollPosition.js

import { useState, useEffect } from "react";

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const cancel = () => {
        window.removeEventListener("scroll", updatePosition);
    };

    const updatePosition = () => {
        setScrollPosition(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", updatePosition);
        updatePosition();
        return () => window.removeEventListener("scroll", updatePosition);
    }, []);

    return { scrollPosition, cancel };
};

export default useScrollPosition;
