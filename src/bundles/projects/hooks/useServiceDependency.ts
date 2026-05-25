import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    createServiceDependency,
    updateServiceDependency,
    deleteServiceDependency,
    CreateServiceDependencyRequest,
    UpdateServiceDependencyRequest,
} from "@apidex/core/documentation/data"

export function useCreateServiceDependency() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (request: CreateServiceDependencyRequest) =>
            createServiceDependency(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
        },
    })

    return {
        createDependency: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useUpdateServiceDependency() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({
            id,
            request,
        }: {
            id: string
            request: UpdateServiceDependencyRequest
        }) => updateServiceDependency(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
        },
    })

    return {
        updateDependency: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useDeleteServiceDependency() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => deleteServiceDependency(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
        },
    })

    return {
        deleteDependency: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}
