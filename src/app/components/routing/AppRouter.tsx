import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Box, CircularProgress } from "@mui/material"
import { Layout } from "../layout/Layout"

const projectsBundle = () => import("@apidex/bundles/projects")

const ProjectsList = lazy(() =>
    projectsBundle().then((bundle) => ({ default: bundle.ProjectsList }))
)
const ProjectDetail = lazy(() =>
    projectsBundle().then((bundle) => ({ default: bundle.ProjectDetail }))
)
const ProjectForm = lazy(() =>
    projectsBundle().then((bundle) => ({ default: bundle.ProjectForm }))
)
const ServiceDetail = lazy(() =>
    projectsBundle().then((bundle) => ({ default: bundle.ServiceDetail }))
)
const ServiceForm = lazy(() =>
    projectsBundle().then((bundle) => ({ default: bundle.ServiceForm }))
)
const AiAssistant = lazy(() =>
    import("@apidex/bundles/askAi").then((bundle) => ({ default: bundle.AiAssistant }))
)
const Settings = lazy(() =>
    import("@apidex/bundles/settings").then((bundle) => ({ default: bundle.Settings }))
)

function RouteFallback() {
    return (
        <Box
            sx={{
                minHeight: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <CircularProgress />
        </Box>
    )
}

export function AppRouter() {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/ask" element={<AiAssistant />} />
                    <Route path="/projects/new" element={<ProjectForm />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/projects/:id/edit" element={<ProjectForm />} />
                    <Route
                        path="/projects/:projectId/services/new"
                        element={<ServiceForm />}
                    />
                    <Route
                        path="/projects/:projectId/services/:serviceId"
                        element={<ServiceDetail />}
                    />
                    <Route
                        path="/projects/:projectId/services/:serviceId/edit"
                        element={<ServiceForm />}
                    />
                </Route>
                <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
        </Suspense>
    )
}
