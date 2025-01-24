import { buffer } from "@turf/buffer";
import * as turf from '@turf/turf';
import fs from 'fs';
import { getAdviceForRoute } from "./Advice/Advice";
import { NextBusLoader, NextBusTransformAgencies, NextBusTransformRouteConfig, NextBusTransformRoutes, NextBusTransformVehicles } from "./loaders/NextBusLoader";
import { LoadTorontoCameras, LoadTorontoTrafficLights } from "./loaders/Toronto/LoadTorontoData";
import { Advice, AgencyItem, Config, DataRouteStopItem, DataVehicleItem, RouteConfig, RouteItem, VehicleList } from "./types";
import { getDistanceFromLatLonInKm } from "./utils/Math";
type Props = {
    onConfigUpdate: (config: Config) => Promise<void>
    onAgencyListUpdate: (agencyList: AgencyItem[]) => Promise<void>
    onRouteListUpdate: (routeList: RouteItem[]) => Promise<void>
    onVehicleListUpdate: (vehicleList: VehicleList | undefined) => Promise<void>
    onRouteConfigUpdate: (routeInfo: RouteConfig | undefined) => Promise<void>
    onAdviceUpdate: (advice: Advice[]) => Promise<void>
};
export type TransitServiceResult = {
    startup: () => void
    saveConfig: () => void
    setTempAgency: (agency: AgencyItem) => void
    setConfig: (agency: any) => void
    config: Config
    agencyList: AgencyItem[]
    routeList: RouteItem[]
    historyList: DataVehicleItem[]
    //  routeConfig: RouteConfig | undefined
}



class TransitService {
    private onConfigUpdate: (config: Config) => Promise<void>;
    private onAgencyListUpdate: (agencyList: AgencyItem[]) => Promise<void>;
    private onRouteListUpdate: (routeList: RouteItem[]) => Promise<void>
    private onRouteConfigUpdate: (routeList: RouteConfig | undefined) => Promise<void>
    private onVehicleListUpdate: (vehicleList: VehicleList | undefined) => Promise<void>
    private onAdviceUpdate: (advice: Advice[]) => Promise<void>
    public historyList: DataVehicleItem[] = []
    constructor(props: Props) {
        this.onConfigUpdate = props.onConfigUpdate
        this.onAgencyListUpdate = props.onAgencyListUpdate
        this.onVehicleListUpdate = props.onVehicleListUpdate
        this.onRouteListUpdate = props.onRouteListUpdate
        this.onRouteConfigUpdate = props.onRouteConfigUpdate
        this.onAdviceUpdate = props.onAdviceUpdate
        this.startup()
    }

