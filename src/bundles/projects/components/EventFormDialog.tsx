import { useState } from "react"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    Divider,
    Chip,
    Checkbox,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import BoltIcon from "@mui/icons-material/Bolt"
import {
    EServiceEventDirection,
    ServiceEventDirectionLabels,
} from "@apidex/core/models"
import {
    ServiceEventDetail,
    CreateServiceEventRequest,
    UpdateServiceEventRequest,
    ServiceEndpointDetail,
} from "@apidex/core/documentation/data"

const HTTP_METHOD_COLORS: Record<string, string> = {
    GET: "#3FB950",
    POST: "#58A6FF",
    PUT: "#D29922",
    PATCH: "#D29922",
    DELETE: "#F85149",
}

function getValidEndpointIds(
    endpointIds: string[] | null | undefined,
    endpoints: ServiceEndpointDetail[]
) {
    const availableIds = new Set(endpoints.map((endpoint) => endpoint.id))
    const validEndpointIds = (endpointIds ?? []).filter((endpointId) =>
        availableIds.has(endpointId)
    )

    return validEndpointIds.length > 0
        ? validEndpointIds
        : endpoints[0]?.id
          ? [endpoints[0].id]
          : []
}

type EventFormDialogProps = {
    open: boolean
    serviceDocumentationId: string
    serviceEndpoints: ServiceEndpointDetail[]
    event?: ServiceEventDetail | null
    isLoading: boolean
    onSave: (
        request: CreateServiceEventRequest | UpdateServiceEventRequest
    ) => void
    onCancel: () => void
}

export function EventFormDialog({
    open,
    ...props
}: EventFormDialogProps) {
    if (!open) return null

    return (
        <EventFormDialogContent
            key={`${props.event?.id ?? "new-event"}-${props.serviceEndpoints.map((endpoint) => endpoint.id).join("-")}`}
            open={open}
            {...props}
        />
    )
}

function EventFormDialogContent({
    open,
    serviceDocumentationId,
    serviceEndpoints,
    event,
    isLoading,
    onSave,
    onCancel,
}: EventFormDialogProps) {
    const isEditing = !!event
    const [name, setName] = useState(event?.name ?? "")
    const [description, setDescription] = useState(event?.description ?? "")
    const [direction, setDirection] = useState<EServiceEventDirection>(
        event?.direction ?? EServiceEventDirection.Published
    )
    const [serviceEndpointIds, setServiceEndpointIds] = useState<string[]>(
        getValidEndpointIds(event?.serviceEndpointIds, serviceEndpoints)
    )

    const handleSubmit = () => {
        if (isEditing) {
            onSave({ serviceEndpointIds, name, description, direction })
        } else {
            onSave({
                serviceDocumentationId,
                serviceEndpointIds,
                name,
                description,
                direction,
            } as CreateServiceEventRequest)
        }
    }

    const selectedEndpoints = serviceEndpoints.filter((endpoint) =>
        serviceEndpointIds.includes(endpoint.id)
    )

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: "#0D1117",
                        backgroundImage: "none",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                    },
                },
            }}
        >
            <DialogTitle sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            p: 0.75,
                            borderRadius: 1.5,
                            bgcolor: "rgba(210, 153, 34, 0.12)",
                            display: "flex",
                        }}
                    >
                        <BoltIcon sx={{ color: "warning.main", fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEditing ? "Edit Event" : "New Event"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isEditing ? "Update event details" : "Attach an event to one or more endpoints"}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <Divider sx={{ mt: 2 }} />

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>
                <FormControl fullWidth required>
                    <InputLabel id="event-endpoint-label" shrink>
                        Triggered by Endpoints
                    </InputLabel>
                    <Select
                        multiple
                        labelId="event-endpoint-label"
                        value={serviceEndpointIds}
                        onChange={(e) => {
                            const value = e.target.value
                            setServiceEndpointIds(
                                typeof value === "string" ? value.split(",") : value
                            )
                        }}
                        label="Triggered by Endpoints"
                        disabled={serviceEndpoints.length === 0}
                        renderValue={() =>
                            selectedEndpoints.length > 0 ? (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                    {selectedEndpoints.map((endpoint) => (
                                        <Chip
                                            key={endpoint.id}
                                            size="small"
                                            label={`${endpoint.httpMethod} ${endpoint.route}`}
                                            sx={{
                                                fontFamily: "monospace",
                                                color: HTTP_METHOD_COLORS[endpoint.httpMethod] ?? "text.primary",
                                            }}
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <Typography color="text.secondary" variant="body2">
                                    {serviceEndpoints.length === 0 ? "No endpoints yet — create one first" : "Select endpoints"}
                                </Typography>
                            )
                        }
                    >
                        {serviceEndpoints.length === 0 ? (
                            <MenuItem disabled>
                                <Typography variant="body2" color="text.secondary">
                                    No endpoints available. Add endpoints first.
                                </Typography>
                            </MenuItem>
                        ) : (
                            serviceEndpoints.map((ep) => (
                                <MenuItem key={ep.id} value={ep.id}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                                        <Checkbox
                                            checked={serviceEndpointIds.includes(ep.id)}
                                            size="small"
                                            sx={{ p: 0.5 }}
                                        />
                                        <Typography
                                            sx={{
                                                color: HTTP_METHOD_COLORS[ep.httpMethod] ?? "text.primary",
                                                fontWeight: 700,
                                                fontFamily: "monospace",
                                                fontSize: "0.78rem",
                                                minWidth: 46,
                                            }}
                                        >
                                            {ep.httpMethod}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: "monospace", flex: 1 }}>
                                            {ep.route}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {ep.key}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                <TextField
                    id="event-name-input"
                    label="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. OrderCreated"
                    helperText="Use PascalCase naming convention"
                />

                <FormControl fullWidth>
                    <InputLabel id="event-direction-label" shrink>
                        Direction
                    </InputLabel>
                    <Select
                        id="event-direction-select"
                        labelId="event-direction-label"
                        value={direction}
                        onChange={(e) =>
                            setDirection(e.target.value as EServiceEventDirection)
                        }
                        label="Direction"
                        renderValue={(val) => (
                            <Chip
                                label={ServiceEventDirectionLabels[val as EServiceEventDirection]}
                                size="small"
                                color={val === EServiceEventDirection.Published ? "success" : "info"}
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        )}
                    >
                        {Object.entries(ServiceEventDirectionLabels).map(
                            ([value, label]) => (
                                <MenuItem key={value} value={Number(value)}>
                                    <Chip
                                        label={label}
                                        size="small"
                                        color={Number(value) === EServiceEventDirection.Published ? "success" : "info"}
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>

                <TextField
                    id="event-description-input"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    rows={3}
                    placeholder="Describe this event, its payload, and when it is triggered..."
                />
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onCancel} variant="outlined" disabled={isLoading} sx={{ borderRadius: 2 }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isLoading || !name.trim() || serviceEndpointIds.length === 0}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
