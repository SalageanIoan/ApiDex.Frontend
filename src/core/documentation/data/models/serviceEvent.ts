import { EServiceEventDirection } from "@apidex/core/models"

export type ServiceEventDetail = {
    id: string
    serviceEndpointIds: string[]
    name: string
    description: string
    direction: EServiceEventDirection
}

export type CreateServiceEventRequest = {
    serviceDocumentationId: string
    serviceEndpointIds: string[]
    name: string
    description: string
    direction: EServiceEventDirection
}

export type UpdateServiceEventRequest = {
    serviceEndpointIds: string[]
    name: string
    description: string
    direction: EServiceEventDirection
}
