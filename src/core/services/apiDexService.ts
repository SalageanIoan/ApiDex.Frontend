import axios, { AxiosInstance } from "axios"

let apiDexService: AxiosInstance | null = null
let ragService: AxiosInstance | null = null
let assistantService: AxiosInstance | null = null

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

export function getRagService(): AxiosInstance {
    if (ragService) {
        return ragService
    }

    ragService = axios.create({
        baseURL: "/Rag",
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 30000,
    })

    return ragService
}

export function getAssistantService(): AxiosInstance {
    if (assistantService) {
        return assistantService
    }

    assistantService = axios.create({
        baseURL: "/Assistant",
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 30000,
    })

    return assistantService
}
