import {
  AgencyItem,
  DataRouteDirectionItem,
  DataRouteStopItem,
  DataSource,
  RouteConfig,
  RouteItem,
  RouteMap,
  VehicleList
} from "../types";
import { fetchFileSystem } from "./FetchFileSystem";
export type RouteBounds = {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
};

export async function NextBusLoader(
  baseUrl: string,
): Promise<Record<string, any>> {
  const baseJson = await fetchFileSystem(baseUrl);

  return baseJson;
}
const GetCountry = (region: string) => {
  switch (region) {
    case "California-Southern":
    case "California-Northern":
    case "New York":
    case "Maryland":
    case "Massachusetts":
    case "North Carolina":
    case "Missouri":
    case "Mississippi":
    case "Indiana":
    case "Florida":
    case "New Jersey":
    case "Oregon":
    case "Pennsylvania":
    case "Washington":
    case "Texas":
    case "Virginia":
    case "Kentucky":
    case "Nevada":
      return "USA";
    case "Quebec":
    case "Ontario":
      return "Canada";
    case "Mexico":
      return "Mexico";
    case "Araucania":
      return "Chile";
    default:
      return "UNKNOWN";
  }
};
export async function NextBusTransformAgencies(
  data: Record<string, any>
): Promise<AgencyItem[]> {
  const z: AgencyItem[] = data.agency.map((item: Record<string, any>) => {
    return {
      id: item.tag,
      title: item.title,
      type: DataSource.NextBus,
      state: item.regionTitle,
      country: GetCountry(item.regionTitle),
      areas: undefined,
      typeOf: "AgencyItem",
    };
  });

  return z;
}
export async function NextBusTransformRoutes(
  data: Record<string, any>
): Promise<RouteItem[]> {

  if (data.route.map) {
    const z = data.route.map((item: Record<string, any>) => {
      return {
        id: item.tag,
        title: item.title,
        type: DataSource.NextBus,
        group: "Vehicles",
        typeOf: "RouteItem",

      };
    });
    return z;
  }
  else
    return [{
      id: data.route.tag,
      title: data.route.title,
      type: DataSource.NextBus,
      group: "Vehicles",
      typeOf: "RouteItem",
    }]
}

export async function NextBusTransformRouteConfig(
  data: Record<string, any>
): Promise<RouteConfig> {
  const stops: DataRouteStopItem[] = data.route?.stop?.map((item: Record<string, any>) => {
    return {
      id: item.tag,
      title: item.title,
      position: {
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      },
      stopId: item.stopId,
    };
  });
  const directions: DataRouteDirectionItem[] = data.route?.direction?.map((item: Record<string, any>) => {
    return {
      id: item.tag,
      title: item.title,
      name: item.name,
      useForUI: item.useForUI,
      stops: item.stop.map((item2: Record<string, any>) => {
        return {
          id: item2.tag,
        };
      }),
    };
  })
  const routeMap: RouteMap = data.route?.path.map((item: any) => {
    return item.point.map((item2: any) => {
      return { lat: parseFloat(item2.lat), lon: parseFloat(item2.lon) };
    });
  });
  return {
    maxStopDistance: data.route?.maxStopDistance,
    bufferedRoute: null,
    color: data.route?.color,
    oppositeColor: data.route?.oppositeColor,
    routeMap: routeMap,
    bounds: {
      min: {
        lat: data.route?.latMin,
        lon: data.route?.lonMin
      },
      max: {
        lat: data.route?.latMax,
        lon: data.route?.lonMax
      }
    },
    stops: stops,
    directions: directions,
    cameras: [],
    trafficLights: []
  };
}

export async function NextBusTransformVehicles(
  dataA: Record<string, any>
): Promise<VehicleList> {
  const z = {
    title: "Vehicles",
    lastTime: parseFloat(dataA?.lastTime?.time ?? 0),
    data:
      dataA.vehicle instanceof Array
        ? dataA.vehicle.map((item: Record<string, any>) => {
          return {
            id: item.id,
            route: item.routeTag,
            lastTime: parseFloat(dataA?.lastTime?.time ?? 0),
            position: {
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
            },
            dir: item.dirTag,
            speed: item.speedKmHr,
            heading: item.heading,
            secsSinceReport: item.secsSinceReport,
            title: dataA.title,
            distanceFromStop: 0,
            direction: undefined,
            distanceToNextVehicle: 0,
            distanceToPrevVehicle: 0,
            headway: -1
          };
        })
        : dataA.vehicle == null || dataA.vehicle == undefined
          ? []
          : [
            {
              id: dataA.id,
              route: dataA.routeTag,
              lastTime: parseFloat(dataA?.lastTime?.time ?? 0),
              position: {
                lat: parseFloat(dataA.lat),
                lon: parseFloat(dataA.lon)
              }
              ,
              dir: dataA.dirTag,
              speed: dataA.speedKmHr,
              heading: dataA.heading,
              secsSinceReport: undefined,//dataA.secsSinceReport,
              title: dataA.title,
              distanceFromStop: 0,
              direction: undefined,
              distanceToNextVehicle: 0,
              distanceToPrevVehicle: 0,
              headway: -1
            }
          ]
  }



  return z;
}
