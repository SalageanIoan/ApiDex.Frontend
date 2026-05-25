import { getApiDexService } from "@apidex/core/services"
import {
    CreateDocumentationProjectRequest,
    DocumentationProjectDetail,
    DocumentationProjectSummary,
    UpdateDocumentationProjectRequest,
} from "../models"
import { getServiceDocumentationsByProjectId } from "./serviceDocumentationRepository"
import { getServiceEndpointsByServiceId } from "./serviceEndpointRepository"
import { getServiceDependenciesByServiceId } from "./serviceDependencyRepository"

export async function getDocumentationProjects(): Promise<DocumentationProjectSummary[]> {
    const response = await getApiDexService().get<DocumentationProjectSummary[]>(
        "/GetProjectDocumentations"
    )
    return response.data
}

export async function getDocumentationProjectById(
    id: string
): Promise<DocumentationProjectDetail> {
    type DocumentationProjectBase = Omit<DocumentationProjectDetail, "services">

    const response = await getApiDexService().get<DocumentationProjectBase>(
        `/GetProjectDocumentation/${id}`
    )

    const services = await getServiceDocumentationsByProjectId(id)
    const servicesWithEndpoints = await Promise.all(
        services.map(async (service) => {
            const [endpoints, dependencies] = await Promise.all([
                getServiceEndpointsByServiceId(service.id),
                getServiceDependenciesByServiceId(service.id),
            ])

            return {
                ...service,
                endpoints,
                events: [],
                dependencies,
            }
        })
    )

    return {
        ...response.data,
        services: servicesWithEndpoints,
    }
}

export async function createDocumentationProject(
    request: CreateDocumentationProjectRequest
): Promise<void> {
    await getApiDexService().post("/CreateProjectDocumentation", request)
}

export async function updateDocumentationProject(
    id: string,
    request: UpdateDocumentationProjectRequest
): Promise<void> {
    await getApiDexService().put(`/UpdateProjectDocumentation/${id}`, request)
}

export async function deleteDocumentationProject(id: string): Promise<void> {
    await getApiDexService().delete(`/DeleteProjectDocumentation/${id}`)
}
