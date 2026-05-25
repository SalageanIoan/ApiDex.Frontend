import { getApiDexService } from "@apidex/core/services"
import {
    CreateServiceEndpointRequest,
    ServiceEndpointDetail,
    UpdateServiceEndpointRequest,
} from "../models"

export async function getServiceEndpointById(id: string): Promise<ServiceEndpointDetail> {
    const response = await getApiDexService().get<ServiceEndpointDetail>(
        `/GetServiceEndpoint/${id}`
    )
    return response.data
}

export async function getServiceEndpointsByServiceId(
    serviceDocumentationId: string
): Promise<ServiceEndpointDetail[]> {
    const response = await getApiDexService().get<ServiceEndpointDetail[]>(
        `/GetServiceEndpointsByServiceId/${serviceDocumentationId}`
    )
    return response.data
}

export async function getServiceEndpointsByProjectId(
    documentationProjectId: string
): Promise<ServiceEndpointDetail[]> {
    const response = await getApiDexService().get<ServiceEndpointDetail[]>(
        `/GetServiceEndpointsByProjectId/${documentationProjectId}`
    )
    return response.data
}

export async function createServiceEndpoint(
    request: CreateServiceEndpointRequest
): Promise<void> {
    await getApiDexService().post("/CreateServiceEndpoint", request)
}

export async function updateServiceEndpoint(
    id: string,
    request: UpdateServiceEndpointRequest
): Promise<void> {
    await getApiDexService().put(`/UpdateServiceEndpoint/${id}`, request)
}

export async function deleteServiceEndpoint(id: string): Promise<void> {
    await getApiDexService().delete(`/DeleteServiceEndpoint/${id}`)
}
