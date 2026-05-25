import {
    Box,
    Button,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import ApiIcon from "@mui/icons-material/Api"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { ServiceEndpointDetail } from "@apidex/core/documentation/data"
import { HTTP_METHOD_COLORS } from "./constants"

type MonolithEndpointsSectionProps = {
    endpoints: ServiceEndpointDetail[]
    canAdd: boolean
    onAdd: () => void
    onEdit: (endpoint: ServiceEndpointDetail) => void
    onDelete: (endpointId: string) => void
}

export function MonolithEndpointsSection({
    endpoints,
    canAdd,
    onAdd,
    onEdit,
    onDelete,
}: MonolithEndpointsSectionProps) {
    return (
        <Box>
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
                    <Chip label={endpoints.length} size="small" color="primary" variant="outlined" />
                </Box>
                <Button
                    id="add-endpoint-button"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                    disabled={!canAdd}
                >
                    Add Endpoint
                </Button>
            </Box>

            {endpoints.length > 0 ? (
                <TableContainer
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={100}>Method</TableCell>
                                <TableCell width={120}>Key</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell width={100} align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {endpoints.map((endpoint) => (
                                <TableRow key={endpoint.id} hover>
                                    <TableCell>
                                        <Chip
                                            label={endpoint.httpMethod}
                                            size="small"
                                            sx={{
                                                bgcolor:
                                                    (HTTP_METHOD_COLORS[endpoint.httpMethod] ?? "#8B949E") + "22",
                                                color: HTTP_METHOD_COLORS[endpoint.httpMethod] ?? "#8B949E",
                                                fontWeight: 700,
                                                fontFamily: "monospace",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {endpoint.key}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                            color: "primary.main",
                                        }}
                                    >
                                        {endpoint.route}
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
                                            {endpoint.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => onEdit(endpoint)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => onDelete(endpoint.id)}>
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
                        py: 6,
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 1,
                    }}
                >
                    <ApiIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        No endpoints yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add your first endpoint to start documenting your API
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} disabled={!canAdd}>
                        Add Endpoint
                    </Button>
                </Box>
            )}
        </Box>
    )
}
