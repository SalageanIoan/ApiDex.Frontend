import { ESystemArchitecture } from "@apidex/core/models"
import { ServiceDocumentationDetail } from "./serviceDocumentation"

export type DocumentationProjectSummary = {
    id: string
    title: string
    generalDescription: string
    architectureType: ESystemArchitecture
}

export type DocumentationProjectDetail = {
    id: string
    title: string
    generalDescription: string
    architectureType: ESystemArchitecture
    services: ServiceDocumentationDetail[]
}

export type CreateDocumentationProjectRequest = {
    title: string
    generalDescription: string
    architectureType: ESystemArchitecture
}

export type UpdateDocumentationProjectRequest = {
    title: string
    generalDescription: string
    architectureType: ESystemArchitecture
}
