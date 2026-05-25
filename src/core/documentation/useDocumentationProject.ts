import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getDocumentationProjects,
    getDocumentationProjectById,
    createDocumentationProject,
    updateDocumentationProject,
    deleteDocumentationProject,
    CreateDocumentationProjectRequest,
    UpdateDocumentationProjectRequest,
} from "@apidex/core/documentation/data"

export function useDocumentationProjects() {
    const query = useQuery({
        queryKey: ["documentationProjects"],
        queryFn: getDocumentationProjects,
    })

    return {
        projects: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    }
}

export function useDocumentationProjectById(id: string | undefined) {
    const query = useQuery({
        queryKey: ["documentationProject", id],
        queryFn: () => getDocumentationProjectById(id!),
        enabled: !!id,
    })

    return {
        project: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    }
}

export function useCreateDocumentationProject() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (request: CreateDocumentationProjectRequest) =>
            createDocumentationProject(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProjects"] })
        },
    })

    return {
        createProject: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useUpdateDocumentationProject() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({
            id,
            request,
        }: {
            id: string
            request: UpdateDocumentationProjectRequest
        }) => updateDocumentationProject(id, request),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["documentationProjects"] })
            queryClient.invalidateQueries({
                queryKey: ["documentationProject", variables.id],
            })
        },
    })

    return {
        updateProject: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

export function useDeleteDocumentationProject() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => deleteDocumentationProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentationProjects"] })
        },
    })

    return {
        deleteProject: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}
