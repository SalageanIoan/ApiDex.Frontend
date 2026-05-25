import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    Box,
    Button,
    Typography,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Alert,
    Tooltip,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ApiIcon from "@mui/icons-material/Api"
import BoltIcon from "@mui/icons-material/Bolt"
import LinkIcon from "@mui/icons-material/Link"
import {
    EServiceEventDirection,
    ServiceEventDirectionLabels,
    ServiceDependencyTypeLabels,
} from "@apidex/core/models"
import { ConfirmDeleteDialog } from "@apidex/core/components"
import {
    useServiceDocumentationById,
    useDeleteServiceDocumentation,
    useCreateServiceEndpoint,
    useUpdateServiceEndpoint,
    useDeleteServiceEndpoint,
    useServiceEndpointsByProjectId,
    useCreateServiceEvent,
    useUpdateServiceEvent,
    useDeleteServiceEvent,
    useCreateServiceDependency,
    useUpdateServiceDependency,
    useDeleteServiceDependency,
} from "../hooks"
import {
    ServiceEndpointDetail,
    ServiceEventDetail,
    ServiceDependencyDetail,
    CreateServiceEndpointRequest,
    UpdateServiceEndpointRequest,
    CreateServiceEventRequest,
    UpdateServiceEventRequest,
    CreateServiceDependencyRequest,
    UpdateServiceDependencyRequest,
} from "@apidex/core/documentation/data"
import { EndpointFormDialog } from "./EndpointFormDialog"
import { EventFormDialog } from "./EventFormDialog"
import { DependencyFormDialog } from "./DependencyFormDialog"

const HTTP_METHOD_COLORS: Record<string, string> = {
    GET: "#3FB950",
    POST: "#58A6FF",
    PUT: "#D29922",
    PATCH: "#D29922",
    DELETE: "#F85149",
}

