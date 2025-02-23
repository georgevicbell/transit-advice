import { booleanPointInPolygon } from "@turf/turf";
import { overpass } from "overpass-ts";
import { RouteConfig, TrafficLightItem } from "../types";
export async function getTrafficLights(rc: RouteConfig): Promise<TrafficLightItem[]> {
    var trafficLights: TrafficLightItem[] = [];

    try {
        const bounds = rc.bounds.min.lat + "," + rc.bounds.min.lon + "," + rc.bounds.max.lat + "," + rc.bounds.max.lon
        const json = await overpass(`
        [out:json][timeout:25];
        node["highway"="traffic_signals"](bbox:`+ bounds + `);
        out geom;
        `)
        const data = await json.json() as any
        const lightsLoaded = data.elements.map((element: any) => {
            return {
                id: element.id,
                position: {
                    lat: element.lat,
                    lon: element.lon
                },
                type: "traffic_light",
                name: element.tags.name,
                tags: element.tags,
            }
        })

        console.log({ 'lights loaded': lightsLoaded.length })
        trafficLights = lightsLoaded.map((item: any) => {
            if (rc.bufferedRoute) {
                const isIn = booleanPointInPolygon([item.position.lon, item.position.lat], rc.bufferedRoute)
                if (isIn)
                    return item
            }
        })
        trafficLights = trafficLights.filter((item: any) => { return item != undefined })
        console.log({ 'lights found': trafficLights.length })

    } catch (e) {
        console.log(e)
    }

    return trafficLights

}