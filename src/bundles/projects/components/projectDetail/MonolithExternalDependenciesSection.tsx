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
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import LinkIcon from "@mui/icons-material/Link"
import { ServiceDependencyTypeLabels } from "@apidex/core/models"
import { ServiceDependencyDetail } from "@apidex/core/documentation/data"

type MonolithExternalDependenciesSectionProps = {
    dependencies: ServiceDependencyDetail[]
    canAdd: boolean
    onAdd: () => void
    onEdit: (dependency: ServiceDependencyDetail) => void
    onDelete: (dependencyId: string) => void
}

export function MonolithExternalDependenciesSection({
    dependencies,
    canAdd,
    onAdd,
    onEdit,
    onDelete,
}: MonolithExternalDependenciesSectionProps) {
    return (
        <Box sx={{ mt: 5 }}>
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
                        External Dependencies
                    </Typography>
                    <Chip label={dependencies.length} size="small" color="info" variant="outlined" />
                </Box>
                <Button
                    id="add-dependency-button"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                    disabled={!canAdd}
                >
                    Add Dependency
                </Button>
            </Box>

            {dependencies.length > 0 ? (
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
                            {dependencies.map((dependency) => (
                                <TableRow key={dependency.id} hover>
                                    <TableCell>
                                        <Chip
                                            label={ServiceDependencyTypeLabels[dependency.dependencyType]}
                                            size="small"
                                            variant="outlined"
                                            color="info"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {dependency.targetServiceTitle ?? "External"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                            color: "primary.main",
                                        }}
                                    >
                                        {dependency.targetEndpointRoute ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{dependency.description}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => onEdit(dependency)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => onDelete(dependency.id)}>
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
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        No external dependencies defined yet
                    </Typography>
                </Box>
            )}
        </Box>
    )
}
