import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createServiceEndpoint,
    updateServiceEndpoint,
    deleteServiceEndpoint,
    getServiceEndpointsByProjectId,
    CreateServiceEndpointRequest,
    UpdateServiceEndpointRequest,
} from "@apidex/core/documentation/data"

export function useServiceEndpointsByProjectId(projectId: string | undefined) {
    const query = useQuery({
        queryKey: ["serviceEndpointsByProject", projectId],
        queryFn: () => getServiceEndpointsByProjectId(projectId!),
        enabled: !!projectId,
    })

    return {
        endpoints: query.data ?? [],
        isLoading: query.isLoading,
    }
}

export function useCreateServiceEndpoint() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (request: CreateServiceEndpointRequest) =>
            createServiceEndpoint(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
            queryClient.invalidateQueries({ queryKey: ["serviceEndpointsByProject"] })
        },
    })

    return {
        createEndpoint: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useUpdateServiceEndpoint() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({
            id,
            request,
        }: {
            id: string
            request: UpdateServiceEndpointRequest
        }) => updateServiceEndpoint(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
            queryClient.invalidateQueries({ queryKey: ["serviceEndpointsByProject"] })
        },
    })

    return {
        updateEndpoint: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useDeleteServiceEndpoint() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => deleteServiceEndpoint(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
            queryClient.invalidateQueries({ queryKey: ["serviceEndpointsByProject"] })
        },
    })

    return {
        deleteEndpoint: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}
