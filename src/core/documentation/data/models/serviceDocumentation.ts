import { ServiceEndpointDetail } from "./serviceEndpoint"
import { ServiceEventDetail } from "./serviceEvent"
import { ServiceDependencyDetail } from "./serviceDependency"

export type ServiceDocumentationDetail = {
    id: string
    title: string
    generalDescription: string
    endpoints: ServiceEndpointDetail[]
    events: ServiceEventDetail[]
    dependencies: ServiceDependencyDetail[]
}

export type CreateServiceDocumentationRequest = {
    documentationProjectId: string
    title: string
    generalDescription: string
}

export type UpdateServiceDocumentationRequest = {
    title: string
    generalDescription: string
}
