import { createTheme, responsiveFontSizes } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#58A6FF",
            light: "#79B8FF",
            dark: "#1F6FEB",
            contrastText: "#0D1117",
        },
        secondary: {
            main: "#8B949E",
            light: "#C9D1D9",
            dark: "#484F58",
        },
        success: {
            main: "#3FB950",
            light: "#56D364",
            dark: "#238636",
        },
        warning: {
            main: "#D29922",
            light: "#E3B341",
            dark: "#9E6A03",
        },
        error: {
            main: "#F85149",
            light: "#FF7B72",
            dark: "#DA3633",
        },
        info: {
            main: "#58A6FF",
        },
        background: {
            default: "#0D1117",
            paper: "#161B22",
        },
        text: {
            primary: "#E6EDF3",
            secondary: "#8B949E",
        },
        divider: "rgba(48, 54, 61, 0.8)",
    },
    spacing: 8,
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: "Montserrat, sans-serif",
        h1: { fontWeight: 700, fontSize: "2.5rem", letterSpacing: "-0.02em" },
        h2: { fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.01em" },
        h3: { fontWeight: 600, fontSize: "1.5rem" },
        h4: { fontWeight: 600, fontSize: "1.25rem" },
        h5: { fontWeight: 600, fontSize: "1.1rem" },
        h6: { fontWeight: 600, fontSize: "1rem" },
        subtitle1: { fontWeight: 500, fontSize: "0.95rem", color: "#8B949E" },
        body1: { fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.6 },
        body2: { fontWeight: 400, fontSize: "0.8rem", lineHeight: 1.5 },
        button: { textTransform: "none", fontWeight: 600, fontSize: "0.875rem" },
        caption: { fontSize: "0.75rem", color: "#8B949E" },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: { height: "100%" },
                body: {
                    height: "100%",
                    margin: 0,
                    scrollbarWidth: "thin",
                    scrollbarColor: "#30363D #0D1117",
                },
                "#root": {
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#161B22",
                    border: "1px solid #30363D",
                    borderRadius: 12,
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                        borderColor: "#58A6FF",
                        boxShadow: "0 4px 16px rgba(88, 166, 255, 0.1)",
                        transform: "translateY(-2px)",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontWeight: 600,
                    textTransform: "none",
                },
                contained: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0 2px 8px rgba(88, 166, 255, 0.25)",
                    },
                },
                outlined: {
                    borderColor: "#30363D",
                    "&:hover": {
                        borderColor: "#58A6FF",
                        backgroundColor: "rgba(88, 166, 255, 0.08)",
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                fullWidth: true,
                slotProps: {
                    inputLabel: {
                        shrink: true,
                    },
                },
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#0D1117",
                        "& fieldset": {
                            borderColor: "#30363D",
                        },
                        "&:hover fieldset": {
                            borderColor: "#58A6FF",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#58A6FF",
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: "#0D1117",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#161B22",
                    border: "1px solid #30363D",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    borderRadius: 6,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: "#21262D",
                },
                head: {
                    fontWeight: 600,
                    color: "#8B949E",
                    backgroundColor: "#0D1117",
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: "background-color 0.2s ease, color 0.2s ease",
                    "&:hover": {
                        backgroundColor: "rgba(88, 166, 255, 0.12)",
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "#1C2128",
                    border: "1px solid #30363D",
                    fontSize: "0.75rem",
                },
            },
        },
    },
})

export default responsiveFontSizes(theme)
