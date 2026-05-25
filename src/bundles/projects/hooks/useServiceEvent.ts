import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    createServiceEvent,
    updateServiceEvent,
    deleteServiceEvent,
    CreateServiceEventRequest,
    UpdateServiceEventRequest,
} from "@apidex/core/documentation/data"

export function useCreateServiceEvent() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (request: CreateServiceEventRequest) =>
            createServiceEvent(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
        },
    })

    return {
        createEvent: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useUpdateServiceEvent() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({
            id,
            request,
        }: {
            id: string
            request: UpdateServiceEventRequest
        }) => updateServiceEvent(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
        },
    })

    return {
        updateEvent: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useDeleteServiceEvent() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => deleteServiceEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProject"] })
            queryClient.invalidateQueries({ queryKey: ["serviceDocumentation"] })
        },
    })

    return {
        deleteEvent: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}