    public config: Config = { route: undefined, agency: undefined, bufferWidth: 0.05 }
    public agencyList: AgencyItem[] = []
    public routeList: RouteItem[] = []
    public advice: Advice[] = []
    public routeConfig: RouteConfig | undefined
    public vehicleList: VehicleList | undefined
    public lastTime = 0
    public lastRun = new Date()
    public setTempAgency = async (tempAgency: AgencyItem) => {
        const data = await NextBusLoader("https://retro.umoiq.com/service/publicJSONFeed?command=routeList&a=" +
            tempAgency.id,
        );
        const list = await NextBusTransformRoutes(data);

        console.log({ Routelist: list.length })
        await this.onRouteListUpdate(list)
    }
    private interval = setInterval(() => {
        console.log("Set Interval 10s");
        this.loadVehicleData();
    }, 10000);
    public loadConfig = () => {
        console.log("Loading Config")
        const file = process.argv[4]
        fs.readFile(file, "utf8", (err, data) => {
            if (err) {
                console.error(err);
            } else {
                try {
                    const config = JSON.parse(data);
                    this.setConfig(config)
                    console.log("File read successfully");
                } catch (e) {
                    console.log("File Load Error" + e)
                }

                // file written successfully
            }
        })

    }
    private getUniqueDirections = () => {
        return [...new Set(this.routeConfig?.directions.map(x => x.name) ?? [])]
    }
    private getVehiclesByDirection = (vehicleList: VehicleList, direction: string | undefined) => {
        return vehicleList?.data.filter(x => x.direction === direction)
            .sort((a, b) => a.distanceFromStop - b.distanceFromStop) ?? []
    }
    private getNextVehicle = (vehicle: DataVehicleItem, vehicleList: VehicleList) => {
        const ordered = this.getVehiclesByDirection(vehicleList, vehicle.direction)
        const index = ordered.findIndex((x) => x.id === vehicle.id)
        return ordered[index + 1]
    }
    private getPrevVehicle = (vehicle: DataVehicleItem, vehicleList: VehicleList) => {
        const ordered = this.getVehiclesByDirection(vehicleList, vehicle.direction)
        const index = ordered.findIndex((x) => x.id === vehicle.id)
        return ordered[index - 1]
    }
    private getDistancesToNextPrev = (vehicleList: VehicleList) => {
        const data = vehicleList.data.map((vehicle, index) => {
            vehicle.distanceToNextVehicle = this.getNextVehicle(vehicle, vehicleList)?.distanceFromStop - vehicle.distanceFromStop
            vehicle.distanceToPrevVehicle = vehicle.distanceFromStop - this.getPrevVehicle(vehicle, vehicleList)?.distanceFromStop
            return vehicle
        })
        return data
    }
    private processRouteConfig = (rc: RouteConfig): RouteConfig => {
        const bufferedRoute = rc.routeMap?.map(z => {
            const ls = turf.lineString(z.map((y) => {
                return [y.lon, y.lat]
            }) ?? [], {})

            return buffer(ls, this.config.bufferWidth ?? 0.05)
        })
        const za = bufferedRoute?.filter((z) => !!z) ?? []
        const z = turf.featureCollection(za)
        const z2 = turf.truncate(z, { precision: 5, mutate: true })

        var bufferedRouteUnion
        try { bufferedRouteUnion = turf.union(z2) }
        catch (e) {
            bufferedRouteUnion = null
            console.log("Buffered Route Union Error")
        }
        rc.bufferedRoute = bufferedRouteUnion
        var stopToMeasureFrom: DataRouteStopItem | null
        if (rc.stops?.length > 0) {
            stopToMeasureFrom = rc.stops[0]
        } else {
            stopToMeasureFrom = null
        }
        console.log(stopToMeasureFrom)
        rc.directions = rc.directions?.map((direction) => {
            direction.stops = direction.stops.map((stop, index) => {
                const curPos = rc.stops.filter((configStop) => configStop.id === stop.id)[0].position
                const prevPos = index > 0 ? rc.stops.filter((configStop) => configStop.id === direction.stops[index - 1].id)[0].position : curPos
                const nextPos = index < direction.stops.length - 1 ? rc.stops.filter((configStop) => configStop.id === direction.stops[index + 1].id)[0].position : curPos
                stop.distanceToNext = getDistanceFromLatLonInKm(curPos, nextPos)
                stop.distanceToPrev = getDistanceFromLatLonInKm(curPos, prevPos)
                stop.distanceFromStart = stopToMeasureFrom ? getDistanceFromLatLonInKm(stopToMeasureFrom.position, curPos) : -1
                // stop.distanceFromEnd=getDistanceFrom
                return stop
            })

            direction.stops = direction.stops.map((stop, index) => {
                // stop.distanceFromStart=stop.
                //  stop.distanceFromStart = direction.stops.slice(0, index).reduce((acc, stop) => acc + stop.distanceToNext, 0)
                //  stop.distanceFromEnd = direction.stops.slice(index).reduce((acc, stop) => acc + stop.distanceToNext, 0)
                return stop
            })
            return direction
        }) ?? []

        // const lengths = rc?.directions.map((direction, index) => {
        //     return direction.stops.reduce((acc, stop) => acc + stop.distanceToNext, 0)
        // })
        const lengths = rc?.directions.map((direction, index) => {
            return Math.max(...direction.stops.map((stop, index) => {
                return stop.distanceFromStart
            }))
        })
        // const lengths = rc?.stops.map((stop, index) => {
        //     return stop
        // })
        const maxLength = Math.max(...(lengths ?? [0]))
        rc.maxStopDistance = maxLength
        return rc
    }
    public saveConfig = (config: Config) => {
        console.log("Saving Config")

        const file = process.argv[4]
        fs.writeFile(file, JSON.stringify(config), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("File written successfully");
                // file written successfully
            }
        });
        this.setConfig(config)
    }
    public saveData = () => {
        console.log("Saving Data")
        const file = "data-" + Date.now() + ".json"
        fs.writeFile(file, JSON.stringify(this.historyList), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("File written successfully");
                // file written successfully
            }
        });
    }
    private loadVehicleData = async () => {
        console.log("Running Loading Vehicle Data")
        if (this.config.agency && this.config.route) {
            this.lastRun = new Date();
            try {
                await this.startGetVehicleList();
            } catch (e) {
                console.log(e);
            }
        }
    };
    private startup = async () => {
        console.log("Starting Transit Service")
        const data = await NextBusLoader("https://retro.umoiq.com/service/publicJSONFeed?command=agencyList");
        const list = await NextBusTransformAgencies(data);
        this.agencyList = [...this.agencyList, ...list];
        console.log({ AgencyList: this.agencyList.length })
        await this.onAgencyListUpdate(this.agencyList)
        this.loadConfig()

    }
    public setConfig = async (config: Config) => {
        console.log("Setting agency")
        this.config = config
        if (!this.config.agency)
            this.routeList = []
        else {
            const data = await NextBusLoader("https://retro.umoiq.com/service/publicJSONFeed?command=routeList&a=" +
                this.config.agency.id,
            );
            const list = await NextBusTransformRoutes(data);
            this.routeList = list
        }
        console.log({ Routelist: this.routeList.length })
        await this.onRouteListUpdate(this.routeList)
        if (!this.config.route)
            this.routeConfig = undefined

        else {
            const data = await NextBusLoader(
                "https://retro.umoiq.com/service/publicJSONFeed?command=routeConfig&verbose&a=" +
                this.config.agency?.id +
                "&r=" +
                this.config.route.id,
            );
            const config = await NextBusTransformRouteConfig(data)
            const processedConfig = this.processRouteConfig(config)
            const cameras = await LoadTorontoCameras(processedConfig)
            const trafficLights = await LoadTorontoTrafficLights(processedConfig)
            processedConfig.cameras = cameras
            processedConfig.trafficLights = trafficLights


            this.routeConfig = processedConfig
            const advice = getAdviceForRoute(this.routeConfig)
            this.advice = advice
        }
        // console.log({ RouteConfig: this.routeConfig })

        await this.onRouteConfigUpdate(this.routeConfig)
        await this.onAdviceUpdate(this.advice)
    }
    public startGetVehicleList = async () => {
        console.log("Starting Vehicle List")
        if (!this.config.route)
            return
        const dataA = await NextBusLoader(
            "https://retro.umoiq.com/service/publicJSONFeed?command=vehicleLocations&a=" +
            this.config.agency?.id +
            "&r=" +
            this.config.route.id +
            "&t=" +
            this.lastTime
        );
        var list = await NextBusTransformVehicles(dataA);

        list.data = list.data.map((item) => {
            const direction = this.routeConfig?.directions.filter((direction) => { return direction.id == item.dir })[0]
            // const firstStop = direction?.stops[0]
            const firstStop = this.routeConfig?.stops[0]
            //   const firstStopInfo = this.routeConfig?.stops.filter((stop) => { return stop.id == firstStop?.id })[0]
            if (firstStop) {
                const distanceFromStop = getDistanceFromLatLonInKm(item.position, firstStop.position)
                item.distanceFromStop = distanceFromStop
            }
            else {
                item.distanceFromStop = -1
            }

            var directionL
            if (item.dir) {
                directionL = this.routeConfig?.directions.filter((directionA) => {
                    return directionA.id == item.dir
                })[0].name
            }
            item.direction = directionL
            return item
        })
        list.data = this.getDistancesToNextPrev(list)
        this.vehicleList = list
        this.historyList = [...new Set([...this.historyList, ...list.data])]
        console.log({ 'VehicleList Loaded': this.vehicleList.data.length })
        console.log({ 'history length': this.historyList.length })

        await this.onVehicleListUpdate(this.vehicleList)

    }



}
export default TransitService


