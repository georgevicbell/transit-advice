import fs from 'fs/promises';
import { AgencyItem, DataSource, RouteConfig, RouteItem } from "../types";
export async function TestRouteLoader(agency: AgencyItem): Promise<RouteItem[]> {
    console.log("START")
    try {
        const file = await fs.readFile(agency.id, "utf8")
        console.log(file)
        const json = JSON.parse(file)
        console.log(json)
        return json
    } catch (e) {
        console.log(e)
    }
    return []
}
export async function TestRouteConfigLoader(agency: AgencyItem | undefined, route: RouteItem): Promise<RouteConfig> {
    console.log("START")
    try {
        const file = await fs.readFile(route.id, "utf8")
        console.log(file)
        const json = JSON.parse(file)
        console.log(json)
        return json
    } catch (e) {
        console.log(e)
    }

    return {
        agency: agency ?? { id: "", title: "", type: DataSource.NextBus, state: "", country: "", areas: undefined, typeOf: "AgencyItem" },
        route: route,
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
        trafficLights: [],
        trafficStops: []
    }
}