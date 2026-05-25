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
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import ApiIcon from "@mui/icons-material/Api"
import {
    ServiceEndpointDetail,
    CreateServiceEndpointRequest,
    UpdateServiceEndpointRequest,
} from "@apidex/core/documentation/data"

type EndpointFormDialogProps = {
    open: boolean
    serviceDocumentationId: string
    endpoint?: ServiceEndpointDetail | null
    isLoading: boolean
    onSave: (
        request: CreateServiceEndpointRequest | UpdateServiceEndpointRequest
    ) => void
    onCancel: () => void
}

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"]

const HTTP_METHOD_COLORS: Record<string, string> = {
    GET: "#3FB950",
    POST: "#58A6FF",
    PUT: "#D29922",
    PATCH: "#D29922",
    DELETE: "#F85149",
}

function generateEndpointKey(method: string, route: string) {
    const routeKey = route
        .trim()
        .replace(/[{}]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()

    return `${method.toLowerCase()}-${routeKey || "root"}`.slice(0, 100)
}

export function EndpointFormDialog({
    open,
    ...props
}: EndpointFormDialogProps) {
    if (!open) return null

    return (
        <EndpointFormDialogContent
            key={props.endpoint?.id ?? "new-endpoint"}
            open={open}
            {...props}
        />
    )
}

function EndpointFormDialogContent({
    open,
    serviceDocumentationId,
    endpoint,
    isLoading,
    onSave,
    onCancel,
}: EndpointFormDialogProps) {
    const isEditing = !!endpoint
    const [httpMethod, setHttpMethod] = useState(endpoint?.httpMethod ?? "GET")
    const [route, setRoute] = useState(endpoint?.route ?? "")
    const [description, setDescription] = useState(endpoint?.description ?? "")

    const handleSubmit = () => {
        if (isEditing) {
            onSave({ httpMethod, route, description })
        } else {
            onSave({
                serviceDocumentationId,
                key: generateEndpointKey(httpMethod, route),
                httpMethod,
                route,
                description,
            } as CreateServiceEndpointRequest)
        }
    }

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
                            bgcolor: "rgba(88, 166, 255, 0.12)",
                            display: "flex",
                        }}
                    >
                        <ApiIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEditing ? "Edit Endpoint" : "New Endpoint"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isEditing ? "Update endpoint details" : "Define a new API endpoint"}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <Divider sx={{ mt: 2 }} />

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl sx={{ width: 140, flexShrink: 0 }}>
                        <InputLabel id="http-method-label" shrink>
                            Method
                        </InputLabel>
                        <Select
                            id="endpoint-method-select"
                            labelId="http-method-label"
                            value={httpMethod}
                            onChange={(e) => setHttpMethod(e.target.value)}
                            label="Method"
                            renderValue={(val) => (
                                <Typography
                                    sx={{
                                        color: HTTP_METHOD_COLORS[val] ?? "text.primary",
                                        fontWeight: 700,
                                        fontFamily: "monospace",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {val}
                                </Typography>
                            )}
                        >
                            {HTTP_METHODS.map((method) => (
                                <MenuItem key={method} value={method}>
                                    <Typography
                                        sx={{
                                            color: HTTP_METHOD_COLORS[method],
                                            fontWeight: 700,
                                            fontFamily: "monospace",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        {method}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        sx={{ flex: 1 }}
                        id="endpoint-route-input"
                        label="Route"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        required
                        placeholder="/api/orders/{id}"
                        slotProps={{
                            input: { sx: { fontFamily: "monospace", fontSize: "0.9rem" } },
                        }}
                    />
                </Box>

                <TextField
                    id="endpoint-description-input"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    rows={3}
                    placeholder="Describe what this endpoint does, its inputs and expected outputs..."
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
                    disabled={isLoading || !route.trim() || !description.trim()}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
