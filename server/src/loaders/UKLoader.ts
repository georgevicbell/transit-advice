import { XMLParser } from "fast-xml-parser";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";

import { AgencyItem, DataRouteStopItem, DataRouteStopTimeItem, DataSource, DataVehicleItem, RouteConfig, RouteItem, VehicleList } from '../types';
import { unique } from "../utils/Utils";
import { fetchCachedZip } from "./FetchFileSystem";
import TransitData from "./TransitData.json";

export async function UKLoader(): Promise<Record<string, any>> {
  try {
    const file = await fetch(
      "https://naptan.api.dft.gov.uk/v1/nptg"
    );

    const xmlParser = new XMLParser({
      ignoreDeclaration: true,
      ignorePiTags: true,
      ignoreAttributes: true,
      processEntities: false,

      attributeNamePrefix: "@_",
      stopNodes: ["*.PlusbusZones"],
    });
    const text = await file.text();
    const start = text.indexOf("<NptgLocalities>");
    const end = text.indexOf("</NptgLocalities>") + "</NptgLocalities>".length;
    const z2 = text.substring(0, start) + text.substring(end, text.length);

    const start2 = z2.indexOf("<PlusbusZones>");
    const end2 = z2.indexOf("</PlusbusZones>") + "</PlusbusZones>".length;
    const z3 = z2.substring(0, start2) + z2.substring(end2, z2.length);

    const json = xmlParser.parse(z3);
    return json;
  } catch (e) {
    console.log(e);
    return {};
  }
}
export async function UKTransformAgencies(
  data: Record<string, any>
): Promise<AgencyItem[]> {
  const result = data.NationalPublicTransportGazetteer.Regions.Region.map(
    (z: any) => {
      const areas = z?.AdministrativeAreas?.AdministrativeArea;
      return {
        id: z.RegionCode,
        title: z.Name,
        type: DataSource.UK,
        state: "United Kingdom",
        country: "England",
        typeOf: "AgencyItem",
        areas: Array.isArray(areas)
          ? areas.map((zz: any) => {
            return {
              id: zz.AdministrativeAreaCode,
              title: zz.Name.replace("&amp;", "&").replace("National - ", ""),
            };
          })
          : [
            {
              id: areas.AdministrativeAreaCode,
              title: areas.Name.replace("&amp;", "&").replace(
                "National - ",
                ""
              ),
            },
          ],
      };
    }
  );

  return result;
}
export function UKTransformVehicles(
  data: GtfsRealtimeBindings.transit_realtime.FeedMessage | null
): VehicleList {
  const output = {
    lastTime: (data?.entity[0]?.vehicle?.timestamp ?? 0) as number,
    data:
      data?.entity.map((z) => {
        return {
          id: z.vehicle?.vehicle?.id ?? "",
          title: z.vehicle?.vehicle?.label ?? "",
          position: {
            lat: z.vehicle?.position?.latitude ?? 0,
            lon: z.vehicle?.position?.longitude ?? 0
          },
          heading: z.vehicle?.position?.bearing ?? "",
        } as DataVehicleItem;
      }) ?? [],
  };
  console.log(output);
  return output;
}
export async function UKVehicleLoader(
  routeId: string
): Promise<GtfsRealtimeBindings.transit_realtime.FeedMessage | null> {
  console.log("Vehicle Load");
  try {
    const response = await fetch(
      "https://data.bus-data.dft.gov.uk/api/v1/gtfsrtdatafeed/?api_key=8579e190d87d7ebd269062a0920d3879fc508471&startTimeAfter=0&routeId=" +
      routeId,
      {
        headers: {
          "x-api-key": "8579e190d87d7ebd269062a0920d3879fc508471",
        },
      }
    );
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
      //  error.response = response;
      throw error;
    }
    console.log("Loading");
    const buffer = await response.arrayBuffer();
    console.log("Buffered");
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    console.log(feed.entity);
    console.log("Feed");
    // console.log(feed);
    return feed;
  } catch (e) {
    console.log(e);
    return null;
  }
}
type GTFSOutput = {
  routes: string | undefined;
  agency: string | undefined;
  trips: string | undefined;
  stops: string | undefined;
  shapes: string | undefined;
  stopTimes: string | undefined;
};
export async function UKRouteLoader(agencyId: string): Promise<GTFSOutput> {
  const regionTransitData = TransitData.UKLoader.filter(
    (z: { RegionCode: string; }) => z.RegionCode == agencyId
  )[0];
  if (regionTransitData.onS3) {
    const routesP = fetch(regionTransitData.routeUrl)
    const agencyP = fetch(regionTransitData.agencyUrl)
    const downloadList = await Promise.all([routesP, agencyP])
    const downloadText = downloadList.map(z => z.text())
    const [routes, agency] = await Promise.all(downloadText)
    return {
      routes,
      agency,
      trips: undefined,
      stops: undefined,
      shapes: undefined,
      stopTimes: undefined,
    };
  } else {
    const [routes, agency] = await fetchCachedZip(
      regionTransitData.gtfs +
      "UKLoaded" + regionTransitData.RegionCode + ".zip",
      [
        {
          file: "routes.txt",
          cache: "UKLoaded" + regionTransitData.RegionCode + "routes.txt",
        },
        {
          file: "agency.txt",
          cache: "UKLoaded" + regionTransitData.RegionCode + "agency.txt",
        },
      ]
    );
    return {
      routes,
      agency,
      trips: undefined,
      stops: undefined,
      shapes: undefined,
      stopTimes: undefined,
    };
  }

}
const getGroup = (z: string) => {
  switch (z) {
    case "0":
      return "Tram";
    case "1":
      return "Metro";
    case "2":
      return "Rail";
    case "200":
      return "Coach Service";
    case "3":
      return "Bus";
    case "4":
      return "Ferry";
    case "5":
      return "Cable tram";
    case "6":
      return "Aerial";
    case "7":
      return "Funicular";
    case "11":
      return "Trolleybus";
    case "12":
      return "Monorail";
  }
  return "Unknown";
};
function trimChar(string: string, charToRemove: string) {
  while (string.charAt(0) == charToRemove) {
    string = string.substring(1);
  }

  while (string.charAt(string.length - 1) == charToRemove) {
    string = string.substring(0, string.length - 1);
  }

  return string;
}
export async function UKTransformRoutes(
  data: GTFSOutput
): Promise<RouteItem[]> {
  const agency =
    data.agency?.split("\n").map((z: any) => {
      const details = z.split(",");
      return {
        id: trimChar(details[0] ?? "", '"'),
        title: trimChar(details[1] ?? "", '"'),
      };
    }) ?? [];

  const result: RouteItem[] =
    data.routes?.split("\n").map((z: any) => {
      const details = z.split(",");
      const agencyName = agency.filter(
        (z) => z.id == trimChar(details[1] ?? "", '"')
      )[0].title;
      return {
        id: trimChar(details[0] ?? "", '"'),
        title: trimChar(details[2] ?? "", '"'),
        group: getGroup(trimChar(details[4] ?? "", '"')),
        operator: agencyName,
        type: DataSource.UK,
        typeOf: "RouteItem",
      };
    }) ?? [];
  const result1 = result.filter((z) => z.id != "route_id").filter((z) => z.id);
  const result2 = result1.sort((a, b) => {
    return a?.title?.localeCompare(b?.title);
  });
  const result3 = unique(result2, "id");
  return result3;
}

