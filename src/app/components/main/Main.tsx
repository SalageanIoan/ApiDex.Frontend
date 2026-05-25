import { ApiDexTheme } from "@apidex/core/theme"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "../routing/AppRouter"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30000,
        },
    },
})

export function Main() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider theme={ApiDexTheme}>
                    <CssBaseline />
                    <AppRouter />
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
