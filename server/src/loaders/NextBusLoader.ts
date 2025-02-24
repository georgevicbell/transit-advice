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
export type RouteBounds = {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
};

export async function NextBusLoader(
  baseUrl: string,
): Promise<{ data: Record<string, any>, loaded: boolean }> {
  var data, loaded = false;
  try {
    const text = await fetch(baseUrl)
    data = JSON.parse(await text.text());
    loaded = true
  } catch (e) {
    console.log(e)
    data = {}
  }
  return { data, loaded };
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
  data: Record<string, any>, agency: AgencyItem | undefined, route: RouteItem
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
  var directions: DataRouteDirectionItem[]
  if (data.route?.direction?.map)
    directions = data.route?.direction?.map((item: Record<string, any>) => {
      return {
        id: item.tag,
        title: item.title,
        name: item.name,
        useForUI: item.useForUI,
        stops: item.stop.map ? item.stop.map((item2: Record<string, any>) => {
          return {
            id: item2.tag,
          };
        }) : [{ id: item.stop.tag }],
      };
    })
  else
    directions = [{
      id: data.route?.direction.tag,
      title: data.route?.direction.title,
      name: data.route?.direction.name,
      useForUI: data.route?.direction.useForUI,
      stops: data.route?.direction.stop.map((item2: Record<string, any>) => {
        return {
          id: item2.tag,
        };
      }),
    }]
  var routeMap: RouteMap
  if (data.route?.path.map)
    routeMap = data.route?.path.map((item: any) => {
      return item.point.map((item2: any) => {
        return { lat: parseFloat(item2.lat), lon: parseFloat(item2.lon) };
      });
    });
  else
    routeMap = [data.route?.path.point.map((item2: any) => {
      return { lat: parseFloat(item2.lat), lon: parseFloat(item2.lon) };
    })];

  return {
    agency: agency ?? { id: "", title: "", type: DataSource.NextBus, state: "", country: "", areas: undefined, typeOf: "AgencyItem" },
    route: route,
    maxStopDistance: data.route?.maxStopDistance,
    bufferedRoute: null,
    color: data.route?.color,
    oppositeColor: data.route?.oppositeColor,
    routeMap: routeMap,
    bounds: {
      min: {
        lat: parseFloat(data.route?.latMin),
        lon: parseFloat(data.route?.lonMin)
      },
      max: {
        lat: parseFloat(data.route?.latMax),
        lon: parseFloat(data.route?.lonMax)
      }
    },
    stops: stops,
    directions: directions,
    cameras: [],
    trafficLights: [],
    trafficStops: []
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
