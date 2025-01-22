
import { Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { Advice, AgencyItem, Config, DataVehicleItem, RouteConfig, RouteItem, Server, VehicleList } from "./types";


type PropsDataClient = {

    children: any
    onReturnHistoryList: (vl: DataVehicleItem[]) => void;
    onReturnVehicleList: (vl: VehicleList) => void;
    onReturnConfig: Dispatch<SetStateAction<Config | undefined>>
    onReturnAgencyList: Dispatch<SetStateAction<AgencyItem[]>>
    onReturnRouteList: Dispatch<SetStateAction<RouteItem[]>>
    onReturnAdvice: Dispatch<SetStateAction<Advice[]>>
    onReturnRouteConfig: Dispatch<SetStateAction<RouteConfig | undefined>>
    server: Server
    config: Config | undefined
}
export type DataClientRef = {
    saveConfig: () => void
    saveData: () => void
}
export const DataClient = forwardRef<DataClientRef, PropsDataClient>((props, ref) => {

    const [open, setOpen] = useState(false)

    const [clientWebSocket, setClientWebSocket] = useState<WebSocket | undefined>(undefined)

    useImperativeHandle(ref, () => {
        return {
            saveData: () => {
                sendMessage("saveData", "")
            },
            saveConfig: () => {
                sendMessage("saveConfig", "")
            }

        }
    })
    const setupSocket = (socket: WebSocket) => {

        socket.onmessage = ((a: any) => {
            const json = JSON.parse(a.data)
            if (json.type == "message")
                console.log(json.text)
            else if (json.type == "responseAgencyList") {
                console.log("SETTING AGENCY LIST")
                const z = json.text as AgencyItem[]
                props.onReturnAgencyList(z)
            }
            else if (json.type == "responseRouteList") {
                console.log("SETTING ROUTE LIST")
                const z = json.text as RouteItem[]
                props.onReturnRouteList(json.text)
            }
            else if (json.type == "responseRouteConfig") {
                console.log("SETTING ROUTE CONFIG")
                const z = json.text as RouteConfig
                //  console.log(z)
                props.onReturnRouteConfig(z)
            }
            else if (json.type == "responseVehicleList") {
                console.log("SETTING VEHICLE LIST")
                const z = json.text as VehicleList
                // console.log(z)
                props.onReturnVehicleList(z)
            }
            else if (json.type == "responseConfig") {
                console.log("SETTING CONFIG")
                const z = json.text as Config
                props.onReturnConfig(z)
            }
            else if (json.type == "responseRouteHistory") {
                console.log("SETTING HISTORY LIST")
                const z = json.text as DataVehicleItem[]
                props.onReturnHistoryList(z)
            }
            else if (json.type == "responseAdvice") {
                console.log("SETTING ADVICE")
                const z = json.text as Advice[]
                props.onReturnAdvice(z)
            }
        })
        socket.onopen = () => {
            console.log("OPEN")
            setOpen(true)
        }
        socket.onerror = () => { console.log("ERROR") }

        socket.onclose = () => {

            setOpen(false)
            setClientWebSocket(undefined)
            console.log("CLOSED")
        }
        return socket
    }
    useEffect(() => {
        const socket = new WebSocket(props.server.server)
        setClientWebSocket(setupSocket(socket))
    }, [])

    useEffect(() => {
        console.log("CLOSING - SERVER CHANGE")
        clientWebSocket?.close()
    }, [props.server])





    useEffect(() => {

        if (open) {
            sendMessage("message", "Hello from the client")
            requestAgencyList()
            requestConfig()
        } else {
            console.log("Trying to open again: " + props.server.server)
            const socket = new WebSocket(props.server.server)
            setClientWebSocket(setupSocket(socket))
        }
    }, [open])
    const sendMessage = (type: any, msg: any) => {
        if (clientWebSocket) {
            const msgComplete = {
                type: type,
                text: msg,
                id: "webClient",
                date: Date.now(),
            };
            clientWebSocket.send(JSON.stringify(msgComplete))

        }
    }

    const requestAgencyList = () => {
        sendMessage("requestAgencyList", "")
    }
    const requestConfig = () => {
        sendMessage("requestConfig", "")
    }

    // const onReturnRouteList = (returnRouteList: RouteItem[]) => { }
    return <View style={{ flex: 1 }}>{props.children}</View>
})