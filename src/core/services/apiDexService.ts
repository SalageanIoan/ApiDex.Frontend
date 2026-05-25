import axios, { AxiosInstance } from "axios"

let apiDexService: AxiosInstance | null = null

export function getApiDexService(): AxiosInstance {
    if (apiDexService) {
        return apiDexService
    }

    apiDexService = axios.create({
        baseURL: "/Documentation",
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 30000,
    })

    return apiDexService
}
