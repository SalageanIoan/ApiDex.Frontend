import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import {
    ESystemArchitecture,
    SystemArchitectureLabels,
} from "@apidex/core/models"
import {
    useDocumentationProjectById,
    useCreateDocumentationProject,
    useUpdateDocumentationProject,
} from "@apidex/core/documentation"
import { DocumentationProjectDetail } from "@apidex/core/documentation/data"

export function ProjectForm() {
    const { id } = useParams<{ id: string }>()
    const isEditing = !!id

    const { project, isLoading: isLoadingProject } =
        useDocumentationProjectById(isEditing ? id : undefined)
    const { createProject, isLoading: isCreating } =
        useCreateDocumentationProject()
    const { updateProject, isLoading: isUpdating } =
        useUpdateDocumentationProject()

    if (isEditing && isLoadingProject) {
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

    return (
        <ProjectFormContent
            key={id ?? "new-project"}
            id={id}
            project={project}
            isEditing={isEditing}
            isCreating={isCreating}
            isUpdating={isUpdating}
            createProject={createProject}
            updateProject={updateProject}
        />
    )
}

type ProjectFormContentProps = {
    id: string | undefined
    project: DocumentationProjectDetail | null
    isEditing: boolean
    isCreating: boolean
    isUpdating: boolean
    createProject: ReturnType<typeof useCreateDocumentationProject>["createProject"]
    updateProject: ReturnType<typeof useUpdateDocumentationProject>["updateProject"]
}

function ProjectFormContent({
    id,
    project,
    isEditing,
    isCreating,
    isUpdating,
    createProject,
    updateProject,
}: ProjectFormContentProps) {
    const navigate = useNavigate()
    const [title, setTitle] = useState(project?.title ?? "")
    const [generalDescription, setGeneralDescription] = useState(
        project?.generalDescription ?? ""
    )
    const [architectureType, setArchitectureType] = useState<ESystemArchitecture>(
        project?.architectureType ?? ESystemArchitecture.Distributed
    )
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: "success" | "error"
    }>({ open: false, message: "", severity: "success" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const request = { title, generalDescription, architectureType }

        try {
            if (isEditing && id) {
                await updateProject({ id, request })
                setSnackbar({
                    open: true,
                    message: "Project updated successfully",
                    severity: "success",
                })
                navigate(`/projects/${id}`)
            } else {
                await createProject(request)
                setSnackbar({
                    open: true,
                    message: "Project created successfully",
                    severity: "success",
                })
                navigate("/projects")
            }
        } catch {
            setSnackbar({
                open: true,
                message: `Failed to ${isEditing ? "update" : "create"} project`,
                severity: "error",
            })
        }
    }

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() =>
                    navigate(isEditing ? `/projects/${id}` : "/projects")
                }
                sx={{ mb: 3, color: "text.secondary" }}
            >
                {isEditing ? "Back to Project" : "Back to Projects"}
            </Button>

            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
                {isEditing ? "Edit Project" : "New Documentation Project"}
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 600,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <TextField
                    id="project-title-input"
                    label="Project Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. E-Commerce Platform APIs"
                />

                <TextField
                    id="project-description-input"
                    label="General Description"
                    value={generalDescription}
                    onChange={(e) => setGeneralDescription(e.target.value)}
                    required
                    multiline
                    rows={4}
                    placeholder="Describe the overall purpose and scope of this API documentation..."
                />

                <FormControl fullWidth>
                    <InputLabel id="architecture-type-label" shrink>
                        Architecture Type
                    </InputLabel>
                    <Select
                        id="architecture-type-select"
                        labelId="architecture-type-label"
                        value={architectureType}
                        onChange={(e) =>
                            setArchitectureType(
                                e.target.value as ESystemArchitecture
                            )
                        }
                        label="Architecture Type"
                    >
                        {Object.entries(SystemArchitectureLabels).map(
                            ([value, label]) => (
                                <MenuItem key={value} value={Number(value)}>
                                    {label}
                                </MenuItem>
                            )
                        )}
                    </Select>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                    >
                        {architectureType === ESystemArchitecture.Monolith
                            ? "Monolith — Document API endpoints directly on the project, plus external dependencies when needed."
                            : "Distributed — Organize documentation by service. Each service has its own endpoints, events, and dependencies."}
                    </Typography>
                </FormControl>

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                        id="save-project-button"
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={isCreating || isUpdating || !title.trim()}
                        sx={{ px: 4 }}
                    >
                        {isCreating || isUpdating
                            ? "Saving..."
                            : isEditing
                              ? "Update Project"
                              : "Create Project"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                isEditing ? `/projects/${id}` : "/projects"
                            )
                        }
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
