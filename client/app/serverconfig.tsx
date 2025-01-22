
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DataContext } from '../src/context/DataContext';
import { useStyleContext } from '../src/context/StyleContext';

export default function Page() {
    const styles = useStyleContext();
    if (!styles) return null
    const { config, setConfig, agencyList, routeList, saveConfig, saveData } = useContext(DataContext)

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text>Agency: </Text>
                <Picker
                    selectedValue={config?.agency?.id}
                    onValueChange={(itemValue, itemIndex) => {
                        const item = agencyList.filter(z => { return z.id == itemValue })[0]
                        console.log(item)
                        setConfig({ agency: item, route: config?.route, bufferWidth: config?.bufferWidth ?? 0.05 })
                    }
                    }>
                    {agencyList?.map((z: any) => { return <Picker.Item key={z.id} label={z.title} value={z.id} /> })}

                </Picker>
                <Text>Route:</Text>
                <Picker
                    selectedValue={config?.route?.id}
                    onValueChange={(itemValue, itemIndex) => {
                        const item = routeList.filter(z => { return z.id == itemValue })[0]
                        console.log(item)
                        setConfig({ agency: config?.agency, route: item, bufferWidth: config?.bufferWidth ?? 0.05 })
                    }
                    }>
                    {routeList?.map((z: any) => { return <Picker.Item key={z.id} label={z.title} value={z.id} /> })}

                </Picker>
                <Text>On Route Buffer Width: {(config?.bufferWidth ?? 0.05) * 1000} meters</Text>

                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={0.01}
                    maximumValue={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    value={config?.bufferWidth}
                    step={0.01}
                    onValueChange={(value) => {
                        setConfig({ agency: config?.agency, route: config?.route, bufferWidth: value })
                    }}
                />

                <Pressable onPress={saveConfig}>
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
