import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Advice, AgencyItem, Config, DataVehicleItem, RouteConfig, RouteItem, Server, VehicleList } from "./types";
export function useVZeroContext() {
  return useContext(DataContext);
}
export type DataContext = {
  server: Server
  setServer: Dispatch<SetStateAction<Server>>
  agencyList: AgencyItem[]
  routeList: RouteItem[]
  routeConfig: RouteConfig[]
  setCurrentCollisionId: (index: string) => void
  config: Config | undefined
  currentRouteConfig: RouteConfig | undefined
  setTempAgency: (agency: AgencyItem | undefined) => void
  advice: Advice[]
  vehicleList: VehicleList[]
  getVehiclesByDirection: (direction: string | undefined) => DataVehicleItem[]
  getUniqueDirections: () => string[]
  saveConfig: (config: Config) => void
  saveData: () => void
  nextRC: () => void
  prevRC: () => void
  historyList: DataVehicleItem[]
};
export const DataContext = createContext<DataContext>({
  server: {
    name: "505",
    server: "http://localhost:8079",
    adminServer: "http://localhost:8080"
  },
  nextRC: () => { },
  prevRC: () => { },
  getUniqueDirections: () => [],
  getVehiclesByDirection: () => [],
  setTempAgency: () => { },
  currentRouteConfig: undefined,
  advice: [],
  setServer: () => { },
  saveConfig: () => { },
  saveData: () => { },
  agencyList: [],
  routeList: [],
  config: { static: false, route: undefined, agency: undefined, bufferWidth: 0.05 },
  routeConfig: [],

  setCurrentCollisionId: () => { },
  vehicleList: [],
  historyList: []
});

