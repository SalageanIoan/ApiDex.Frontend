import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import SettingsIcon from "@mui/icons-material/Settings"
import StorageIcon from "@mui/icons-material/Storage"
import SyncIcon from "@mui/icons-material/Sync"
import DeleteIcon from "@mui/icons-material/Delete"
import {
    aiRepository,
    RagModelDescriptor,
    RagSettingsResponse,
} from "@apidex/core/documentation/data/repositories/aiRepository"
import { getDocumentationProjects } from "@apidex/core/documentation/data/repositories/documentationProjectRepository"
import { DocumentationProjectSummary } from "@apidex/core/documentation/data/models"

const DEFAULT_MODELS = ["OpenAi", "Local", "LocalBgeBase"]
const DEFAULT_CONTEXT_MODES = ["Compact", "Expanded", "Comprehensive"]
const DEFAULT_MODEL_DESCRIPTORS: RagModelDescriptor[] = [
    {
        type: "OpenAi",
        key: "openai-text-embedding-3-small",
        dimensions: 1536,
        offline: false,
    },
    {
        type: "Local",
        key: "local-bge-micro-v2",
        dimensions: 384,
        offline: true,
    },
    {
        type: "LocalBgeBase",
        key: "local-bge-base-en-v1.5",
        dimensions: 768,
        offline: true,
    },
]
const DEFAULT_RAG_SETTINGS: RagSettingsResponse = {
    activeModel: "OpenAi",
    contextMode: "Compact",
    availableModels: DEFAULT_MODELS,
    availableContextModes: DEFAULT_CONTEXT_MODES,
    modelDescriptors: DEFAULT_MODEL_DESCRIPTORS,
}

export default function Settings() {
    const settingsQuery = useQuery({
        queryKey: ["ragSettings"],
        queryFn: aiRepository.getRagSettings,
    })
    const projectsQuery = useQuery({
        queryKey: ["documentationProjects"],
        queryFn: getDocumentationProjects,
    })

    if (settingsQuery.isLoading || projectsQuery.isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        )
    }

    const initialError =
        settingsQuery.isError || projectsQuery.isError
            ? "Failed to load settings."
            : null

    return (
        <SettingsContent
            key={`${settingsQuery.data?.activeModel ?? "default"}-${projectsQuery.data?.length ?? 0}-${initialError ?? "ok"}`}
            settings={normalizeSettings(settingsQuery.data)}
            projects={projectsQuery.data ?? []}
            initialError={initialError}
        />
    )
}

type SettingsContentProps = {
    settings: RagSettingsResponse
    projects: DocumentationProjectSummary[]
    initialError: string | null
}

