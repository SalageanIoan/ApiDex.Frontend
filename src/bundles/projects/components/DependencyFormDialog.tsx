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
    Switch,
    ListSubheader,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import LinkIcon from "@mui/icons-material/Link"
import {
    EServiceDependencyType,
    ServiceDependencyTypeLabels,
} from "@apidex/core/models"
import {
    ServiceDependencyDetail,
    CreateServiceDependencyRequest,
    UpdateServiceDependencyRequest,
    ServiceEndpointDetail,
} from "@apidex/core/documentation/data"

const HTTP_METHOD_COLORS: Record<string, string> = {
    GET: "#3FB950",
    POST: "#58A6FF",
    PUT: "#D29922",
    PATCH: "#D29922",
    DELETE: "#F85149",
}

function getValidEndpointId(
    endpointId: string | null | undefined,
    endpoints: ServiceEndpointDetail[]
) {
    if (
        endpointId &&
        endpoints.some((endpoint) => endpoint.id === endpointId)
    ) {
        return endpointId
    }

    return endpoints[0]?.id ?? ""
}

function EndpointMenuItem({ ep }: { ep: ServiceEndpointDetail }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
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
    )
}

type DependencyFormDialogProps = {
    open: boolean
    serviceDocumentationId: string
    serviceEndpoints: ServiceEndpointDetail[]
    otherServicesEndpoints: ServiceEndpointDetail[]
    externalOnly?: boolean
    dependency?: ServiceDependencyDetail | null
    isLoading: boolean
    onSave: (
        request: CreateServiceDependencyRequest | UpdateServiceDependencyRequest
    ) => void
    onCancel: () => void
}

export function DependencyFormDialog({
    open,
    ...props
}: DependencyFormDialogProps) {
    if (!open) return null

    return (
        <DependencyFormDialogContent
            key={`${props.dependency?.id ?? "new-dependency"}-${props.serviceEndpoints.map((endpoint) => endpoint.id).join("-")}-${props.otherServicesEndpoints.map((endpoint) => endpoint.id).join("-")}-${props.externalOnly ? "external" : "internal"}`}
            open={open}
            {...props}
        />
    )
}