export async function UKRouteConfigLoader(
  agencyId: string,
  routeId: string
): Promise<GTFSOutput> {
  const regionTransitData = TransitData.UKLoader.filter(
    (z: { RegionCode: string; }) => z.RegionCode == agencyId
  )[0];
  if (regionTransitData.onS3) {
    const tripsP = fetch(regionTransitData.tripsUrl)
    const stopsP = fetch(regionTransitData.stopsUrl)
    const shapesP = fetch(regionTransitData.shapesUrl)
    const stopTimesP = fetch(regionTransitData.stopTimesUrl)
    const downloadList = await Promise.all([tripsP, stopsP, shapesP, stopTimesP])
    const downloadText = downloadList.map(z => z.text())
    const [trips, stops, shapes, stopTimes] = await Promise.all(downloadText)
    console.log("DONE LOADING");
    return {
      trips,
      stops,
      shapes,
      stopTimes,
      routes: undefined,
      agency: undefined,
    };
  } else {
    const [trips, stops, shapes, stopTimes] = await fetchCachedZip(
      regionTransitData.gtfs +
      "UKLoaded" + regionTransitData.RegionCode + ".zip",
      [
        {
          file: "trips.txt",
          cache: "UKLoaded" + regionTransitData.RegionCode + "trips.txt",
        },
        {
          file: "stops.txt",
          cache: "UKLoaded" + regionTransitData.RegionCode + "stops.txt",
        },
        {
          file: "shapes.txt",
          cache: "UKLoaded" + regionTransitData.RegionCode + "shapes.txt",
        },
        {
          file: "stop_times.txt",
          cache: "UKLoaded" + regionTransitData.RegionCode + "stop_times.txt",
        },
      ]
    );
    console.log("DONE LOADING");
    return {
      trips,
      stops,
      shapes,
      stopTimes,
      routes: undefined,
      agency: undefined,
    };
  }
}
const getStops = (stops: string | undefined) => {
  const stopsData = stops?.split("\n");
  return stopsData?.map((stop) => {
    const stopInfo = stop.split(",");
    if (stopInfo[0] == "stop_id") return undefined;
    return {
      id: stopInfo[0],
      title: stopInfo[2],
      position: {
        lat: parseFloat(stopInfo[3]),
        lon: parseFloat(stopInfo[4])
      }
    };
  })
    .filter((item) => item != undefined) as DataRouteStopItem[];
}
const getShapes = (shapes: string | undefined) => {
  const shapesData = shapes?.split("\n");
  return shapesData?.map((shape) => {
    if (shape.length <= 1) return undefined;
    const shapeInfo = shape.split(",");
    if (shapeInfo[0] == "shape_id") return undefined;
    return {
      id: shapeInfo[0],
      lat: shapeInfo[1],
      lon: shapeInfo[2],
    };
  })
    .filter((item) => item != undefined);
}
const getTrips = (trips: string | undefined) => {
  const tripsData = trips?.split("\n")

  return tripsData?.map((trip) => {
    if (trip.length <= 1) return undefined;
    const tripInfo = trip.split(",");
    if (tripInfo.length <= 1) return undefined;
    if (tripInfo[0] == "route_id") return undefined;
    return {
      id: tripInfo[2],
      routeId: tripInfo[0],
      serviceId: tripInfo[1],
      tripHeadSign: tripInfo[3],
      shapeId: tripInfo[5],
    }
  }).filter((item) => item != undefined)
}
const getStopTimes = (stopTimes: string | undefined) => {
  const stopTimesData = stopTimes?.split("\n");
  return stopTimesData
    ?.map((stopTime) => {
      const stopTimeInfo = stopTime.split(",");
      if (stopTimeInfo[0] == "trip_id") return undefined;
      return {
        tripId: stopTimeInfo[0],
        stopId: stopTimeInfo[3],
      };
    })
    .filter((item) => item != undefined) as DataRouteStopTimeItem[];

}
export function UKTransformRouteConfig(
  data: GTFSOutput,
  routeId: string
): RouteConfig {
  console.log("Start UK Transform Complete");
  const stops = getStops(data.stops)
  const shapes = getShapes(data.shapes);
  const trips = getTrips(data.trips)
  const stopTimes = getStopTimes(data.stopTimes)
  console.log("UK Transform Complete");

  const activeTrips = trips?.filter((z) => { return z?.routeId == routeId });
  const activeTripIds = unique(activeTrips ?? [], "id").map((z) => z.id);
  console.log(activeTripIds);
  const activeShapeIds = unique(activeTrips ?? [], "shapeId").map(
    (z) => z.shapeId
  );
  console.log("SPLIT6");
  console.log(shapes?.length)
  const activeShapes = shapes?.filter((z) => {
    if (z == undefined) return false;
    return activeShapeIds.includes(z.id);
  });
  console.log(activeShapes)
  console.log("SPLIT7");
  const isRoute = (item: { lat: number; lon: number; } | undefined): item is { lat: number; lon: number; } => {
    return !!item
  }
  const routeMap =
    activeShapes
      ?.map((shape) => {
        if (shape == undefined) return undefined;
        return {
          lat: parseFloat(shape.lat),
          lon: parseFloat(shape.lon),
        };
      })
      .filter(isRoute) ?? [];
  console.log(routeMap)
  const stopIds = stopTimes
    ?.filter((z) => activeTripIds.includes(z.tripId))
    .map((z) => z.stopId);
  const stopMap = stopIds
    .map((stopId) => {
      return stops?.filter((z) => z.id == stopId);
    })
    .flat();

  return {
    maxStopDistance: 0.1,
    bufferedRoute: null,
    directions: [],
    cameras: [],
    trafficLights: [],
    color: "ff0000",
    oppositeColor: "00ffff",
    routeMap: [routeMap],
    bounds: {
      min: {
        lat: 1,
        lon: 2
      },
      max: {
        lat: 3,
        lon: 4,
      }
    },
    stops: stopMap,
  };
}
