import { EServiceDependencyType } from "@apidex/core/models"

export type ServiceDependencyDetail = {
    id: string
    sourceEndpointId: string
    dependencyType: EServiceDependencyType
    targetEndpointId: string | null
    targetServiceTitle: string | null
    targetEndpointRoute: string | null
    description: string
}

export type CreateServiceDependencyRequest = {
    serviceDocumentationId: string
    sourceEndpointId: string
    dependencyType: EServiceDependencyType
    targetEndpointId: string | null
    targetServiceTitle: string | null
    targetEndpointRoute: string | null
    description: string
}

export type UpdateServiceDependencyRequest = {
    sourceEndpointId: string
    dependencyType: EServiceDependencyType
    targetEndpointId: string | null
    targetServiceTitle: string | null
    targetEndpointRoute: string | null
    description: string
}
