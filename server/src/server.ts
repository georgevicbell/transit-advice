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

const sendConfig = async (config: Config) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            console.log("Sending config")
            sendMessage(client, "responseConfig", config)
        })
}
const sendAgencyList = async (agencyList: AgencyItem[]) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            console.log("Sending agencyList")
            sendMessage(client, "responseAgencyList", agencyList)
        })
}

const sendRouteList = async (routeList: RouteItem[]) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            console.log("Sending routeList")
            sendMessage(client, "responseRouteList", routeList)

        })
}
const sendRouteConfig = async (routeConfig: RouteConfig | undefined) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            console.log("Sending routeConfig")
            sendMessage(client, "responseRouteConfig", routeConfig)
        })
}
const sendVehicleList = async (vehicleList: VehicleList | undefined) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            console.log("Sending vehicleList")
            sendMessage(client, "responseVehicleList", vehicleList)
        })
}
const sendRouteHistory = async (routeHistory: DataVehicleItem[] | undefined) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            console.log("Sending routeHistory")
            sendMessage(client, "responseRouteHistory", routeHistory)
        })
}
const sendAdvice = async (advice: Advice[]) => {
    webSocketServer.clients.forEach(
        (client: any) => {
            console.log("Sending advice")
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
    //console.log("Sent: " + JSON.stringify(msg))
}
console.log({ 'server port': process.argv[2] })
server.listen(process.argv[2], () => {
    const address = server.address()
})
console.log({ 'adminServer port': process.argv[3] })
adminServer.listen(process.argv[3], () => {
    const address = adminServer.address()
})
adminWebSocketServer.on('connection', function connection(ws: any) {
    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        const json = JSON.parse(data)

        switch (json.type) {
            case "saveConfig":
                console.log('Server received: saveConfig - ' + json.text);
                transitService.saveConfig(json.text);
                sendMessage(ws, "message", "Hello from the server, saveConfig");
                break;
            case "saveData":
                console.log('Server received: saveData - ' + json.text);
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
                console.log('Server received:requestAgencyList');
                console.log(transitService.agencyList.length);
                sendAgencyList(transitService.agencyList);
                sendMessage(ws, "message", "Hello from the server, requestAgencyList");
                break;
            case "setTempAgency":
                console.log('Server received: setTempAgency - ' + json.text);
                transitService.setTempAgency(json.text);
                sendMessage(ws, "message", "Hello from the server, setTempRouteList");
                break;
            case "requestRouteList":
                console.log('Server received: requestRouteList - ' + json.text);
                sendRouteList(transitService.routeList);
                sendMessage(ws, "message", "Hello from the server, requestRouteList");
                break;
            case "requestRouteConfig":
                console.log('Server received: requestRouteConfig - ' + json.text);
                sendRouteConfig(transitService.routeConfig);
                sendRouteHistory(Array.from(transitService.historyList));
                sendMessage(ws, "message", "Hello from the server, requestRouteConfig");
                break;
            case "requestVehicleList":
                console.log('Server received: requestVehicleList - ' + json.text);
                sendVehicleList(transitService.vehicleList);
                sendMessage(ws, "message", "Hello from the server, requestVehicleList");
                break;
            case "requestConfig":
                console.log('Server received: requestConfig - ' + json.text);
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