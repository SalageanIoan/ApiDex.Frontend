import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Snackbar,
    Typography,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { ConfirmDeleteDialog } from "@apidex/core/components"
import { ESystemArchitecture } from "@apidex/core/models"
import { useDeleteDocumentationProject, useDocumentationProjectById } from "@apidex/core/documentation"
import { DistributedServicesSection } from "./projectDetail/DistributedServicesSection"
import { MonolithDocumentationSection } from "./projectDetail/MonolithDocumentationSection"
import { ProjectHeader } from "./projectDetail/ProjectHeader"

export function ProjectDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { project, isLoading, isError } = useDocumentationProjectById(id)
    const { deleteProject, isLoading: isDeleting } = useDeleteDocumentationProject()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: "success" | "error"
    }>({ open: false, message: "", severity: "success" })

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity })
    }

    const handleDelete = async () => {
        if (!id) return

        try {
            await deleteProject(id)
            showSnackbar("Project deleted successfully", "success")
            navigate("/projects")
        } catch {
            showSnackbar("Failed to delete project", "error")
        }

        setDeleteDialogOpen(false)
    }

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (isError || !project) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" color="error" sx={{ mb: 2 }}>
                    Failed to load project
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/projects")}
                    startIcon={<ArrowBackIcon />}
                >
                    Back to Projects
                </Button>
            </Box>
        )
    }

    const isMonolith = project.architectureType === ESystemArchitecture.Monolith
    const implicitService = isMonolith && project.services.length ? project.services[0] : null

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/projects")}
                sx={{ mb: 3, color: "text.secondary" }}
            >
                Back to Projects
            </Button>

            <ProjectHeader
                project={project}
                isMonolith={isMonolith}
                onEdit={() => navigate(`/projects/${id}/edit`)}
                onDelete={() => setDeleteDialogOpen(true)}
            />

            <Divider sx={{ my: 3 }} />

            {isMonolith ? (
                <MonolithDocumentationSection
                    implicitService={implicitService}
                    showSnackbar={showSnackbar}
                />
            ) : (
                <DistributedServicesSection
                    services={project.services}
                    onAddService={() => navigate(`/projects/${id}/services/new`)}
                    onOpenService={(serviceId) => navigate(`/projects/${id}/services/${serviceId}`)}
                />
            )}

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                title="Delete Project"
                description={`Are you sure you want to delete "${project.title}"? This will also delete all ${
                    isMonolith
                        ? "endpoints and external dependencies"
                        : "services, endpoints, events, and dependencies"
                }.`}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((state) => ({ ...state, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar((state) => ({ ...state, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
