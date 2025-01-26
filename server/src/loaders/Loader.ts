import { AgencyItem, DataSource, RouteConfig, RouteItem, VehicleList } from "../types";
import { NextBusLoader, NextBusTransformAgencies, NextBusTransformRouteConfig, NextBusTransformRoutes, NextBusTransformVehicles } from "./NextBusLoader";
import { TestRouteConfigLoader, TestRouteLoader } from "./TestLoader";
export async function RouteLoader(agency: AgencyItem): Promise<RouteItem[]> {
    if (agency.type === DataSource.NextBus) {
        const data = await NextBusLoader("https://retro.umoiq.com/service/publicJSONFeed?command=routeList&a=" + agency.id);
        const list = await NextBusTransformRoutes(data);
        return list
    }
    else if (agency.type === DataSource.Test) {
        const list = await TestRouteLoader(agency)
        return list
    }
    return []
}
export async function AgencyLoader(dataSource: DataSource): Promise<AgencyItem[]> {
    if (dataSource === DataSource.NextBus) {
        const data = await NextBusLoader("https://retro.umoiq.com/service/publicJSONFeed?command=agencyList");
        const list = await NextBusTransformAgencies(data);
        return list
    }
    else if (dataSource === DataSource.Test) {
        throw new Error("Can't load Agency List from test")
    }
    return []
}
export async function RouteConfigLoader(agency: AgencyItem | undefined, route: RouteItem): Promise<RouteConfig> {
    if (route.type === DataSource.NextBus) {
        const data = await NextBusLoader(
            "https://retro.umoiq.com/service/publicJSONFeed?command=routeConfig&verbose&a=" +
            agency?.id +
            "&r=" +
            route.id,
        );
        const config = await NextBusTransformRouteConfig(data)
        return config
    }
    else if (route.type === DataSource.Test) {
        const config = await TestRouteConfigLoader(agency, route)
        return config
    }
    return {
        maxStopDistance: 0,
        bufferedRoute: null,
        color: "",
        oppositeColor: "",
        routeMap: [],
        bounds: {
            min: { lat: 0, lon: 0 },
            max: { lat: 0, lon: 0 }
        },
        stops: [],
        directions: [],
        cameras: [],
        trafficLights: []
    }
}
export async function VehicleLoader(agency: AgencyItem | undefined, route: RouteItem, lastTime: number): Promise<VehicleList> {
    if (route.type === DataSource.NextBus) {
        const dataA = await NextBusLoader(
            "https://retro.umoiq.com/service/publicJSONFeed?command=vehicleLocations&a=" +
            agency?.id +
            "&r=" +
            route.id +
            "&t=" +
            lastTime
        );
        var list = await NextBusTransformVehicles(dataA);
        return list
    }
    return {
        lastTime: 0, data: []
    }
}