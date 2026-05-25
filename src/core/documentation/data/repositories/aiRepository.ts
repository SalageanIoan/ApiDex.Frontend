import { getAssistantService, getRagService } from "@apidex/core/services"

export type AskDocumentationRequest = {
    question: string
    projectId?: string | null
    serviceId?: string | null
}

export type AskDocumentationResponse = {
    answer: string
}

export type RagSettingsResponse = {
    activeModel: string
    contextMode: string
    availableModels: string[]
    availableContextModes: string[]
    modelDescriptors: RagModelDescriptor[]
}

export type RagModelDescriptor = {
    type: string
    key: string
    dimensions: number
    offline: boolean
}

export type ProjectIndexStatus = {
    activeCount: number
    allModelsCount: number
}

export const aiRepository = {
    indexProject: async (projectId: string): Promise<void> => {
        await getRagService().post(`/IndexProject/${projectId}`)
    },

    clearProjectIndex: async (projectId: string): Promise<void> => {
        await getRagService().delete(`/ProjectIndex/${projectId}`)
    },

    getProjectIndexStatus: async (projectId: string): Promise<ProjectIndexStatus> => {
        const response = await getRagService().get<ProjectIndexStatus>(`/ProjectIndex/${projectId}`)
        return response.data
    },

    ask: async (request: AskDocumentationRequest): Promise<AskDocumentationResponse> => {
        const response = await getAssistantService().post<AskDocumentationResponse>("/Ask", request)
        return response.data
    },

    getRagSettings: async (): Promise<RagSettingsResponse> => {
        const response = await getRagService().get<RagSettingsResponse>("/Settings")
        return response.data
    },

    updateRagSettings: async (activeModel: string, contextMode: string): Promise<void> => {
        await getRagService().put("/Settings", { activeModel, contextMode })
    }
}
