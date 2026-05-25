import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import LanIcon from "@mui/icons-material/Lan"
import { ESystemArchitecture, SystemArchitectureLabels } from "@apidex/core/models"
import { DocumentationProjectDetail } from "@apidex/core/documentation/data"

type ProjectHeaderProps = {
    project: DocumentationProjectDetail
    isMonolith: boolean
    onEdit: () => void
    onDelete: () => void
}

export function ProjectHeader({ project, isMonolith, onEdit, onDelete }: ProjectHeaderProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {project.title}
                    </Typography>
                    <Chip
                        icon={
                            isMonolith ? (
                                <AccountTreeIcon sx={{ fontSize: 14 }} />
                            ) : (
                                <LanIcon sx={{ fontSize: 14 }} />
                            )
                        }
                        label={SystemArchitectureLabels[project.architectureType]}
                        color={project.architectureType === ESystemArchitecture.Monolith ? "warning" : "info"}
                        size="small"
                        variant="outlined"
                    />
                </Box>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 800, lineHeight: 1.8 }}
                >
                    {project.generalDescription}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, ml: 2, flexShrink: 0 }}>
                <Tooltip title="Edit project">
                    <IconButton
                        id="edit-project-button"
                        onClick={onEdit}
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete project">
                    <IconButton
                        id="delete-project-button"
                        onClick={onDelete}
                        color="error"
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}
