import { Outlet, useNavigate, useLocation } from "react-router-dom"
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material"
import DescriptionIcon from "@mui/icons-material/Description"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SettingsIcon from "@mui/icons-material/Settings"

const DRAWER_WIDTH = 260

export function Layout() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Box sx={{ display: "flex", height: "100%" }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: DRAWER_WIDTH,
                        boxSizing: "border-box",
                        bgcolor: "#0D1117",
                        borderRight: "1px solid",
                        borderColor: "divider",
                    },
                }}
            >
                <List sx={{ px: 1, pt: 1 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            id="nav-projects"
                            selected={location.pathname.startsWith("/projects")}
                            onClick={() => navigate("/projects")}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                "&.Mui-selected": {
                                    bgcolor: "rgba(88, 166, 255, 0.12)",
                                    "&:hover": {
                                        bgcolor: "rgba(88, 166, 255, 0.16)",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <DescriptionIcon
                                    sx={{
                                        color: location.pathname.startsWith(
                                            "/projects"
                                        )
                                            ? "primary.main"
                                            : "text.secondary",
                                        fontSize: 20,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Projects"
                                slotProps={{
                                    primary: {
                                        sx: { fontWeight: 500, fontSize: "0.9rem" },
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            id="nav-ask"
                            selected={location.pathname.startsWith("/ask")}
                            onClick={() => navigate("/ask")}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                "&.Mui-selected": {
                                    bgcolor: "rgba(88, 166, 255, 0.12)",
                                    "&:hover": {
                                        bgcolor: "rgba(88, 166, 255, 0.16)",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <AutoAwesomeIcon
                                    sx={{
                                        color: location.pathname.startsWith(
                                            "/ask"
                                        )
                                            ? "primary.main"
                                            : "text.secondary",
                                        fontSize: 20,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Ask AI"
                                slotProps={{
                                    primary: {
                                        sx: { fontWeight: 500, fontSize: "0.9rem" },
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            id="nav-settings"
                            selected={location.pathname.startsWith("/settings")}
                            onClick={() => navigate("/settings")}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                "&.Mui-selected": {
                                    bgcolor: "rgba(88, 166, 255, 0.12)",
                                    "&:hover": {
                                        bgcolor: "rgba(88, 166, 255, 0.16)",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <SettingsIcon
                                    sx={{
                                        color: location.pathname.startsWith(
                                            "/settings"
                                        )
                                            ? "primary.main"
                                            : "text.secondary",
                                        fontSize: 20,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Settings"
                                slotProps={{
                                    primary: {
                                        sx: { fontWeight: 500, fontSize: "0.9rem" },
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ p: 2 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            display: "block",
                            textAlign: "center",
                            fontSize: "0.6rem",
                        }}
                    >
                        RAG-Powered API Documentation
                    </Typography>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    bgcolor: "background.default",
                    minHeight: "100vh",
                    overflow: "auto",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}
