import { getApiDexService } from "@apidex/core/services"
import {
    CreateServiceDependencyRequest,
    ServiceDependencyDetail,
    UpdateServiceDependencyRequest,
} from "../models"

export async function getServiceDependencyById(
    id: string
): Promise<ServiceDependencyDetail> {
    const response = await getApiDexService().get<ServiceDependencyDetail>(
        `/GetServiceDependency/${id}`
    )
    return response.data
}

export async function getServiceDependenciesByServiceId(
    serviceDocumentationId: string
): Promise<ServiceDependencyDetail[]> {
    const response = await getApiDexService().get<ServiceDependencyDetail[]>(
        `/GetServiceDependenciesByServiceId/${serviceDocumentationId}`
    )
    return response.data
}

export async function createServiceDependency(
    request: CreateServiceDependencyRequest
): Promise<void> {
    await getApiDexService().post("/CreateServiceDependency", request)
}

export async function updateServiceDependency(
    id: string,
    request: UpdateServiceDependencyRequest
): Promise<void> {
    await getApiDexService().put(`/UpdateServiceDependency/${id}`, request)
}

export async function deleteServiceDependency(id: string): Promise<void> {
    await getApiDexService().delete(`/DeleteServiceDependency/${id}`)
}
