export enum ESystemArchitecture {
    Monolith = 1,
    Distributed = 2,
}

export const SystemArchitectureLabels: Record<ESystemArchitecture, string> = {
    [ESystemArchitecture.Monolith]: "Monolith",
    [ESystemArchitecture.Distributed]: "Distributed",
}

export enum EServiceEventDirection {
    Published = 1,
    Consumed = 2,
}

export const ServiceEventDirectionLabels: Record<EServiceEventDirection, string> = {
    [EServiceEventDirection.Published]: "Published",
    [EServiceEventDirection.Consumed]: "Consumed",
}

export enum EServiceDependencyType {
    HttpCall = 1,
    DataConsumption = 2,
}

export const ServiceDependencyTypeLabels: Record<EServiceDependencyType, string> = {
    [EServiceDependencyType.HttpCall]: "HTTP Call",
    [EServiceDependencyType.DataConsumption]: "Data Consumption",
}
