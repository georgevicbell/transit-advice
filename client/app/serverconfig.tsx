
import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DataContext } from '../src/context/DataContext';
import { useStyleContext } from '../src/context/StyleContext';
import { AgencyItem, RouteItem } from '../src/context/types';
import { unique } from '../src/Utils';
export default function Page() {
    const styles = useStyleContext();
    if (!styles) return null
    const [country, setCountry] = useState<string>()
    const [state, setState] = useState<string>()
    const [agency, setAgency] = useState<AgencyItem>()
    const [route, setRoute] = useState<RouteItem>()
    const [bufferWidth, setBufferWidth] = useState<number>(0.1)
    const scrollViewRef = useRef<ScrollView>(null);
    var selectedViewRef = useRef<View | null>(null);
    const { config, agencyList, routeList, saveConfig, saveData, setTempAgency } = useContext(DataContext)
    const scrollToSpecific = () => {
        selectedViewRef.current?.measure((x, y) => {
            scrollViewRef.current?.scrollTo({ x: 0, y, animated: true });
        })

    }
    useEffect(() => {
        setState(config?.agency?.state)
        setCountry(config?.agency?.country)
        setAgency(config?.agency)
        setRoute(config?.route)
        setBufferWidth(config?.bufferWidth ?? 0.1)
        scrollToSpecific()

    }, [config])
    useEffect(() => {

        scrollToSpecific()
    }, [selectedViewRef.current])
    useEffect(() => {
        setTempAgency(agency)
    }, [agency])
    console.log(agencyList)
    console.log(route)
    return (
        <View style={{ flex: 1, margin: 10, padding: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Setup Route:</Text>
            <View style={{ flexDirection: "row", padding: 10, margin: 10 }}>

                <View style={{ borderWidth: 1 }}>
                    <Text style={{ padding: 10, fontWeight: "bold" }}>Country </Text>
                    <ScrollView style={{ height: 200 }}>
                        {
                            unique(agencyList, "country").map((countryS, index) => {
                                return <Pressable key={index} style={{ padding: 10, backgroundColor: country == countryS.country ? "lightgray" : undefined }} onPress={() => {
                                    setCountry(countryS.country)
                                    setState(undefined)
                                    setAgency(undefined)
                                    setRoute(undefined)
                                }}><Text>{countryS.country}</Text></Pressable>
                            })
                        }
                    </ScrollView>
                </View>
                {country && <View style={{ borderWidth: 1 }}>
                    <Text style={{ fontWeight: "bold", padding: 10 }}>Region </Text>
                    <ScrollView style={{ height: 200 }}>
                        {
                            unique(agencyList.filter(z => z.country == country), "state").map((stateS, index) => {
                                return <Pressable key={index} style={{ padding: 10, backgroundColor: state == stateS.state ? "lightgray" : undefined }} onPress={() => {
                                    setState(stateS.state)

                                    setAgency(undefined)
                                    setRoute(undefined)
                                }}><Text>{stateS.state}</Text></Pressable>
                            })
                        }
                    </ScrollView>
                </View>}
                {country && state && <View style={{ borderWidth: 1 }}>
                    <Text style={{ fontWeight: "bold", padding: 10 }}>Agency </Text>
                    <ScrollView style={{ height: 200 }}>
                        {
                            agencyList.filter(z => z.country == country).filter(z => z.state == state).map((agencyS, index) => {
                                return <Pressable key={index} style={{ padding: 10, backgroundColor: agency?.id == agencyS.id ? "lightgray" : undefined }} onPress={() => {
                                    setAgency(agencyS)
                                    setRoute(undefined)
                                }}><Text>{agencyS.title}</Text></Pressable>
                            })
                        }
                    </ScrollView>
                </View>}
                {agency && <View style={{ borderWidth: 1 }}>
                    <Text style={{ fontWeight: "bold", padding: 10 }}>Route </Text>
                    <ScrollView ref={scrollViewRef} style={{ height: 200 }}>
                        {
                            routeList?.map((routeS, index) => {
                                return <Pressable key={index} ref={(ref) => {
                                    if (routeS.id == route?.id)
                                        selectedViewRef.current = ref
                                }} style={{ padding: 10, backgroundColor: routeS.id == route?.id ? "lightgray" : undefined }} onPress={() => {
                                    setRoute(routeS)
                                }}><Text>{routeS.title}</Text></Pressable>
                            })
                        }
                    </ScrollView>
                </View>}
            </View>


            <Text>On Route Buffer Width: {(bufferWidth ?? 0.05) * 1000} meters</Text>

            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0.01}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value={bufferWidth}
                step={0.01}
                onValueChange={(value) => {
                    setBufferWidth(value)
                }}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable disabled={config?.agency?.id == agency?.id &&
                    config?.route?.id == route?.id &&
                    config?.bufferWidth == bufferWidth} style={{ borderWidth: 1, borderRadius: 5, padding: 5 }} onPress={() => {
                        if (agency && route)
                            saveConfig({ agency, route, bufferWidth })
                        else
                            alert("Please select agency and route")
                    }}>
                    <Text>Save Config</Text>
                </Pressable>
                <Pressable style={{ borderWidth: 1, borderRadius: 5, padding: 5 }} onPress={saveData}>
                    <Text>Save Data</Text>
                </Pressable>
            </View>


            <StatusBar style="auto" />
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
