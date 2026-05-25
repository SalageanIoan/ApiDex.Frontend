import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import { useCreateServiceDocumentation } from "../hooks"

export function ServiceForm() {
    const { projectId } = useParams<{
        projectId: string
    }>()
    const navigate = useNavigate()

    const { createService, isLoading: isCreating } =
        useCreateServiceDocumentation()

    const [title, setTitle] = useState("")
    const [generalDescription, setGeneralDescription] = useState("")
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: "success" | "error"
    }>({ open: false, message: "", severity: "success" })

    if (!projectId) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <CircularProgress />
            </Box>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await createService({
                documentationProjectId: projectId,
                title,
                generalDescription,
            })
            setSnackbar({
                open: true,
                message: "Service created successfully",
                severity: "success",
            })
            navigate(`/projects/${projectId}`)
        } catch {
            setSnackbar({
                open: true,
                message: "Failed to create service",
                severity: "error",
            })
        }
    }

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/projects/${projectId}`)}
                sx={{ mb: 3, color: "text.secondary" }}
            >
                Back to Project
            </Button>

            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
                New Service
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
                    id="service-title-input"
                    label="Service Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Order Service"
                />

                <TextField
                    id="service-description-input"
                    label="General Description"
                    value={generalDescription}
                    onChange={(e) => setGeneralDescription(e.target.value)}
                    required
                    multiline
                    rows={4}
                    placeholder="Describe what this service does..."
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                        id="save-service-button"
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={isCreating || !title.trim()}
                        sx={{ px: 4 }}
                    >
                        {isCreating ? "Creating..." : "Create Service"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/projects/${projectId}`)}
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
