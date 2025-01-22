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
  routeConfig: RouteConfig | undefined
  setCurrentCollisionId: (index: string) => void
  config: Config | undefined
  setConfig: Dispatch<SetStateAction<Config | undefined>>

  advice: Advice[]
  vehicleList: VehicleList | undefined
  getVehiclesByDirection: (direction: string | undefined) => DataVehicleItem[]
  getUniqueDirections: () => string[]
  saveConfig: () => void
  saveData: () => void
  historyList: DataVehicleItem[]
};
export const DataContext = createContext<DataContext>({
  server: {
    name: "505", server:
      "http://localhost:8080"
  },
  getUniqueDirections: () => [],
  getVehiclesByDirection: () => [],
  advice: [],
  setServer: () => { },
  saveConfig: () => { },
  saveData: () => { },
  agencyList: [],
  routeList: [],
  config: { route: undefined, agency: undefined, bufferWidth: 0.05 },
  routeConfig: undefined,
  setConfig: () => { },
  setCurrentCollisionId: () => { },
  vehicleList: undefined,
  historyList: []
});

