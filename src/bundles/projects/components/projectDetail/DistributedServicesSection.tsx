import {
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices"
import { ServiceDocumentationDetail } from "@apidex/core/documentation/data"

type DistributedServicesSectionProps = {
    services: ServiceDocumentationDetail[]
    onAddService: () => void
    onOpenService: (serviceId: string) => void
}

export function DistributedServicesSection({
    services,
    onAddService,
    onOpenService,
}: DistributedServicesSectionProps) {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Services
                </Typography>
                <Button
                    id="add-service-button"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onAddService}
                >
                    Add Service
                </Button>
            </Box>

            {services.length > 0 ? (
                <List
                    sx={{
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {services.map((service, index) => (
                        <Box key={service.id}>
                            {index > 0 && <Divider />}
                            <ListItem disablePadding>
                                <ListItemButton
                                    id={`service-item-${service.id}`}
                                    onClick={() => onOpenService(service.id)}
                                    sx={{ py: 2, px: 3 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <MiscellaneousServicesIcon sx={{ color: "primary.main" }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={service.title}
                                        secondary={service.generalDescription}
                                        slotProps={{
                                            primary: {
                                                sx: { fontWeight: 600 },
                                            },
                                            secondary: {
                                                sx: {
                                                    mt: 0.5,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                },
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Box>
                    ))}
                </List>
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
                    <MiscellaneousServicesIcon
                        sx={{
                            fontSize: 48,
                            color: "text.secondary",
                            mb: 1,
                        }}
                    />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        No services yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add your first service to start documenting endpoints, events, and dependencies
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={onAddService}>
                        Add Service
                    </Button>
                </Box>
            )}
        </>
    )
}
