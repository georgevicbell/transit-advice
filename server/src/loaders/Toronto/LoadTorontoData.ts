import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { CameraItem, RouteConfig, TrafficLightItem } from '../../types';
export async function LoadTorontoCameras(rc: RouteConfig): Promise<CameraItem[]> {
    var cameras: CameraItem[] = [];
    try {
        const packageId = "a3309088-5fd4-4d34-8297-77c8301840ac";
        const file = await fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`)
        const json = await file.json()
        const resource = json.result.resources.filter((resource: any) => { return resource.datastore_active })[0]
        const file2 = await fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource["id"]}`)
        const json2 = await file2.json()
        const records = json2.result.records
        console.log({ 'cameras loaded': records.length })
        cameras = records.map((item: any) => {
            const coords = JSON.parse(item.geometry).coordinates

            if (rc.bufferedRoute) {
                const isIn = booleanPointInPolygon(coords, rc.bufferedRoute)
                if (isIn) {
                    return {
                        position: { lat: coords[1], lon: coords[0] },
                        imageUrl: item.IMAGEURL,
                        refurl1: item.REFURL1,
                        refurl2: item.REFURL2,
                        refurl3: item.REFURL3,
                        refurl4: item.REFURL4,
                        direction1: item.DIRECTION1,
                        direction2: item.DIRECTION2,
                        direction3: item.DIRECTION3,
                        direction4: item.DIRECTION4,
                    }
                }
            }
        }
        )
        cameras = cameras.filter((item: any) => { return item != undefined })
        console.log({ 'cameras found': cameras.length })

    }
    catch (e) {
        console.log(e)
    }
    return cameras
}
export async function LoadTorontoTrafficLights(rc: RouteConfig): Promise<TrafficLightItem[]> {
    var trafficLights: TrafficLightItem[] = [];
    try {
        const data = await fetch('https://secure.toronto.ca/opendata/cart/traffic_signals/v3?format=json')
        const json = await data.json()

        console.log({ 'lights loaded': json.length })
        trafficLights = json.map((item: any) => {
            if (rc.bufferedRoute) {
                const isIn = booleanPointInPolygon([item.long, item.lat], rc.bufferedRoute)
                if (isIn) {
                    return {
                        position: { lat: item.lat, lon: item.long },
                        transit: item.transit_preempt,
                        rail: item.rail_reempt,
                        approaches: item.no_of_signalized_approaches,
                        main: item.main,
                        side1: item.side1,
                        side2: item.side2,
                        private: item.private_access,
                        system: item.signal_system,
                        control: item.mode_of_control,
                        ped: item.leading_pedestrian_intervals,
                        bike: item.bicycle_signal,
                        info: item.additional_info
                    }
                }
            }

        })
        trafficLights = trafficLights.filter((item: any) => { return item != undefined })
        console.log({ 'lights found': trafficLights.length })
    }
    catch (e) {
        console.log(e)
    }
    return trafficLights
}
