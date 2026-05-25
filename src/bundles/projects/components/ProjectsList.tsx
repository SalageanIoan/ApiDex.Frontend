import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Grid,
    Skeleton,
    Snackbar,
    Alert,
    Typography,
    InputAdornment,
    TextField,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import DescriptionIcon from "@mui/icons-material/Description"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import LanIcon from "@mui/icons-material/Lan"
import {
    ESystemArchitecture,
    SystemArchitectureLabels,
} from "@apidex/core/models"
import { useDocumentationProjects } from "@apidex/core/documentation"

export function ProjectsList() {
    const navigate = useNavigate()
    const { projects, isLoading, isError } = useDocumentationProjects()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredProjects = projects.filter(
        (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.generalDescription.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getArchitectureColor = (type: ESystemArchitecture) => {
        switch (type) {
            case ESystemArchitecture.Monolith:
                return "warning"
            case ESystemArchitecture.Distributed:
                return "info"
            default:
                return "default"
        }
    }

    const getArchitectureIcon = (type: ESystemArchitecture) => {
        switch (type) {
            case ESystemArchitecture.Monolith:
                return <AccountTreeIcon sx={{ fontSize: 14 }} />
            case ESystemArchitecture.Distributed:
                return <LanIcon sx={{ fontSize: 14 }} />
            default:
                return undefined
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Documentation Projects
                    </Typography>
                    <Typography variant="subtitle1">
                        Manage your API documentation across all services
                    </Typography>
                </Box>
                <Button
                    id="create-project-button"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/projects/new")}
                    sx={{ height: 44 }}
                >
                    New Project
                </Button>
            </Box>

            <TextField
                id="search-projects-input"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 3, maxWidth: 400 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            {isError && (
                <Snackbar open autoHideDuration={6000}>
                    <Alert severity="error" variant="filled">
                        Failed to load documentation projects
                    </Alert>
                </Snackbar>
            )}

            {isLoading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map((i) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                            <Skeleton
                                variant="rounded"
                                height={180}
                                sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)" }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : filteredProjects.length === 0 ? (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 10,
                        px: 4,
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <DescriptionIcon
                        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        {searchQuery
                            ? "No projects match your search"
                            : "No documentation projects yet"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {searchQuery
                            ? "Try a different search term"
                            : "Create your first project to start documenting your APIs"}
                    </Typography>
                    {!searchQuery && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/projects/new")}
                        >
                            Create Project
                        </Button>
                    )}
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredProjects.map((project) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project.id}>
                            <Card
                                id={`project-card-${project.id}`}
                                sx={{ height: "100%", cursor: "pointer" }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    sx={{ height: "100%", p: 0 }}
                                >
                                    <CardContent sx={{ p: 3, height: "100%" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                mb: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 600,
                                                    flex: 1,
                                                    mr: 1,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {project.title}
                                            </Typography>
                                            <Chip
                                                icon={getArchitectureIcon(
                                                    project.architectureType
                                                )}
                                                label={
                                                    SystemArchitectureLabels[
                                                        project.architectureType
                                                    ]
                                                }
                                                color={getArchitectureColor(
                                                    project.architectureType
                                                )}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {project.generalDescription}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    )
}
