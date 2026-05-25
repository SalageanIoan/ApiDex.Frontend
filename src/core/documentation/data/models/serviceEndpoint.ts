export type ServiceEndpointDetail = {
    id: string
    serviceDocumentationId: string
    serviceTitle: string
    key: string
    httpMethod: string
    route: string
    description: string
}

export type CreateServiceEndpointRequest = {
    serviceDocumentationId: string
    key: string
    httpMethod: string
    route: string
    description: string
}

export type UpdateServiceEndpointRequest = {
    httpMethod: string
    route: string
    description: string
}
