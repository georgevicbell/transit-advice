import { View } from "react-native";
import Svg, { G, Line, Rect, Text } from "react-native-svg";

export default function Simple() {
    type Route = {
        stops: { id: string, x: number, stopView: { y: number, height: number }[] }[]
        lines: { stops: string[], color: string }[]
    }
    function drawLines(map: Route) {
        return <G>
            {map.lines.map((line, index) => {
                const firstStop = line.stops[0]
                const lastStop = line.stops[line.stops.length - 1]
                const firstStopIndex = map.stops.findIndex(x => x.id == firstStop)
                const lastStopIndex = map.stops.findIndex(x => x.id == lastStop)
                const x1 = map.stops[firstStopIndex].x + 5
                const y1 = index * 20
                const x2 = map.stops[lastStopIndex].x + 5
                const y2 = index * 20
                return <Line key={index} x1={x1} x2={x2} y1={y1} y2={y2} stroke={line.color} strokeWidth={10} />
            })}

        </G>
    }
    function drawStops(route: Route) {

        return <G>
            {route.stops.map(({ id, x, stopView }, index) => {
                return stopView.map(({ y, height }, index) => {
                    if (height > 0)
                        return <G key={index}>
                            <Rect x={x} y={y} width={10} height={height} rx="5" ry="5" fill="white" stroke="black" strokeWidth={3} />
                            <Text x={x + 15} y={y} fontSize="10">{id}</Text>
                        </G>
                })
            })}

        </G>
    }
    function calcRouteLocations(route: Route) {
        route.stops = route.stops.map((stop, index) => {
            var stopView: { y: number, height: number }[] = []
            var stopV = { y: -5, height: 0 }
            var hCount = 0
            route.lines.forEach((line, index2) => {
                if (line.stops.includes(stop.id)) {
                    stopV = { y: stopV.y, height: (20 * (hCount)) + 10 }
                }
                if (!line.stops.includes(stop.id)) {
                    if (hCount > 0) {
                        stopView.push(stopV)
                        stopV = { y: (20 * index2) - 5, height: 0 }
                    }
                    hCount = -1
                    stopV = { y: stopV.y + 20, height: 0 }

                }
                hCount++

            })
            stopView.push(stopV)

            return { id: stop.id, x: index * 40, stopView: stopView }
        })
        return route
    }
    var route: Route = {
        stops: [
            { id: "A", x: -1, stopView: [] },
            { id: "B", x: -1, stopView: [] },
            { id: "C", x: -1, stopView: [] },
            { id: "D", x: -1, stopView: [] },
            { id: "E", x: -1, stopView: [] }],
        lines: [
            { stops: ["A", "B", "C", "D", "E"], color: "red" },
            { stops: ["A", "B", "D", "E"], color: "blue" },

        ],
    }
    var route2: Route = {
        stops: [
            { id: "A", x: -1, stopView: [] },
            { id: "B", x: -1, stopView: [] },
            { id: "C", x: -1, stopView: [] },
            { id: "D", x: -1, stopView: [] },
            { id: "E", x: -1, stopView: [] },
            { id: "F", x: -1, stopView: [] },
            { id: "G", x: -1, stopView: [] },
            { id: "H", x: -1, stopView: [] },
        ],
        lines: [
            { stops: ["A", "C", "D", "E", "H"], color: "red" },
            { stops: ["B", "D", "E", "F", "H"], color: "blue" },
            { stops: ["B", "C", "E", "G"], color: "green" },
            { stops: ["B", "C", "D", "E", "F", "G"], color: "darkgray" },
        ],
    }
    route = calcRouteLocations(route)
    route2 = calcRouteLocations(route2)
    return <View>


        <Svg height="50%" width="50%" viewBox="-20 -20 500 500">
            {drawLines(route2)}
            {drawStops(route2)}
        </Svg>
    </View>
}
