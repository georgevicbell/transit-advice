
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
    onReturnRouteConfig: Dispatch<SetStateAction<RouteConfig[]>>
    server: Server
    config: Config | undefined
}
export type DataClientRef = {
    saveConfig: (config: Config) => void
    saveData: () => void
    setTempAgency: (agency: AgencyItem) => void
}
export const DataClient = forwardRef<DataClientRef, PropsDataClient>((props, ref) => {

    const [open, setOpen] = useState(false)
    const [openAdmin, setOpenAdmin] = useState(false)
    const [clientWebSocket, setClientWebSocket] = useState<WebSocket | undefined>(undefined)
    const [adminClientWebSocket, setAdminClientWebSocket] = useState<WebSocket | undefined>(undefined)

    useImperativeHandle(ref, () => {
        return {
            setTempAgency: (agency: AgencyItem) => {
                sendMessage("setTempAgency", agency)
            },
            saveData: () => {
                sendAdminMessage("saveData", "")
            },
            saveConfig: (config: Config) => {
                sendAdminMessage("saveConfig", config)
            }

        }
    })
    const setupAdminSocket = (adminSocket: WebSocket) => {
        adminSocket.onmessage = ((a: any) => {
            const json = JSON.parse(a.data)
        })
        adminSocket.onopen = () => {
            console.log("OPEN")
            setOpenAdmin(true)
        }
        adminSocket.onerror = () => { console.log("ERROR") }

        adminSocket.onclose = () => {

            setOpenAdmin(false)
            setClientWebSocket(undefined)
            console.log("CLOSED")
        }
        return adminSocket
    }
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
                const z = json.text as RouteConfig[]
                console.log({ routeconfig: z })
                props.onReturnRouteConfig(z)
            }
            else if (json.type == "responseVehicleList") {
                console.log("SETTING VEHICLE LIST")
                const z = json.text as VehicleList
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
        const adminSocket = new WebSocket(props.server.adminServer)
        setAdminClientWebSocket(setupAdminSocket(adminSocket))
    }, [])

    useEffect(() => {
        console.log("CLOSING - SERVER CHANGE")
        clientWebSocket?.close()
        adminClientWebSocket?.close()
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
    useEffect(() => {
        if (openAdmin) {
            sendMessage("message", "Hello from the client")
        } else {
            console.log("Trying to open again: " + props.server.adminServer)
            const adminSocket = new WebSocket(props.server.adminServer)
            setAdminClientWebSocket(setupAdminSocket(adminSocket))
        }
    }, [openAdmin])
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
    const sendAdminMessage = (type: any, msg: any) => {
        if (adminClientWebSocket) {
            const msgComplete = {
                type: type,
                text: msg,
                id: "webClientAdmin",
                date: Date.now(),
            };
            adminClientWebSocket.send(JSON.stringify(msgComplete))

        }
    }
    const requestAgencyList = () => {
        sendMessage("requestAgencyList", "")
    }
    const requestConfig = () => {
        sendMessage("requestConfig", "")
    }
    return <View style={{ flex: 1 }}>{props.children}</View>
})