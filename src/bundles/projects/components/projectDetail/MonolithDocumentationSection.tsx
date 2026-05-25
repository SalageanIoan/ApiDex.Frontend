import { useState } from "react"
import { ConfirmDeleteDialog } from "@apidex/core/components"
import {
    CreateServiceDependencyRequest,
    CreateServiceEndpointRequest,
    ServiceDependencyDetail,
    ServiceDocumentationDetail,
    ServiceEndpointDetail,
    UpdateServiceDependencyRequest,
    UpdateServiceEndpointRequest,
} from "@apidex/core/documentation/data"
import {
    useCreateServiceDependency,
    useCreateServiceEndpoint,
    useDeleteServiceDependency,
    useDeleteServiceEndpoint,
    useUpdateServiceDependency,
    useUpdateServiceEndpoint,
} from "../../hooks"
import { DependencyFormDialog } from "../DependencyFormDialog"
import { EndpointFormDialog } from "../EndpointFormDialog"
import { MonolithEndpointsSection } from "./MonolithEndpointsSection"
import { MonolithExternalDependenciesSection } from "./MonolithExternalDependenciesSection"

type MonolithDocumentationSectionProps = {
    implicitService: ServiceDocumentationDetail | null
    showSnackbar: (message: string, severity: "success" | "error") => void
}

export function MonolithDocumentationSection({
    implicitService,
    showSnackbar,
}: MonolithDocumentationSectionProps) {
    const { createEndpoint, isLoading: isCreatingEndpoint } = useCreateServiceEndpoint()
    const { updateEndpoint, isLoading: isUpdatingEndpoint } = useUpdateServiceEndpoint()
    const { deleteEndpoint, isLoading: isDeletingEndpoint } = useDeleteServiceEndpoint()
    const { createDependency, isLoading: isCreatingDependency } = useCreateServiceDependency()
    const { updateDependency, isLoading: isUpdatingDependency } = useUpdateServiceDependency()
    const { deleteDependency, isLoading: isDeletingDependency } = useDeleteServiceDependency()

    const [endpointDialog, setEndpointDialog] = useState(false)
    const [editingEndpoint, setEditingEndpoint] = useState<ServiceEndpointDetail | null>(null)
    const [deletingEndpointId, setDeletingEndpointId] = useState<string | null>(null)
    const [dependencyDialog, setDependencyDialog] = useState(false)
    const [editingDependency, setEditingDependency] = useState<ServiceDependencyDetail | null>(null)
    const [deletingDependencyId, setDeletingDependencyId] = useState<string | null>(null)

    const endpoints = implicitService?.endpoints ?? []
    const dependencies = implicitService?.dependencies ?? []

    const handleSaveEndpoint = async (
        request: CreateServiceEndpointRequest | UpdateServiceEndpointRequest
    ) => {
        try {
            if (editingEndpoint) {
                await updateEndpoint({
                    id: editingEndpoint.id,
                    request: request as UpdateServiceEndpointRequest,
                })
                showSnackbar("Endpoint updated", "success")
            } else {
                await createEndpoint(request as CreateServiceEndpointRequest)
                showSnackbar("Endpoint created", "success")
            }

            setEndpointDialog(false)
            setEditingEndpoint(null)
        } catch {
            showSnackbar("Failed to save endpoint", "error")
        }
    }

    const handleDeleteEndpoint = async () => {
        if (!deletingEndpointId) return

        try {
            await deleteEndpoint(deletingEndpointId)
            showSnackbar("Endpoint deleted", "success")
        } catch {
            showSnackbar("Failed to delete endpoint", "error")
        }

        setDeletingEndpointId(null)
    }

    const handleSaveDependency = async (
        request: CreateServiceDependencyRequest | UpdateServiceDependencyRequest
    ) => {
        try {
            if (editingDependency) {
                await updateDependency({
                    id: editingDependency.id,
                    request: request as UpdateServiceDependencyRequest,
                })
                showSnackbar("Dependency updated", "success")
            } else {
                await createDependency(request as CreateServiceDependencyRequest)
                showSnackbar("Dependency created", "success")
            }

            setDependencyDialog(false)
            setEditingDependency(null)
        } catch {
            showSnackbar("Failed to save dependency", "error")
        }
    }

    const handleDeleteDependency = async () => {
        if (!deletingDependencyId) return

        try {
            await deleteDependency(deletingDependencyId)
            showSnackbar("Dependency deleted", "success")
        } catch {
            showSnackbar("Failed to delete dependency", "error")
        }

        setDeletingDependencyId(null)
    }

    return (
        <>
            <MonolithEndpointsSection
                endpoints={endpoints}
                canAdd={!!implicitService}
                onAdd={() => {
                    setEditingEndpoint(null)
                    setEndpointDialog(true)
                }}
                onEdit={(endpoint) => {
                    setEditingEndpoint(endpoint)
                    setEndpointDialog(true)
                }}
                onDelete={setDeletingEndpointId}
            />

            <MonolithExternalDependenciesSection
                dependencies={dependencies}
                canAdd={!!implicitService && endpoints.length > 0}
                onAdd={() => {
                    setEditingDependency(null)
                    setDependencyDialog(true)
                }}
                onEdit={(dependency) => {
                    setEditingDependency(dependency)
                    setDependencyDialog(true)
                }}
                onDelete={setDeletingDependencyId}
            />

            {implicitService && (
                <>
                    <EndpointFormDialog
                        open={endpointDialog}
                        serviceDocumentationId={implicitService.id}
                        endpoint={editingEndpoint}
                        isLoading={isCreatingEndpoint || isUpdatingEndpoint}
                        onSave={handleSaveEndpoint}
                        onCancel={() => {
                            setEndpointDialog(false)
                            setEditingEndpoint(null)
                        }}
                    />

                    <DependencyFormDialog
                        open={dependencyDialog}
                        serviceDocumentationId={implicitService.id}
                        serviceEndpoints={endpoints}
                        otherServicesEndpoints={[]}
                        externalOnly
                        dependency={editingDependency}
                        isLoading={isCreatingDependency || isUpdatingDependency}
                        onSave={handleSaveDependency}
                        onCancel={() => {
                            setDependencyDialog(false)
                            setEditingDependency(null)
                        }}
                    />
                </>
            )}

            <ConfirmDeleteDialog
                open={!!deletingEndpointId}
                title="Delete Endpoint"
                description="Are you sure you want to delete this endpoint?"
                isLoading={isDeletingEndpoint}
                onConfirm={handleDeleteEndpoint}
                onCancel={() => setDeletingEndpointId(null)}
            />

            <ConfirmDeleteDialog
                open={!!deletingDependencyId}
                title="Delete Dependency"
                description="Are you sure you want to delete this dependency?"
                isLoading={isDeletingDependency}
                onConfirm={handleDeleteDependency}
                onCancel={() => setDeletingDependencyId(null)}
            />
        </>
    )
}
