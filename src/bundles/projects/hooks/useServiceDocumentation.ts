import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getServiceDocumentationById,
    createServiceDocumentation,
    updateServiceDocumentation,
    deleteServiceDocumentation,
    CreateServiceDocumentationRequest,
    UpdateServiceDocumentationRequest,
} from "@apidex/core/documentation/data"

export function useServiceDocumentationById(id: string | undefined) {
    const query = useQuery({
        queryKey: ["serviceDocumentation", id],
        queryFn: () => getServiceDocumentationById(id!),
        enabled: !!id,
    })

    return {
        service: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    }
}

export function useCreateServiceDocumentation() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (request: CreateServiceDocumentationRequest) =>
            createServiceDocumentation(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
        },
    })

    return {
        createService: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useUpdateServiceDocumentation() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({
            id,
            request,
        }: {
            id: string
            request: UpdateServiceDocumentationRequest
        }) => updateServiceDocumentation(id, request),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({
                queryKey: ["serviceDocumentation", variables.id],
            })
        },
    })

    return {
        updateService: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useDeleteServiceDocumentation() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => deleteServiceDocumentation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
        },
    })

    return {
        deleteService: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}