function DependencyFormDialogContent({
    open,
    serviceDocumentationId,
    serviceEndpoints,
    otherServicesEndpoints,
    externalOnly = false,
    dependency,
    isLoading,
    onSave,
    onCancel,
}: DependencyFormDialogProps) {
    const isEditing = !!dependency
    const initialSourceEndpointId = getValidEndpointId(
        dependency?.sourceEndpointId,
        serviceEndpoints
    )
    const initialTargetEndpointId = getValidEndpointId(
        dependency?.targetEndpointId,
        otherServicesEndpoints
    )
    const initialIsExternal =
        externalOnly || (!!dependency && !initialTargetEndpointId)

    const [sourceEndpointId, setSourceEndpointId] = useState(initialSourceEndpointId)
    const [dependencyType, setDependencyType] = useState<EServiceDependencyType>(
        dependency?.dependencyType ?? EServiceDependencyType.HttpCall
    )
    const [isExternal, setIsExternal] = useState(initialIsExternal)
    const [targetEndpointId, setTargetEndpointId] = useState<string>(
        initialIsExternal ? "" : initialTargetEndpointId
    )
    const [externalServiceTitle, setExternalServiceTitle] = useState(
        initialIsExternal ? dependency?.targetServiceTitle ?? "" : ""
    )
    const [externalEndpointRoute, setExternalEndpointRoute] = useState(
        initialIsExternal ? dependency?.targetEndpointRoute ?? "" : ""
    )
    const [description, setDescription] = useState(dependency?.description ?? "")

    const isValid =
        !!sourceEndpointId &&
        !!description.trim() &&
        (isExternal
            ? !!externalServiceTitle.trim() && !!externalEndpointRoute.trim()
            : !!targetEndpointId)

    const selectedSource = serviceEndpoints.find(e => e.id === sourceEndpointId)
    const selectedTarget = otherServicesEndpoints.find(e => e.id === targetEndpointId)

    const handleSubmit = () => {
        const payload = {
            sourceEndpointId,
            dependencyType,
            targetEndpointId: isExternal ? null : targetEndpointId || null,
            targetServiceTitle: isExternal
                ? externalServiceTitle.trim()
                : selectedTarget?.serviceTitle ?? null,
            targetEndpointRoute: isExternal
                ? externalEndpointRoute.trim()
                : selectedTarget?.route ?? null,
            description,
        }
        if (isEditing) {
            onSave(payload as UpdateServiceDependencyRequest)
        } else {
            onSave({ serviceDocumentationId, ...payload } as CreateServiceDependencyRequest)
        }
    }

    const grouped = otherServicesEndpoints.reduce<Record<string, ServiceEndpointDetail[]>>(
        (acc, ep) => {
            const key = ep.serviceTitle
            if (!acc[key]) acc[key] = []
            acc[key].push(ep)
            return acc
        },
        {}
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
                            bgcolor: "rgba(91, 105, 248, 0.12)",
                            display: "flex",
                        }}
                    >
                        <AccountTreeIcon sx={{ color: "#5B69F8", fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEditing ? "Edit Dependency" : "New Dependency"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {externalOnly
                                ? "Link an endpoint to an external dependency"
                                : "Link an endpoint to another service's endpoint"}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <Divider sx={{ mt: 2 }} />

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>

                <FormControl fullWidth required>
                    <InputLabel id="dep-source-label" shrink>Source Endpoint (this service)</InputLabel>
                    <Select
                        labelId="dep-source-label"
                        value={sourceEndpointId}
                        onChange={(e) => setSourceEndpointId(e.target.value)}
                        label="Source Endpoint (this service)"
                        disabled={serviceEndpoints.length === 0}
                        renderValue={() =>
                            selectedSource ? <EndpointMenuItem ep={selectedSource} /> : (
                                <Typography color="text.secondary" variant="body2">
                                    {serviceEndpoints.length === 0 ? "No endpoints" : "Select source"}
                                </Typography>
                            )
                        }
                    >
                        {serviceEndpoints.map(ep => (
                            <MenuItem key={ep.id} value={ep.id}>
                                <EndpointMenuItem ep={ep} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="dep-type-label" shrink>Dependency Type</InputLabel>
                    <Select
                        labelId="dep-type-label"
                        value={dependencyType}
                        onChange={(e) => setDependencyType(e.target.value as EServiceDependencyType)}
                        label="Dependency Type"
                        renderValue={(val) => (
                            <Chip
                                label={ServiceDependencyTypeLabels[val as EServiceDependencyType]}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        )}
                    >
                        {Object.entries(ServiceDependencyTypeLabels).map(([value, label]) => (
                            <MenuItem key={value} value={Number(value)}>
                                <Chip label={label} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {!externalOnly && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: isExternal ? "primary.dark" : "divider",
                            bgcolor: isExternal ? "rgba(91,105,248,0.06)" : "transparent",
                            transition: "all 0.2s",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinkIcon sx={{ color: isExternal ? "primary.light" : "text.disabled", fontSize: 18 }} />
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    External Target
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Target is outside this project
                                </Typography>
                            </Box>
                        </Box>
                        <Switch
                            checked={isExternal}
                            onChange={(e) => {
                                setIsExternal(e.target.checked)
                                if (!e.target.checked) {
                                    setTargetEndpointId(otherServicesEndpoints[0]?.id ?? "")
                                }
                            }}
                            size="small"
                        />
                    </Box>
                )}

                {!isExternal && (
                    <FormControl fullWidth required>
                        <InputLabel id="dep-target-label" shrink>Target Endpoint (other service)</InputLabel>
                        <Select
                            labelId="dep-target-label"
                            value={targetEndpointId}
                            onChange={(e) => setTargetEndpointId(e.target.value)}
                            label="Target Endpoint (other service)"
                            disabled={otherServicesEndpoints.length === 0}
                            renderValue={() =>
                                selectedTarget ? (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                                        <Chip
                                            label={selectedTarget.serviceTitle}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: "0.7rem", height: 20 }}
                                        />
                                        <EndpointMenuItem ep={selectedTarget} />
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary" variant="body2">
                                        {otherServicesEndpoints.length === 0
                                            ? "No endpoints in other services"
                                            : "Select target endpoint"}
                                    </Typography>
                                )
                            }
                        >
                            {otherServicesEndpoints.length === 0 ? (
                                <MenuItem disabled>
                                    <Typography variant="body2" color="text.secondary">
                                        No endpoints available in other services.
                                    </Typography>
                                </MenuItem>
                            ) : (
                                Object.entries(grouped).map(([serviceTitle, eps]) => [
                                    <ListSubheader key={`header-${serviceTitle}`} sx={{ bgcolor: "#0D1117", lineHeight: "30px" }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.light", letterSpacing: 0.5, textTransform: "uppercase" }}>
                                            {serviceTitle}
                                        </Typography>
                                    </ListSubheader>,
                                    ...eps.map(ep => (
                                        <MenuItem key={ep.id} value={ep.id} sx={{ pl: 3 }}>
                                            <EndpointMenuItem ep={ep} />
                                        </MenuItem>
                                    )),
                                ])
                            )}
                        </Select>
                    </FormControl>
                )}

                {isExternal && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="External Service Name"
                            value={externalServiceTitle}
                            onChange={(e) => setExternalServiceTitle(e.target.value)}
                            required
                            placeholder="e.g. payment-service"
                        />
                        <TextField
                            label="External Endpoint Route"
                            value={externalEndpointRoute}
                            onChange={(e) => setExternalEndpointRoute(e.target.value)}
                            required
                            placeholder="e.g. /api/payments/charge"
                            slotProps={{ htmlInput: { style: { fontFamily: "monospace" } } }}
                        />
                    </Box>
                )}

                <TextField
                    id="dep-description-input"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    rows={2}
                    placeholder="Describe why this dependency exists and what data flows..."
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
                    disabled={isLoading || !isValid}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
