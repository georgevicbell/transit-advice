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
  const [routeConfig, setRouteConfig] = useState<RouteConfig | undefined>();
  const [vehicleList, setVehicleList] = useState<VehicleList | undefined>();
  const dataClientRef = useRef<DataClientRef>(null);
  const getUniqueDirections = () => {
    return [...new Set(routeConfig?.directions.map(x => x.name) ?? [])]
  }
  const getVehiclesByDirection = (direction: string | undefined) => {
    return vehicleList?.data.filter(x => x.direction === direction)
      .sort((a, b) => a.distanceFromStop - b.distanceFromStop) ?? []
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
        setHistoryList((x) => [...x, ...vl?.data ?? []])
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
        }}
      >


        {props.children}


      </DataContext.Provider>
    </DataClient >
  );
}
