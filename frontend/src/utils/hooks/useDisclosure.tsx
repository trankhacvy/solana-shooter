import { useEffect, useState } from "react";

export const useDisclosure = (
    initialState = false,
    events: { onOpen: (() => void) | null; onClose: (() => void) | null } = {
        onOpen: null,
        onClose: null,
    },
) => {
    const [isOpen, setIsOpen] = useState(initialState);

    useEffect(() => {
        if (isOpen !== initialState) {
            setIsOpen(initialState);
        }
    }, [initialState]);

    const open = () => {
        setIsOpen(true);
        if (typeof onOpen === "function") {
            onOpen();
        }
    };

    const close = () => {
        setIsOpen(false);
        if (typeof onClose === "function") {
            onClose();
        }
    };

    const toggle = () => (isOpen ? close() : open());

    return { isOpen, open, close, toggle };
};
