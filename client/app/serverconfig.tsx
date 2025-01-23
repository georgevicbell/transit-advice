
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DataContext } from '../src/context/DataContext';
import { useStyleContext } from '../src/context/StyleContext';
import { AgencyItem, RouteItem } from '../src/context/types';

export default function Page() {
    const styles = useStyleContext();
    if (!styles) return null
    const [agency, setAgency] = useState<AgencyItem>()
    const [route, setRoute] = useState<RouteItem>()
    const [bufferWidth, setBufferWidth] = useState<number>(0.1)
    const { config, agencyList, routeList, saveConfig, saveData, setTempAgency } = useContext(DataContext)
    useEffect(() => {
        setAgency(config?.agency)
        setRoute(config?.route)
        setBufferWidth(config?.bufferWidth ?? 0.1)
    }, [config])
    useEffect(() => {
        setTempAgency(agency)
    }, [agency])
    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text>Agency: </Text>
                <Picker
                    selectedValue={agency?.id}
                    onValueChange={(itemValue, itemIndex) => {
                        const item = agencyList.filter(z => { return z.id == itemValue })[0]
                        console.log(item)
                        setAgency(item)
                    }
                    }>
                    {agencyList?.map((z: any) => { return <Picker.Item key={z.id} label={z.title} value={z.id} /> })}

                </Picker>
                <Text>Route:</Text>
                <Picker
                    selectedValue={route?.id}
                    onValueChange={(itemValue, itemIndex) => {
                        const item = routeList.filter(z => { return z.id == itemValue })[0]
                        console.log(item)
                        setRoute(item)
                    }
                    }>
                    {routeList?.map((z: any) => { return <Picker.Item key={z.id} label={z.title} value={z.id} /> })}

                </Picker>
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

                <Pressable onPress={() => {
                    saveConfig({ agency, route, bufferWidth })
                }}>
                    <Text>Save Config</Text>
                </Pressable>
                <Pressable onPress={saveData}>
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
