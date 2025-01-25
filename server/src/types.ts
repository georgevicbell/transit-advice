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

export type VehicleList = {
    lastTime: number;
    data: DataVehicleItem[];
};
export type Position = {
    lat: number;
    lon: number;
}
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
    distanceToNextVehicle: number
    distanceToPrevVehicle: number
    headway: number
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
    maxStopDistance: number
    bufferedRoute: (Feature<Polygon | MultiPolygon, GeoJsonProperties> | null);
    color: string;
    oppositeColor: string;
    routeMap: RouteMap;
    bounds: RouteBounds;
    stops: DataRouteStopItem[];
    directions: DataRouteDirectionItem[];
    cameras: CameraItem[];
    trafficLights: TrafficLightItem[];
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
export type Config = {
    route: RouteItem | undefined,
    agency: AgencyItem | undefined,
    bufferWidth: number | undefined
}
export type BusHistoryData = {
    location: Position,
    time: number
}
export type HistoryList = {
    [busId: string]: BusHistoryData[]
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
    message: string;
    type: string;
    date: number;
    details: string;
    priority: string
}