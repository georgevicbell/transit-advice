import http from "http";
import WebSocket from "ws";
import TransitService from "./TransitService";
import { Advice, AgencyItem, Config, DataVehicleItem, RouteConfig, RouteItem, VehicleList } from "./types";

if (process.argv.length < 4) {
    throw new Error("Usage: node server.js <port> <config.json>")
}
const server = http.createServer()
const webSocketServer = new WebSocket.Server({ server })

const adminServer = http.createServer()
const adminWebSocketServer = new WebSocket.Server({ server: adminServer })
export type Status = {
    adminMessages: string[]
    messages: string[]
    agency: string | undefined
    route: string | undefined
    configLoaded: string
    processingConfig: string | undefined
    vehicleTimer: string
    vehicleInterval: string | undefined
    vehicleLoad: string | undefined
    vehicleData: string | undefined
    routeList: number | undefined
    configSaving: string | undefined
    dataSaving: string | undefined
    agencyList: string | number | undefined
    bufferedRoute: string | undefined
    cameras: string | number | undefined
    trafficLights: string | number | undefined
    trafficStops: string | number | undefined
    advice: string | number | undefined
    routeCount: number | undefined
}
var status: Status = {
    adminMessages: [],
    messages: [],
    configLoaded: "None",
    processingConfig: undefined,
    agency: undefined,
    route: undefined,
    vehicleTimer: "Starting...",
    vehicleInterval: undefined,
    vehicleLoad: undefined,
    vehicleData: undefined,
    routeList: undefined,
    configSaving: undefined,
    dataSaving: undefined,
    agencyList: undefined,
    bufferedRoute: undefined,
    cameras: undefined,
    trafficLights: undefined,
    trafficStops: undefined,
    advice: undefined,
    routeCount: undefined
}
const printTable = (log: any) => {
    status = {
        ...status,
        ...log
    }
    const { adminMessages: _, messages: _1, ...newObj } = status

    console.clear()
    console.table(newObj)
    console.log({ "Messages": status.messages })
    console.log({ "Admin Messages": status.adminMessages })
}
const sendConfig = async (config: Config) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            printTable({ messages: [...status.messages, "sendConfig"] })
            sendMessage(client, "responseConfig", config)
        })
}
const sendAgencyList = async (agencyList: AgencyItem[]) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            printTable({ messages: [...status.messages, "sendAgencyList"] })
            sendMessage(client, "responseAgencyList", agencyList)
        })
}

const sendRouteList = async (routeList: RouteItem[]) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            printTable({ messages: [...status.messages, "sendRouteList"] })
            sendMessage(client, "responseRouteList", routeList)

        })
}
const sendRouteConfig = async (routeConfig: RouteConfig[]) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            printTable({ messages: [...status.messages, "sendRouteConfig"] })
            sendMessage(client, "responseRouteConfig", routeConfig)
        })
}
const sendVehicleList = async (vehicleList: VehicleList | undefined) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            printTable({ messages: [...status.messages, "sendVehicleList"] })
            sendMessage(client, "responseVehicleList", vehicleList)
        })
}
const sendRouteHistory = async (routeHistory: DataVehicleItem[] | undefined) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            printTable({ messages: [...status.messages, "sendRouteHistory"] })
            sendMessage(client, "responseRouteHistory", routeHistory)
        })
}
const sendAdvice = async (advice: Advice[]) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            printTable({ messages: [...status.messages, "sendAdvice"] })
            sendMessage(client, "responseAdvice", advice)
        })
}

const transitService = new TransitService({
    onConfigUpdate: sendConfig,
    onAgencyListUpdate: sendAgencyList,
    onRouteListUpdate: sendRouteList,
    onRouteConfigUpdate: sendRouteConfig,
    onVehicleListUpdate: sendVehicleList,
    onAdviceUpdate: sendAdvice,
    printTable
})
//    transitService.startup()
function sendMessage(ws: any, type: string, message: any) {
    const msg = {
        type: type,
        text: message,
        id: "server",
        date: Date.now(),
    };
    ws.send(JSON.stringify(msg));
}
printTable({ clientServer: process.argv[2] })
server.listen(process.argv[2], () => {
    const address = server.address()
})
printTable({ adminServer: process.argv[3] })

adminServer.listen(process.argv[3], () => {
    const address = adminServer.address()
})
adminWebSocketServer.on('connection', function connection(ws: any) {
    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        const json = JSON.parse(data)

        switch (json.type) {
            case "saveConfig":
                printTable({ adminMessages: [...status.adminMessages, "saveConfig"] })
                transitService.saveConfig(json.text);
                sendMessage(ws, "message", "Hello from the server, saveConfig");
                break;
            case "saveData":
                printTable({ adminMessages: [...status.adminMessages, "saveData"] })

                transitService.saveData();
                sendMessage(ws, "message", "Hello from the server, saveData");
                break;
            default:
                console.log('Unknown message type: %s', json.type);
        }
    })
})
webSocketServer.on('connection', function connection(ws: any) {

    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        const json = JSON.parse(data)

        switch (json.type) {
            case "message":
                console.log('Server received: %s', json.text);
                break;
            case "requestAgencyList":
                printTable({ messages: [...status.messages, "reqAgencyList"] })
                sendAgencyList(transitService.agencyList);
                sendMessage(ws, "message", "Hello from the server, requestAgencyList");
                break;
            case "setTempAgency":
                printTable({ messages: [...status.messages, "setTempAgency"] })
                transitService.setTempAgency(json.text);
                sendMessage(ws, "message", "Hello from the server, setTempRouteList");
                break;
            case "requestRouteList":
                printTable({ messages: [...status.messages, "reqRouteList"] })
                sendRouteList(transitService.routeList);
                sendMessage(ws, "message", "Hello from the server, requestRouteList");
                break;
            case "requestRouteConfig":
                printTable({ messages: [...status.messages, "reqRouteConfig"] })
                sendRouteConfig(transitService.routeConfig);
                sendRouteHistory(Array.from(transitService.historyList));
                sendMessage(ws, "message", "Hello from the server, requestRouteConfig");
                break;
            case "requestVehicleList":
                printTable({ messages: [...status.messages, "reqVehicleList"] })
                sendVehicleList(transitService.vehicleList);
                sendMessage(ws, "message", "Hello from the server, requestVehicleList");
                break;
            case "requestConfig":
                printTable({ messages: [...status.messages, "reqConfig"] })
                sendConfig(transitService.config);
                sendRouteConfig(transitService.routeConfig);
                sendRouteHistory(Array.from(transitService.historyList));
                sendRouteList(transitService.routeList);
                sendAdvice(transitService.advice);
                sendMessage(ws, "message", "Hello from the server, requestConfig");
                break;


            default:
                console.log('Unknown message type: %s', json.type);
        }



    });

    // sendMessage(ws, "message", "Hello from the server")
});