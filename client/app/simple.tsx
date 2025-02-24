import { useContext } from "react"
import { Text, View } from "react-native"
import { DataContext } from "../src/context/DataContext"

export default function Simple() {
    const { getVehiclesByDirection, routeConfig, config, currentRouteConfig } = useContext(DataContext)
    const uniqueDirections = [...new Set(currentRouteConfig?.directions.map(x => x.name) ?? [])]
    return <View style={{ margin: 10, flexDirection: "column" }}>
        {uniqueDirections.map((dir, index) => {
            return <View key={index}>
                <Text>{dir}</Text>
                <View style={{ flexDirection: "row" }}>{
                    getVehiclesByDirection(dir)
                        .map((x, index) => {

                            return <View key={index} style={{ flexDirection: "row" }}>
                                {index == 0 ? <View style={{ justifyContent: "center", flexDirection: "column" }}>
                                    <View ><Text style={{ fontSize: 10 }}>Distance from First Stop</Text></View>
                                    <View style={{ justifyContent: "center" }}><Text style={{ fontSize: 10 }}>Distance to Next Bus</Text></View>

                                </View> : null
                                }
                                <View style={{ borderWidth: 1, padding: 5, margin: 5, borderRadius: 5, flexDirection: "row" }} key={index}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 10 }}>{x.id}</Text>
                                    </View>
                                </View >
                                <View style={{ justifyContent: "center", flexDirection: "column" }}>
                                    <View ><Text style={{ fontSize: 10 }}>{x.distanceFromStop.toFixed(2)} km</Text></View>
                                    {x.distanceToNextVehicle ?
                                        <View style={{ justifyContent: "center" }}><Text style={{ fontSize: 10 }}>{x.distanceToNextVehicle.toFixed(2)} km</Text></View>
                                        : <View style={{ justifyContent: "center" }}><Text style={{ fontSize: 10 }}>-</Text></View>

                                    }
                                    {x.headway ?
                                        <View style={{ justifyContent: "center" }}><Text style={{ fontSize: 10 }}>{(x.headway / 1000).toFixed(0)} seconds</Text></View>
                                        : <View style={{ justifyContent: "center" }}><Text style={{ fontSize: 10 }}>-</Text></View>

                                    }
                                </View>
                            </View>
                        })
                }
                </View>
            </View>
        })}
        <View>
            <Text>No Direction</Text>
            <View style={{ flexDirection: "row" }}>{getVehiclesByDirection(undefined)
                .map((x, index) => {
                    return <View key={index} style={{ flexDirection: "row" }}>
                        <View style={{ borderWidth: 1, padding: 5, margin: 5, borderRadius: 5, flexDirection: "row" }} key={index}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 10 }}>{x.id}</Text>
                            </View>
                        </View >
                        <View style={{ justifyContent: "center" }}><Text style={{ fontSize: 10 }}>{x.distanceFromStop.toFixed(2)} km</Text></View>
                    </View>
                })
            }
            </View>
        </View>
    </View>

}