import axios from "axios";

export type ApiConfig = {
    baseUrl: string;
    accessToken?: string;
    headers?: Record<string, string>;
};

export class ApiService {
    private config: ApiConfig;
    private instance: axios.AxiosInstance;

    constructor(config: ApiConfig) {
        this.config = config;
        this.instance = axios.create({ baseURL: config.baseUrl, headers: { ...config.headers } });
        this.setupInterceptors();
    }

    getInstance() {
        this.setupAuthToken(this.config.accessToken);
        return this.instance;
    }

    setupAuthToken(token?: string) {
        this.instance!.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );
    }

    setupInterceptors() {
        this.instance!.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle errors here, e.g., log the error or display a user-friendly message
                console.error("API Error:", error);
                return Promise.reject(error);
            },
        );
    }
}
