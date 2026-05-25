import { getApiDexService } from "@apidex/core/services"
import {
    CreateServiceDocumentationRequest,
    ServiceDocumentationDetail,
    UpdateServiceDocumentationRequest,
} from "../models"
import { getServiceEndpointsByServiceId } from "./serviceEndpointRepository"
import { getServiceEventsByServiceId } from "./serviceEventRepository"
import { getServiceDependenciesByServiceId } from "./serviceDependencyRepository"

type ServiceDocumentationBase = Omit<
    ServiceDocumentationDetail,
    "endpoints" | "events" | "dependencies"
>

export async function getServiceDocumentationById(
    id: string
): Promise<ServiceDocumentationDetail> {
    const response = await getApiDexService().get<ServiceDocumentationBase>(
        `/GetServiceDocumentation/${id}`
    )
    const endpoints = await getServiceEndpointsByServiceId(id)
    const events = await getServiceEventsByServiceId(id)
    const dependencies = await getServiceDependenciesByServiceId(id)

    return {
        ...response.data,
        endpoints,
        events,
        dependencies,
    }
}

export async function getServiceDocumentationsByProjectId(
    documentationProjectId: string
): Promise<ServiceDocumentationBase[]> {
    const response = await getApiDexService().get<ServiceDocumentationBase[]>(
        `/GetServiceDocumentationsByProjectId/${documentationProjectId}`
    )
    return response.data
}

export async function createServiceDocumentation(
    request: CreateServiceDocumentationRequest
): Promise<void> {
    await getApiDexService().post("/CreateServiceDocumentation", request)
}

export async function updateServiceDocumentation(
    id: string,
    request: UpdateServiceDocumentationRequest
): Promise<void> {
    await getApiDexService().put(`/UpdateServiceDocumentation/${id}`, request)
}

export async function deleteServiceDocumentation(id: string): Promise<void> {
    await getApiDexService().delete(`/DeleteServiceDocumentation/${id}`)
}