export function ServiceDetail() {
    const { projectId, serviceId } = useParams<{
        projectId: string
        serviceId: string
    }>()
    const navigate = useNavigate()
    const { service, isLoading, isError } =
        useServiceDocumentationById(serviceId)
    const { deleteService, isLoading: isDeletingService } =
        useDeleteServiceDocumentation()

    const { createEndpoint, isLoading: isCreatingEndpoint } =
        useCreateServiceEndpoint()
    const { updateEndpoint, isLoading: isUpdatingEndpoint } =
        useUpdateServiceEndpoint()
    const { deleteEndpoint, isLoading: isDeletingEndpoint } =
        useDeleteServiceEndpoint()

    const { createEvent, isLoading: isCreatingEvent } =
        useCreateServiceEvent()
    const { updateEvent, isLoading: isUpdatingEvent } =
        useUpdateServiceEvent()
    const { deleteEvent, isLoading: isDeletingEvent } =
        useDeleteServiceEvent()

    const { createDependency, isLoading: isCreatingDependency } =
        useCreateServiceDependency()
    const { updateDependency, isLoading: isUpdatingDependency } =
        useUpdateServiceDependency()
    const { deleteDependency, isLoading: isDeletingDependency } =
        useDeleteServiceDependency()

    const { endpoints: allProjectEndpoints } = useServiceEndpointsByProjectId(projectId)

    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false)
    const [endpointDialog, setEndpointDialog] = useState(false)
    const [editingEndpoint, setEditingEndpoint] =
        useState<ServiceEndpointDetail | null>(null)
    const [deletingEndpointId, setDeletingEndpointId] = useState<string | null>(
        null
    )

    const [eventDialog, setEventDialog] = useState(false)
    const [editingEvent, setEditingEvent] =
        useState<ServiceEventDetail | null>(null)
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null)

    const [dependencyDialog, setDependencyDialog] = useState(false)
    const [editingDependency, setEditingDependency] =
        useState<ServiceDependencyDetail | null>(null)
    const [deletingDependencyId, setDeletingDependencyId] = useState<
        string | null
    >(null)

    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: "success" | "error"
    }>({ open: false, message: "", severity: "success" })

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity })
    }

    const serviceEndpoints = service?.endpoints ?? []

    const otherServicesEndpoints = allProjectEndpoints.filter(
        (ep) => ep.serviceDocumentationId !== serviceId
    )

    const handleDeleteService = async () => {
        if (!serviceId) return
        try {
            await deleteService(serviceId)
            showSnackbar("Service deleted", "success")
            navigate(`/projects/${projectId}`)
        } catch {
            showSnackbar("Failed to delete service", "error")
        }
        setDeleteServiceDialog(false)
    }

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

    const handleSaveEvent = async (
        request: CreateServiceEventRequest | UpdateServiceEventRequest
    ) => {
        try {
            if (editingEvent) {
                await updateEvent({
                    id: editingEvent.id,
                    request: request as UpdateServiceEventRequest,
                })
                showSnackbar("Event updated", "success")
            } else {
                await createEvent(request as CreateServiceEventRequest)
                showSnackbar("Event created", "success")
            }
            setEventDialog(false)
            setEditingEvent(null)
        } catch {
            showSnackbar("Failed to save event", "error")
        }
    }

    const handleDeleteEvent = async () => {
        if (!deletingEventId) return
        try {
            await deleteEvent(deletingEventId)
            showSnackbar("Event deleted", "success")
        } catch {
            showSnackbar("Failed to delete event", "error")
        }
        setDeletingEventId(null)
    }

    const handleSaveDependency = async (
        request:
            | CreateServiceDependencyRequest
            | UpdateServiceDependencyRequest
    ) => {
        try {
            if (editingDependency) {
                await updateDependency({
                    id: editingDependency.id,
                    request: request as UpdateServiceDependencyRequest,
                })
                showSnackbar("Dependency updated", "success")
            } else {
                await createDependency(
                    request as CreateServiceDependencyRequest
                )
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

    if (isError || !service) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" color="error" sx={{ mb: 2 }}>
                    Failed to load service
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/projects/${projectId}`)}
                    startIcon={<ArrowBackIcon />}
                >
                    Back to Project
                </Button>
            </Box>
        )
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

            {/* Service Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {service.title}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ maxWidth: 700, lineHeight: 1.8 }}
                    >
                        {service.generalDescription}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, ml: 2, flexShrink: 0 }}>
                    <Tooltip title="Edit service">
                        <IconButton
                            id="edit-service-button"
                            onClick={() =>
                                navigate(
                                    `/projects/${projectId}/services/${serviceId}/edit`
                                )
                            }
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete service">
                        <IconButton
                            id="delete-service-button"
                            onClick={() => setDeleteServiceDialog(true)}
                            color="error"
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Endpoints Section */}
            <Box sx={{ mb: 5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ApiIcon sx={{ color: "primary.main" }} />
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Endpoints
                        </Typography>
                        {service.endpoints && (
                            <Chip
                                label={service.endpoints.length}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                    <Button
                        id="add-endpoint-button"
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditingEndpoint(null)
                            setEndpointDialog(true)
                        }}
                    >
                        Add Endpoint
                    </Button>
                </Box>

                {service.endpoints && service.endpoints.length > 0 ? (
                    <TableContainer
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={100}>Method</TableCell>
                                    <TableCell>Route</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell width={100} align="right">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {service.endpoints.map((ep) => (
                                    <TableRow key={ep.id} hover>
                                        <TableCell>
                                            <Chip
                                                label={ep.httpMethod}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        HTTP_METHOD_COLORS[
                                                            ep.httpMethod
                                                        ] + "22",
                                                    color: HTTP_METHOD_COLORS[
                                                        ep.httpMethod
                                                    ],
                                                    fontWeight: 700,
                                                    fontFamily: "monospace",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: "0.8rem",
                                                color: "primary.main",
                                            }}
                                        >
                                            {ep.route}
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: 300,
                                                }}
                                            >
                                                {ep.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setEditingEndpoint(ep)
                                                        setEndpointDialog(true)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        setDeletingEndpointId(
                                                            ep.id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 4,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            No endpoints defined yet
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Events Section */}
            <Box sx={{ mb: 5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BoltIcon sx={{ color: "warning.main" }} />
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Events
                        </Typography>
                        {service.events && (
                            <Chip
                                label={service.events.length}
                                size="small"
                                color="warning"
                                variant="outlined"
                            />
                        )}
                    </Box>
                    <Button
                        id="add-event-button"
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditingEvent(null)
                            setEventDialog(true)
                        }}
                    >
                        Add Event
                    </Button>
                </Box>

                {service.events && service.events.length > 0 ? (
                    <TableContainer
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell width={120}>Direction</TableCell>
                                    <TableCell>Endpoints</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell width={100} align="right">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {service.events.map((ev) => (
                                    <TableRow key={ev.id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            {ev.name}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={
                                                    ServiceEventDirectionLabels[
                                                        ev.direction
                                                    ]
                                                }
                                                size="small"
                                                color={
                                                    ev.direction ===
                                                    EServiceEventDirection.Published
                                                        ? "success"
                                                        : "info"
                                                }
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                                {serviceEndpoints
                                                    .filter((endpoint) =>
                                                        ev.serviceEndpointIds.includes(
                                                            endpoint.id
                                                        )
                                                    )
                                                    .map((endpoint) => (
                                                        <Chip
                                                            key={endpoint.id}
                                                            size="small"
                                                            label={`${endpoint.httpMethod} ${endpoint.route}`}
                                                            variant="outlined"
                                                            sx={{
                                                                fontFamily: "monospace",
                                                                color:
                                                                    HTTP_METHOD_COLORS[
                                                                        endpoint
                                                                            .httpMethod
                                                                    ],
                                                            }}
                                                        />
                                                    ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {ev.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setEditingEvent(ev)
                                                        setEventDialog(true)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        setDeletingEventId(
                                                            ev.id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 4,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            No events defined yet
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Dependencies Section */}
            <Box sx={{ mb: 5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinkIcon sx={{ color: "info.main" }} />
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Dependencies
                        </Typography>
                        {service.dependencies && (
                            <Chip
                                label={service.dependencies.length}
                                size="small"
                                color="info"
                                variant="outlined"
                            />
                        )}
                    </Box>
                    <Button
                        id="add-dependency-button"
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditingDependency(null)
                            setDependencyDialog(true)
                        }}
                    >
                        Add Dependency
                    </Button>
                </Box>

                {service.dependencies && service.dependencies.length > 0 ? (
                    <TableContainer
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={140}>Type</TableCell>
                                    <TableCell>Target Service</TableCell>
                                    <TableCell>Target Route</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell width={100} align="right">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {service.dependencies.map((dep) => {
                                    const targetEndpoint = dep.targetEndpointId
                                        ? allProjectEndpoints.find(
                                              (ep) =>
                                                  ep.id === dep.targetEndpointId
                                          )
                                        : null
                                    const targetServiceTitle =
                                        dep.targetServiceTitle ??
                                        targetEndpoint?.serviceTitle ??
                                        "—"
                                    const targetEndpointRoute =
                                        dep.targetEndpointRoute ??
                                        targetEndpoint?.route ??
                                        "—"

                                    return (
                                        <TableRow key={dep.id} hover>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        ServiceDependencyTypeLabels[
                                                            dep.dependencyType
                                                        ]
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                    color="info"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {targetServiceTitle}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontFamily: "monospace",
                                                    fontSize: "0.8rem",
                                                    color: "primary.main",
                                            }}
                                        >
                                                {targetEndpointRoute}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {dep.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setEditingDependency(
                                                                dep
                                                            )
                                                            setDependencyDialog(
                                                                true
                                                            )
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            setDeletingDependencyId(
                                                                dep.id
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 4,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            No dependencies defined yet
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Dialogs */}
            <ConfirmDeleteDialog
                open={deleteServiceDialog}
                title="Delete Service"
                description={`Are you sure you want to delete "${service.title}"? This will also delete all its endpoints, events, and dependencies.`}
                isLoading={isDeletingService}
                onConfirm={handleDeleteService}
                onCancel={() => setDeleteServiceDialog(false)}
            />

            <EndpointFormDialog
                open={endpointDialog}
                serviceDocumentationId={serviceId ?? ""}
                endpoint={editingEndpoint}
                isLoading={isCreatingEndpoint || isUpdatingEndpoint}
                onSave={handleSaveEndpoint}
                onCancel={() => {
                    setEndpointDialog(false)
                    setEditingEndpoint(null)
                }}
            />

            <ConfirmDeleteDialog
                open={!!deletingEndpointId}
                title="Delete Endpoint"
                description="Are you sure you want to delete this endpoint?"
                isLoading={isDeletingEndpoint}
                onConfirm={handleDeleteEndpoint}
                onCancel={() => setDeletingEndpointId(null)}
            />

            <EventFormDialog
                open={eventDialog}
                serviceDocumentationId={serviceId ?? ""}
                serviceEndpoints={serviceEndpoints}
                event={editingEvent}
                isLoading={isCreatingEvent || isUpdatingEvent}
                onSave={handleSaveEvent}
                onCancel={() => {
                    setEventDialog(false)
                    setEditingEvent(null)
                }}
            />

            <ConfirmDeleteDialog
                open={!!deletingEventId}
                title="Delete Event"
                description="Are you sure you want to delete this event?"
                isLoading={isDeletingEvent}
                onConfirm={handleDeleteEvent}
                onCancel={() => setDeletingEventId(null)}
            />

            <DependencyFormDialog
                open={dependencyDialog}
                serviceDocumentationId={serviceId ?? ""}
                serviceEndpoints={serviceEndpoints}
                otherServicesEndpoints={otherServicesEndpoints}
                dependency={editingDependency}
                isLoading={isCreatingDependency || isUpdatingDependency}
                onSave={handleSaveDependency}
                onCancel={() => {
                    setDependencyDialog(false)
                    setEditingDependency(null)
                }}
            />

            <ConfirmDeleteDialog
                open={!!deletingDependencyId}
                title="Delete Dependency"
                description="Are you sure you want to delete this dependency?"
                isLoading={isDeletingDependency}
                onConfirm={handleDeleteDependency}
                onCancel={() => setDeletingDependencyId(null)}
            />

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
