
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, Text as TextR, View } from 'react-native';
import Svg, { Circle, Line, Text } from 'react-native-svg';
import Chip from "../src/components/Chip";
import { DataContext } from '../src/context/DataContext';
import { useStyleContext } from '../src/context/StyleContext';
import { getConfigFromDir } from '../src/context/types';
import MapView from "../src/MapView/MapView";
type Props = {
    x: number,
    y: number,
    xPrev: number | undefined,
    yPrev: number | undefined,
    index: number
    color: string | undefined
    noLine: boolean
    noCircle: boolean
}
function CircleLine(props: Props) {

    const { x, y, xPrev, yPrev, index } = props


    return <>
        {!props.noCircle && <Circle key={index} cx={x} cy={y} r={2} fill={props.color} />}

        {index > 0 && !props.noLine && <Line x1={xPrev} x2={x} y1={yPrev} y2={y} stroke={props.color} strokeWidth={1} />}
    </>
}
export default function Page() {
    const styles = useStyleContext();
    const mapViewRef = useRef<MapView>(null);
    if (!styles) return null
    const { historyList, vehicleList, config, agencyList, routeList, routeConfig } = useContext(DataContext)
    const [showStops, setShowStops] = React.useState<{ [id: string]: boolean }>({})
    const [time, setTime] = useState("60")

    const maxLength = routeConfig?.maxStopDistance ?? 0

    const groupBuses = Object.groupBy(historyList, ({ id }) => id);
    const dirs = Object.groupBy(routeConfig?.directions ?? [], ({ name }) => name);

    return (
        <View style={{ flex: 1 }}>
            <TextR >{config?.agency?.title} - {config?.route?.title} </TextR>
            <View style={{ flexDirection: "column", }}>
                <Chip onPress={() => time == "24" ? setTime("60") : setTime("24")} value={time == "24"} >24 hour</Chip>
                {
                    Object.keys(dirs).map(z => {
                        return <View style={{ flexDirection: "row", flexWrap: "wrap" }} key={z}>
                            <TextR>{z}</TextR>
                            {
                                routeConfig?.directions.filter(d => d.name == z).map((direction, index) => {
                                    return <Chip key={index} onPress={(x) => {
                                        setShowStops(z1 => {
                                            const d1 = { ...z1 }
                                            d1[direction.id] = x
                                            return d1
                                        }
                                        )
                                    }} value={showStops[direction.id]}>{direction.title}</Chip>
                                })
                            }
                        </View>
                    })

                }
            </View>
            <Svg height="100%" width="100%" viewBox="-200 -100 2300 1200">
                <Line x1="0" x2="0" y1="0" y2="1000" stroke="black" strokeWidth={2} />
                <Line x1="0" x2="2000" y1="1000" y2="1000" stroke="black" strokeWidth={2} />
                {[...Array(Math.floor(maxLength) + 1)].map((_, index) => {
                    const x = 1000 - index * 1000 / maxLength

                    return <Text key={index} fontFamily="Arial" fontSize={"18"} verticalAlign="center" textAnchor="end" x={-70} y={x} fill="black">{index} km</Text>

                })}
                {
                    time == "24" ?
                        [...Array(24)].map((_, index) => {
                            const x = index * 2000 / 24
                            return <Text key={index} fontFamily="Arial" fontSize={"18"} textAnchor="start" x={x} y={1020} fill="black">{index} hours</Text>
                        })
                        : [...Array(12)].map((_, index) => {
                            const x = index * 2000 / 12
                            return <Text key={index} fontFamily="Arial" fontSize={"18"} textAnchor="start" x={x} y={1020} fill="black">{index * 5} minutes</Text>
                        })
                }
                {
                    time == "24" ?
                        [...Array(24)].map((_, index) => {
                            const x = index * 2000 / 24
                            return <Line key={index} x1={x} x2={x} y1={0} y2={1000} stroke="lightGray" strokeWidth={1} />
                        })
                        : [...Array(60)].map((_, index) => {
                            const x = index * 2000 / 60
                            return <Line key={index} x1={x} x2={x} y1={0} y2={1000} stroke="lightGray" strokeWidth={1} />
                        })
                }
                {routeConfig?.directions.map((direction, index) => {
                    if (showStops[direction.id]) {
                        const stops = direction.stops.map((stop, index) => {
                            const title = routeConfig?.stops.filter((configStop) => configStop.id === stop.id)[0].title
                            const x = 1000 - (stop.distanceFromStart / maxLength * 1000)
                            return <React.Fragment key={index}>
                                <Line x1={0} x2={2000} y1={x} y2={x} stroke="lightGray" strokeWidth={1} />
                                <Text fontFamily="Arial" fontSize={"12"} textAnchor="end" x={2000} y={x} fill="darkGray">{title}</Text>
                            </React.Fragment>
                        })

                        return (
                            <>
                                {stops}
                                <Text fontFamily="Arial" fontWeight={"bold"} fontSize={"20"} textAnchor="middle" x="1000" y={1100 + index * 50} fill="black" > {direction.title}</Text>
                            </>

                        )
                    }
                })
                }
                {
                    Object.keys(groupBuses).map((group: any, index) => {

                        return groupBuses[group]!.map((vehicle, index) => {

                            var prevVehicle, yPrev, m1Prev, xPrev, y, noLine = false
                            const lastTime = historyList[historyList.length - 1].lastTime
                            const firstTime = historyList[0].lastTime

                            const config = getConfigFromDir(vehicle.direction ?? "")

                            if (index > 0) {
                                prevVehicle = groupBuses[group]![index - 1]


                                const prevConfig = getConfigFromDir(prevVehicle.direction ?? "")
                                if (prevVehicle.distanceFromStop == -1) noLine = true
                                //     if (prevConfig.isFlip)
                                //         yPrev = ((((routeConfig?.maxStopDistance ?? 0) - prevVehicle.distanceFromStop) / maxLength) * 1000)
                                //     else
                                yPrev = ((prevVehicle.distanceFromStop / maxLength) * 1000)
                                m1Prev = -prevVehicle.lastTime + lastTime
                                xPrev = (m1Prev / 3600) * 2
                                if (time == "24")
                                    xPrev = xPrev / 24
                            }

                            //   if (config.isFlip)
                            //       y = ((((routeConfig?.maxStopDistance ?? 0) - vehicle.distanceFromStop) / maxLength) * 1000)
                            //   else
                            y = ((vehicle.distanceFromStop / maxLength) * 1000)
                            if (vehicle.distanceFromStop == -1) noLine = true
                            const m1: number = -vehicle.lastTime + lastTime
                            var x = (m1 / 3600) * 2
                            if (time == "24")
                                x = x / 24
                            return <React.Fragment key={index}>
                                {(groupBuses[group]!.length == index + 1) ?
                                    <Text fontFamily="Arial" fontWeight={"bold"} fontSize={"10"} textAnchor="end" x="-10" y={y} fill={config.color}>{vehicle.id}</Text> : <></>}
                                <CircleLine noCircle={time == "24"} noLine={noLine} color={config.color} key={index} x={x} y={y} index={index} xPrev={xPrev} yPrev={yPrev} />
                            </React.Fragment>
                        }
                        )
                    })
                    ?? <></>
                }
            </Svg>



        </View >
    );
}

// Open WebSocket connection to ShareDB server

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
