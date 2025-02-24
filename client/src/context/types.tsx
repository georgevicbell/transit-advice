import { Feature, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
export type AgencyItem = {
    id: string;
    title: string;
    type: DataSource;
    state: string;
    country: string;
    areas: AgencyArea[] | undefined;
    typeOf: string;
};

export type AgencyArea = {
    id: string;
    title: string;
};
export enum DataSource {
    NextBus = "NextBus",
    UK = "UK",
    Test = "Test"
}

export type RouteItem = {
    id: string;
    title: string;
    type: DataSource;
    group: string;
    typeOf: "RouteItem";
};

export type RouteConfig = {
    agency: AgencyItem;
    route: RouteItem;
    maxStopDistance: number
    color: string;
    bufferedRoute: (Feature<Polygon | MultiPolygon, GeoJsonProperties> | null);
    oppositeColor: string;
    routeMap: RouteMap;
    bounds: RouteBounds;
    stops: DataRouteStopItem[];
    directions: DataRouteDirectionItem[];
    cameras: CameraItem[];
    trafficLights: TrafficLightItem[];
    trafficStops: TrafficStopItem[];

};
export type DataRouteDirectionItem = {
    id: string;
    title: string;
    name: string;
    useForUI: string;
    stops: DataRouteDirectionStopItem[];
}
export type DataRouteDirectionStopItem = {
    id: string;
    distanceToNext: number;
    distanceToPrev: number;
    distanceFromStart: number;
    distanceFromEnd: number;

}
export type DataRouteStopTimeItem = {
    stopId: string;
    tripId: string;
};
export type Position = {
    lat: number;
    lon: number;
};
export type DataRouteStopItem = {
    id: string;
    title: string;
    position: Position;
};
export type RouteMap = Array<Array<Position>>;
export type RouteBounds = {
    min: Position
    max: Position
};

export type VehicleList = {
    agency: AgencyItem;
    route: RouteItem;
    lastTime: number;
    data: DataVehicleItem[];
};

export type DataVehicleItem = {
    id: string;
    title: string;
    position: Position;
    lastTime: number;
    heading: string;
    route: string;
    dir: string;
    speed: number;
    secsSinceReport: number | undefined
    distanceFromStop: number
    direction: string | undefined
    distanceToNextVehicle: number | null
    distanceToPrevVehicle: number | null
    headway: number

};
export type Config = {
    static: boolean
    agency: AgencyItem | undefined
    route: RouteItem | undefined
    bufferWidth: number
}
export type Server = {
    name: string
    server: string
    adminServer: string
}


export type CameraItem = {
    position: Position
    imageUrl: string,
    refurl1: string,
    refurl2: string,
    refurl3: string,
    refurl4: string,
    direction1: string,
    direction2: string,
    direction3: string,
    direction4: string,
}
export type TrafficStopItem = {
    position: Position,
    transit: string,
    rail: string,
    approaches: string,
    main: string,
    side1: string,
    side2: string,
    private: string,
    system: string,
    control: string,
    ped: string,
    bike: string,
    info: string,
}
export type TrafficLightItem = {
    position: Position,
    transit: string,
    rail: string,
    approaches: string,
    main: string,
    side1: string,
    side2: string,
    private: string,
    system: string,
    control: string,
    ped: string,
    bike: string,
    info: string,
}

export type Advice = {
    route: RouteItem;
    agency: AgencyItem;
    message: string;
    type: string;
    date: number;
    details: string;
    priority: string
}
export function getConfigFromDir(dir: string) {
    var color, isFlip = false
    switch (dir) {
        case "West":
            color = "#ff0000"
            isFlip = true
            break
        case "East":
            color = "#0000ff"
            break
        case "North":
            color = "#00ff00"
            break
        case "South":
            color = "#ffff00"
            isFlip = true
            break
        default:
            color = "#000000"
    }

    return {
        isFlip,
        color
    }

}