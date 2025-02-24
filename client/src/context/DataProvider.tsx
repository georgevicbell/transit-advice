import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { DataClient, DataClientRef } from "./DataClient";
import { DataContext } from "./DataContext";
import { Advice, AgencyItem, Config, DataVehicleItem, RouteConfig, RouteItem, Server, VehicleList } from "./types";


type Props = {
  children: any;
};


export function DataProvider(props: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<Config>();
  const [server, setServer] = useState<Server>({ adminServer: "http://localhost:8080", server: "http://localhost:8079", name: "505" })
  const [agencyList, setAgencyList] = useState<AgencyItem[]>([]);
  const [advice, setAdvice] = useState<Advice[]>([]);
  const [historyList, setHistoryList] = useState<DataVehicleItem[]>([]);
  const [routeList, setRouteList] = useState<RouteItem[]>([]);
  const [routeConfig, setRouteConfig] = useState<RouteConfig[]>([]);
  const [vehicleList, setVehicleList] = useState<VehicleList[]>([]);
  const dataClientRef = useRef<DataClientRef>(null);
  const [rcIndex, setRCIndex] = useState(0);
  const currentRouteConfig = routeConfig[rcIndex]
  const getUniqueDirections = () => {
    return [...new Set(currentRouteConfig.directions.map(x => x.name) ?? [])]
  }
  const getVehiclesByDirection = (direction: string | undefined) => {
    return vehicleList[0].data.filter(x => x.direction === direction)
      .sort((a, b) => a.distanceFromStop - b.distanceFromStop) ?? []
  }
  const nextRC = () => {
    setRCIndex((x) => x + 1);
  }
  const prevRC = () => {
    setRCIndex((x) => x - 1);
  }
  const setCurrentCollisionId = (index: string) => {
    router.push(`/collision/${index}`);
  }
  const setTempAgency = (agency: AgencyItem | undefined) => {
    if (agency)
      dataClientRef.current?.setTempAgency(agency)
  }
  const saveConfig = (config: Config) => {
    dataClientRef.current?.saveConfig(config)
  }
  const saveData = () => {
    dataClientRef.current?.saveData()
  }
  return (
    <DataClient
      ref={dataClientRef}
      onReturnAdvice={setAdvice}
      onReturnAgencyList={setAgencyList}
      onReturnRouteList={setRouteList}
      onReturnRouteConfig={setRouteConfig}
      onReturnHistoryList={(vl) => {
        setHistoryList(vl)
      }}
      onReturnVehicleList={(vl) => {
        setVehicleList(vl)
        setHistoryList((x) => [...x, ...vl[0].data ?? []])
      }}
      onReturnConfig={setConfig}
      config={config}
      server={server}

    >
      <DataContext.Provider
        value={{
          setTempAgency,
          getUniqueDirections,
          getVehiclesByDirection,
          currentRouteConfig,
          server, setServer,
          historyList,
          advice,
          saveConfig,
          routeConfig,
          config,
          saveData,
          agencyList,
          routeList,
          vehicleList,
          setCurrentCollisionId,
          nextRC,
          prevRC,
        }}
      >


        {props.children}


      </DataContext.Provider>
    </DataClient >
  );
}
