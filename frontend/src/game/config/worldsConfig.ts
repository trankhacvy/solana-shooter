export type WorldName = "HCM" | "HN" | "DN";

export type WorldConfig = {
    id: number;
    title: string;
    description: string;
    cover: string;
    music: string;
};

export type WorldsConfig = {
    [key in WorldName]: WorldConfig;
};

const worldsConfig: WorldsConfig = {
    HCM: {
        id: 0,
        title: "Ho Chi Minh City",
        description: "",
        cover: "bg-city-1",
        music: "world_0",
    },
    HN: {
        id: 1,
        title: "Ha Noi City",
        description: "",
        cover: "bg-city-2",
        music: "world_1",
    },
    DN: {
        id: 2,
        title: "Da Nang City",
        description: "",
        cover: "bg-city-3",
        music: "world_2",
    },
};

export default worldsConfig;

