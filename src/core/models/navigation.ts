export enum ERoute {
    Projects = "/projects",
    ProjectNew = "/projects/new",
    ProjectDetail = "/projects/:id",
    ProjectEdit = "/projects/:id/edit",
    ServiceNew = "/projects/:projectId/services/new",
    ServiceDetail = "/projects/:projectId/services/:serviceId",
    ServiceEdit = "/projects/:projectId/services/:serviceId/edit",
}
