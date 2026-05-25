import { getApiDexService } from "@apidex/core/services"
import {
    CreateServiceEventRequest,
    ServiceEventDetail,
    UpdateServiceEventRequest,
} from "../models"

export async function getServiceEventById(id: string): Promise<ServiceEventDetail> {
    const response = await getApiDexService().get<ServiceEventDetail>(
        `/GetServiceEvent/${id}`
    )
    return response.data
}

export async function getServiceEventsByServiceId(
    serviceDocumentationId: string
): Promise<ServiceEventDetail[]> {
    const response = await getApiDexService().get<ServiceEventDetail[]>(
        `/GetServiceEventsByServiceId/${serviceDocumentationId}`
    )
    return response.data
}

export async function createServiceEvent(request: CreateServiceEventRequest): Promise<void> {
    await getApiDexService().post("/CreateServiceEvent", request)
}

export async function updateServiceEvent(
    id: string,
    request: UpdateServiceEventRequest
): Promise<void> {
    await getApiDexService().put(`/UpdateServiceEvent/${id}`, request)
}

export async function deleteServiceEvent(id: string): Promise<void> {
    await getApiDexService().delete(`/DeleteServiceEvent/${id}`)
}
