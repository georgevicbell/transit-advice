import { UniqueSet } from '@sepiariver/unique-set';
import { buffer } from "@turf/buffer";
import * as turf from '@turf/turf';
import fs from 'fs';
import { getAdviceForRoute } from "./Advice/Advice";
import { AgencyLoader, RouteConfigLoader, RouteLoader, VehicleLoader } from "./loaders/Loader";
import { getTrafficLights, getTrafficStops } from "./loaders/OSMTrafficLights";
import { LoadTorontoCameras } from "./loaders/Toronto/LoadTorontoData";
import { Status } from "./server";
import { Advice, AgencyItem, Config, DataRouteStopItem, DataSource, DataVehicleItem, RouteConfig, RouteItem, VehicleList } from "./types";
import { getDistanceFromLatLonInKm } from "./utils/Math";
type Props = {
    onConfigUpdate: (config: Config) => Promise<void>
    onAgencyListUpdate: (agencyList: AgencyItem[]) => Promise<void>
    onRouteListUpdate: (routeList: RouteItem[]) => Promise<void>
    onVehicleListUpdate: (vehicleList: VehicleList | undefined) => Promise<void>
    onRouteConfigUpdate: (routeInfo: RouteConfig[]) => Promise<void>
    onAdviceUpdate: (advice: Advice[]) => Promise<void>
    printTable: (status: Partial<Status>) => void
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
    private onRouteConfigUpdate: (routeList: RouteConfig[]) => Promise<void>
    private onVehicleListUpdate: (vehicleList: VehicleList | undefined) => Promise<void>
    private onAdviceUpdate: (advice: Advice[]) => Promise<void>
    public historyList: UniqueSet<DataVehicleItem> = new UniqueSet()
    constructor(props: Props) {
        this.printTableParent = props.printTable
        this.onConfigUpdate = props.onConfigUpdate
        this.onAgencyListUpdate = props.onAgencyListUpdate
        this.onVehicleListUpdate = props.onVehicleListUpdate
        this.onRouteListUpdate = props.onRouteListUpdate
        this.onRouteConfigUpdate = props.onRouteConfigUpdate
        this.onAdviceUpdate = props.onAdviceUpdate
        this.startup()
    }

    public config: Config = { static: false, route: undefined, agency: undefined, bufferWidth: 0.05 }
    public agencyList: AgencyItem[] = []
    public routeList: RouteItem[] = []
    public advice: Advice[] = []
    public routeConfig: RouteConfig[] = []
    public vehicleList: VehicleList | undefined
    public lastTime = 0
    public lastRun = new Date()
    private printTable = (status: Partial<Status>) => {
        this.printTableParent({
            agency: this.config.agency?.title,
            route: this.config.route?.title,
            ...status
        })
    }
    private printTableParent: (status: Partial<Status>) => void

    public setTempAgency = async (tempAgency: AgencyItem) => {
        const list = await RouteLoader(tempAgency)
        this.printTable({ routeList: list.length })
        await this.onRouteListUpdate(list)
    }
    private vehicleInterval = setInterval(() => {
        this.printTable({ vehicleInterval: "10s" })
        this.loadVehicleData();
    }, 10000);

    public loadConfig = () => {
        this.printTable({ configLoaded: "Loading" })
        const file = process.argv[4]
        fs.readFile(file, "utf8", async (err, data) => {
            if (err) {
                console.error(err);
                this.printTable({ configLoaded: "Error Reading File" + err })

            } else {
                try {
                    const config = JSON.parse(data);
                    if (config.static == true || config.agency.type == DataSource.Test) {
                        clearInterval(this.vehicleInterval)
                        this.printTable({ vehicleTimer: "Stopped for Testing" })
                    }
                    this.printTable({ configLoaded: "Read Success" })
                    await this.setConfig(config)
                    this.printTable({ configLoaded: "Success" })

                } catch (e) {
                    this.printTable({ configLoaded: "Error Parsing File" + e })

                }
            }
        })

    }

    private getUniqueDirections = () => {
        const currentRouteConfig = this.routeConfig.filter((routeConfig) => { return routeConfig.route.id == this.config.route?.id })[0]
        return [...new Set(currentRouteConfig.directions.map(x => x.name) ?? [])]
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
    private getBufferedRoute = (rc: RouteConfig) => {
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
            this.printTable({ bufferedRoute: "Error" + e });
        }
        return bufferedRouteUnion
    }
    private getStopDistances(rc: RouteConfig) {
        var stopToMeasureFrom: DataRouteStopItem | null
        if (rc.stops?.length > 0) {
            stopToMeasureFrom = rc.stops[0]
        } else {
            stopToMeasureFrom = null
        }
        const directions = rc.directions = rc.directions?.map((direction) => {
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
        return directions
    }
    private processRouteConfig = (rc: RouteConfig): RouteConfig => {

        rc.bufferedRoute = this.getBufferedRoute(rc)
        rc.directions = this.getStopDistances(rc)

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
        this.printTable({ configSaving: "Saving" })
        const file = process.argv[4]
        fs.writeFile(file, JSON.stringify(config), err => {
            if (err) {
                this.printTable({ configSaving: "Error" + err })
            } else {
                this.printTable({ configSaving: "Saved" })
            }
        });
        this.setConfig(config)
    }
    public saveData = () => {
        this.printTable({ dataSaving: "Saving" })
        const file = "data-" + Date.now() + ".json"
        fs.writeFile(file, JSON.stringify(this.historyList), err => {
            if (err) {
                this.printTable({ dataSaving: "Error" + err })
            } else {
                this.printTable({ dataSaving: "Saved" })
            }
        });
    }
    private loadVehicleData = async () => {
        this.printTable({ vehicleLoad: "Loading" });
        if (this.config.agency && this.config.route) {
            this.lastRun = new Date();
            try {
                await this.startGetVehicleList();
                this.printTable({ vehicleLoad: "Done" });

            } catch (e) {
                this.printTable({ vehicleLoad: "Error" + e });
            }
        }

    };
    private startup = async () => {
        this.printTable({ agencyList: "Loading" })
        const list = await AgencyLoader(DataSource.NextBus)
        this.agencyList = [...this.agencyList, ...list];
        this.printTable({ agencyList: this.agencyList.length })
        await this.onAgencyListUpdate(this.agencyList)
        await this.loadConfig()

    }
    private processRoute = async (agency: AgencyItem, route: RouteItem) => {

        const routeConfig = await RouteConfigLoader(agency, route)
        const processedConfig = this.processRouteConfig(routeConfig)

        this.printTable({ cameras: "Loading" })
        processedConfig.cameras = await LoadTorontoCameras(processedConfig)
        this.printTable({ cameras: processedConfig.cameras?.length })

        //  processedConfig.trafficLights = await LoadTorontoTrafficLights(processedConfig)
        this.printTable({ trafficLights: "Loading" })
        processedConfig.trafficLights = await getTrafficLights(processedConfig)
        this.printTable({ trafficLights: processedConfig.trafficLights?.length })

        this.printTable({ trafficStops: "Loading" })
        processedConfig.trafficStops = await getTrafficStops(processedConfig)
        this.printTable({ trafficStops: processedConfig.trafficStops?.length })

        this.routeConfig.push(processedConfig)
        this.printTable({ routeCount: this.routeConfig.length })

        this.printTable({ advice: "Loading" })
        this.advice == getAdviceForRoute(processedConfig)
        this.printTable({ advice: this.advice.length })

    }
    public setConfig = async (config: Config) => {
        this.printTable({ processingConfig: "In Progress..." })
        this.config = config
        if (!this.config.static) {
            if (!this.config.agency)
                this.routeList = []
            else {
                const list = await RouteLoader(this.config.agency)
                this.routeList = list
            }
            this.printTable({ routeList: this.routeList.length })

            await this.onRouteListUpdate(this.routeList)
            if (!this.config.route)
                this.routeConfig = []
            else {
                if (this.config.agency)
                    await this.processRoute(this.config.agency, this.config.route)
            }
            this.printTable({ processingConfig: "Done" })
            this.printTable({ routeCount: this.routeConfig.length })
            await this.onRouteConfigUpdate(this.routeConfig)
            await this.onAdviceUpdate(this.advice)
        } else {
            await this.agencyList.forEach(async (agency) => {
                if (agency.type == DataSource.NextBus) {
                    const routeList = await RouteLoader(agency)
                    await routeList.forEach(async (route) => {
                        await this.processRoute(agency, route)
                        await this.onRouteConfigUpdate(this.routeConfig)
                        await this.onAdviceUpdate(this.advice)
                    })
                }
            })

        }
    }
    public getHeadway = (vehicleList: VehicleList, historyList: UniqueSet<DataVehicleItem>): DataVehicleItem[] => {

        const fullList = Array.from(historyList)

        const data = vehicleList.data.map((vehicle) => {
            const sameDirection = fullList?.filter((x) => x.dir === vehicle.dir) ?? []
            const groupBuses = Object.groupBy(sameDirection, ({ id }) => id);
            const group = groupBuses[vehicle.id]
            const sorted = group?.sort((a, b) => { return a.lastTime - b.lastTime }) ?? []
            const split = sorted.filter((x, index) => {
                if (x.distanceFromStop < vehicle.distanceFromStop)
                    if (index > 0)
                        if (sorted[index - 1].distanceFromStop > vehicle.distanceFromStop)
                            return true
                return false
            })
            const lastSplit = split[split.length - 1]
            if (lastSplit) {
                const lastTime = lastSplit?.lastTime ?? 0
                vehicle.headway = vehicle.lastTime - lastTime
            }
            else
                vehicle.headway = -1
            if (split.length > 0) {
                console.log({ split: split.length })
                console.log({ id: vehicle.id, hw: vehicle.headway })
            }
            return vehicle
        })
        return data
    }
    public startGetVehicleList = async () => {
        this.printTable({ vehicleTimer: "Running" })
        if (!this.config.route)
            return
        const list = await VehicleLoader(this.config.agency, this.config.route, this.lastTime)

        list.data = list.data.map((item) => {
            const currentRouteConfig = this.routeConfig?.filter((routeConfig) => { return routeConfig.route.id == this.config.route?.id })[0]
            const direction = currentRouteConfig.directions.filter((direction) => { return direction.id == item.dir })[0]
            // const firstStop = direction?.stops[0]
            const firstStop = currentRouteConfig.stops[0]
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
                directionL = currentRouteConfig.directions.filter((directionA) => {
                    return directionA.id == item.dir
                })[0].name
            }
            item.direction = directionL
            return item
        })
        list.data = this.getDistancesToNextPrev(list)
        list.data = this.getHeadway(list, this.historyList)
        this.vehicleList = list
        list.data.forEach((item) => {
            this.historyList = this.historyList.add(item)
        })
        this.printTable({ vehicleData: "Loaded: " + this.vehicleList.data.length + ", History:" + this.historyList.size })

        await this.onVehicleListUpdate(this.vehicleList)

    }



}
export default TransitService