function SettingsContent({
    settings,
    projects,
    initialError,
}: SettingsContentProps) {
    const [saving, setSaving] = useState(false)
    const [indexActionLoading, setIndexActionLoading] = useState(false)
    const [activeModel, setActiveModel] = useState(settings.activeModel)
    const [contextMode, setContextMode] = useState(settings.contextMode)
    const [selectedProjectId, setSelectedProjectId] = useState("")
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(initialError)

    const availableModels = settings.availableModels?.length
        ? settings.availableModels
        : DEFAULT_MODELS
    const availableContextModes = settings.availableContextModes?.length
        ? settings.availableContextModes
        : DEFAULT_CONTEXT_MODES
    const effectiveProjectId = selectedProjectId || projects[0]?.id || ""
    const selectedProject = useMemo(
        () => projects.find(project => project.id === effectiveProjectId),
        [projects, effectiveProjectId]
    )
    const indexStatusQuery = useQuery({
        queryKey: ["projectIndexStatus", effectiveProjectId],
        queryFn: () => aiRepository.getProjectIndexStatus(effectiveProjectId),
        enabled: !!effectiveProjectId,
    })
    const indexStatus = indexStatusQuery.data ?? null
    const indexLoading = indexActionLoading || indexStatusQuery.isFetching

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setMessage(null)
        try {
            await aiRepository.updateRagSettings(activeModel, contextMode)
            setMessage("Settings saved.")
        } catch (err) {
            console.error(err)
            setError("Failed to save settings.")
        } finally {
            setSaving(false)
        }
    }

    const handleIndexProject = async () => {
        if (!effectiveProjectId) return

        setIndexActionLoading(true)
        setError(null)
        setMessage(null)
        try {
            await aiRepository.indexProject(effectiveProjectId)
            await indexStatusQuery.refetch()
            setMessage(`${selectedProject?.title ?? "Project"} indexed.`)
        } catch (err) {
            console.error(err)
            setError("Failed to index project.")
        } finally {
            setIndexActionLoading(false)
        }
    }

    const handleClearProjectIndex = async () => {
        if (!effectiveProjectId) return

        const confirmed = window.confirm(`Clear Qdrant and Neo4j data for ${selectedProject?.title ?? "this project"}?`)
        if (!confirmed) return

        setIndexActionLoading(true)
        setError(null)
        setMessage(null)
        try {
            await aiRepository.clearProjectIndex(effectiveProjectId)
            await indexStatusQuery.refetch()
            setMessage(`${selectedProject?.title ?? "Project"} index cleared.`)
        } catch (err) {
            console.error(err)
            setError("Failed to clear project index.")
        } finally {
            setIndexActionLoading(false)
        }
    }

    return (
        <Box sx={{ p: 4, maxWidth: 980, mx: "auto" }}>
            <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SettingsIcon fontSize="large" /> System Settings
            </Typography>

            <Stack spacing={3} sx={{ mt: 4 }}>
                {error && <Alert severity="error">{error}</Alert>}
                {indexStatusQuery.isError && <Alert severity="error">Failed to load project index status.</Alert>}
                {message && <Alert severity="success">{message}</Alert>}

                <Paper sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Typography variant="h6">RAG Runtime</Typography>

                        <FormControl fullWidth>
                            <InputLabel id="embedding-model-label">Embedding Model</InputLabel>
                            <Select
                                labelId="embedding-model-label"
                                value={activeModel}
                                label="Embedding Model"
                                onChange={(event) => setActiveModel(event.target.value)}
                            >
                                {availableModels.map((model) => (
                                    <MenuItem key={model} value={model}>
                                        {getEmbeddingModelLabel(model, settings.modelDescriptors)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="context-mode-label">RAG Context Mode</InputLabel>
                            <Select
                                labelId="context-mode-label"
                                value={contextMode}
                                label="RAG Context Mode"
                                onChange={(event) => setContextMode(event.target.value)}
                            >
                                {availableContextModes.map((mode) => (
                                    <MenuItem key={mode} value={mode}>
                                        {getContextModeLabel(mode)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button variant="contained" onClick={handleSave} disabled={saving}>
                                {saving ? <CircularProgress size={24} /> : "Save Settings"}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>

                <Paper sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Typography variant="h6">Index Management</Typography>

                        <FormControl fullWidth disabled={projects.length === 0}>
                            <InputLabel id="project-index-label">Project</InputLabel>
                            <Select
                                labelId="project-index-label"
                                value={effectiveProjectId}
                                label="Project"
                                onChange={(event) => setSelectedProjectId(event.target.value)}
                            >
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <MetricCard label="Active model chunks" value={indexStatus?.activeCount} loading={indexLoading} />
                            <MetricCard label="All model chunks" value={indexStatus?.allModelsCount} loading={indexLoading} />
                        </Box>

                        <Divider />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap" }}>
                            <Button
                                variant="outlined"
                                startIcon={<StorageIcon />}
                                onClick={() => void indexStatusQuery.refetch()}
                                disabled={!effectiveProjectId || indexLoading}
                            >
                                Refresh Index
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<SyncIcon />}
                                onClick={handleIndexProject}
                                disabled={!effectiveProjectId || indexLoading}
                            >
                                Sync Project
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleClearProjectIndex}
                                disabled={!effectiveProjectId || indexLoading}
                            >
                                Clear Index
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    )
}

function MetricCard({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
    return (
        <Box
            sx={{
                minWidth: 220,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
            }}
        >
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
                {loading ? <CircularProgress size={22} /> : value ?? "-"}
            </Typography>
        </Box>
    )
}

function normalizeSettings(settings?: RagSettingsResponse): RagSettingsResponse {
    const availableModels = unique([
        ...(settings?.availableModels ?? []),
        ...DEFAULT_RAG_SETTINGS.availableModels,
    ])

    return {
        activeModel: settings?.activeModel ?? DEFAULT_RAG_SETTINGS.activeModel,
        contextMode: settings?.contextMode ?? DEFAULT_RAG_SETTINGS.contextMode,
        availableModels,
        availableContextModes: settings?.availableContextModes ?? DEFAULT_RAG_SETTINGS.availableContextModes,
        modelDescriptors: mergeModelDescriptors(settings?.modelDescriptors),
    }
}

function getEmbeddingModelLabel(model: string, descriptors: RagModelDescriptor[] = []) {
    const descriptor = descriptors.find(item => item.type === model)
    if (!descriptor) return getEmbeddingModelName(model)

    const location = descriptor.offline ? "local" : "remote"
    return `${getEmbeddingModelName(model)} (${descriptor.key}, ${descriptor.dimensions} dimensions, ${location})`
}

function getEmbeddingModelName(model: string) {
    const labels: Record<string, string> = {
        OpenAi: "OpenAI",
        Local: "Local BGE Micro",
        LocalBgeBase: "Local BGE Base",
    }

    return labels[model] ?? model
}

function mergeModelDescriptors(descriptors?: RagModelDescriptor[]) {
    const byType = new Map(DEFAULT_MODEL_DESCRIPTORS.map(descriptor => [descriptor.type, descriptor]))
    for (const descriptor of descriptors ?? []) {
        byType.set(descriptor.type, descriptor)
    }

    return Array.from(byType.values())
}

function unique(values: string[]) {
    return Array.from(new Set(values))
}

function getContextModeLabel(mode: string) {
    const labels: Record<string, string> = {
        Compact: "Compact",
        Expanded: "Expanded",
        Comprehensive: "Comprehensive",
    }

    return labels[mode] ?? mode
}
