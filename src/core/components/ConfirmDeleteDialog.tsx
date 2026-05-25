import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import DeleteIcon from "@mui/icons-material/Delete"

type ConfirmDeleteDialogProps = {
    open: boolean
    title: string
    description: string
    isLoading: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDeleteDialog({
    open,
    title,
    description,
    isLoading,
    onConfirm,
    onCancel,
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: "#0D1117",
                        backgroundImage: "none",
                        border: "1px solid",
                        borderColor: "error.dark",
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
                            bgcolor: "rgba(248, 81, 73, 0.12)",
                            display: "flex",
                        }}
                    >
                        <WarningAmberIcon sx={{ color: "error.main", fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider sx={{ mt: 2 }} />

            <DialogContent sx={{ pt: "16px !important" }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {description}
                </Typography>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    disabled={isLoading}
                    sx={{ borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    disabled={isLoading}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {isLoading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
