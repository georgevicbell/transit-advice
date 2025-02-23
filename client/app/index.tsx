
import { Image } from "expo-image";
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Chip from "../src/components/Chip";
import VZModal from '../src/components/VZModal';
import { DataContext } from '../src/context/DataContext';
import { useStyleContext } from '../src/context/StyleContext';
import { CameraItem, getConfigFromDir } from '../src/context/types';
import { Bus } from '../src/MapView/MapItems/Bus';
import { Camera } from '../src/MapView/MapItems/Camera';
import { Stop } from '../src/MapView/MapItems/Stop';
import { TrafficLight } from '../src/MapView/MapItems/TrafficLight';
import { TrafficStop } from "../src/MapView/MapItems/TrafficStop";
import { mapStyle } from '../src/MapView/mapStyle';
import MapView, { Marker, Polygon, Polyline } from "../src/MapView/MapView";
import { LatLng } from "../src/MapView/MapView.web";
const googleMapsApiKey = ""

export default function Page() {
    const styles = useStyleContext();
    const mapViewRef = useRef<MapView>(null);
    const [trafficLightSize, setTrafficLightSize] = React.useState(2);
    const [showCameras, setShowCameras] = React.useState(true);
    const [showTrafficLights, setShowTrafficLights] = React.useState(true);
    const [showTrafficStops, setShowTrafficStops] = React.useState(true);
    const [showStops, setShowStops] = React.useState(true);
    const [showRoute, setShowRoute] = React.useState(true);
    const [showVehicles, setShowVehicles] = React.useState(true);
    const [showBufferedRoute, setShowBufferedRoute] = React.useState(true);
    const [stopSize, setStopSize] = React.useState(7);
    const [busSize, setBusSize] = React.useState(7);
    const [showCamera, setShowCamera] = React.useState<CameraItem>();
    if (!styles) return null
    const { vehicleList, config, agencyList, routeList, routeConfig } = useContext(DataContext)
    useEffect(() => {
        if (!routeConfig) return
        const region = {
            latitude: routeConfig.bounds.min.lat,
            longitude: routeConfig.bounds.max.lon,
            latitudeDelta: (routeConfig.bounds.max.lat - routeConfig.bounds.min.lat + 0.05),
            longitudeDelta: (routeConfig.bounds.max.lon - routeConfig.bounds.min.lon + 0.05),
        }
        mapViewRef.current?.animateToRegion(region, 100)
    }, [mapViewRef.current, routeConfig])
    function BufferedRoute() {
        if (!showBufferedRoute) return null;
        return routeConfig?.bufferedRoute?.geometry.coordinates.map((line, index) => {
            const coords = line.map<LatLng>((x: any) => {

                const z: LatLng = { latitude: x[1], longitude: x[0] }
                return z
            }) ?? []

            return <Polygon key={index} coordinates={coords} strokeColor="yellow" fillColor="yellow" />
        })

    }

    function CameraMap() {
        if (!showCameras) return null;
        return (
            <>
                {routeConfig?.cameras.map((z, index) => {
                    if (z == undefined) return null;

                    return (

                        <Marker
                            key={index}
                            anchor={{ x: 0.5, y: 0.5 }}
                            coordinate={{
                                latitude: z.position.lat,
                                longitude: z.position.lon,
                            }}
                            zIndex={10}
                            title={index.toString()}
                            onPress={() => {
                                setShowCamera(z)
                            }}
                        >
                            <Camera size={15} borderColor={"#00aa00"} backColor='#00ff00' data={z} />
                        </Marker>
                    );
                })}
            </>
        );
    }
    function TrafficLightMap() {
        if (!showTrafficLights) return null;
        return (
            <>
                {routeConfig?.trafficLights.map((z, index) => {
                    if (z == undefined) return null;

                    return (

                        <Marker
                            anchor={{ x: 0.5, y: 0.5 }}
                            key={index}
                            coordinate={{
                                latitude: z.position.lat,
                                longitude: z.position.lon,
                            }}
                            zIndex={10}
                            title={index.toString()}
                        >
                            <TrafficLight borderColor='#00ff00' size={trafficLightSize} backColor={"#ff0000"} data={z} />
                        </Marker>
                    );
                })}
            </>
        );
    }
    function TrafficStopMap() {
        if (!showTrafficStops) return null;
        return (
            <>
                {routeConfig?.trafficStops.map((z, index) => {
                    if (z == undefined) return null;

                    return (

                        <Marker
                            anchor={{ x: 0.5, y: 0.5 }}
                            key={index}
                            coordinate={{
                                latitude: z.position.lat,
                                longitude: z.position.lon,
                            }}
                            zIndex={10}
                            title={index.toString()}
                        >
                            <TrafficStop borderColor='#00ff00' size={trafficLightSize} backColor={"#ff0000"} data={z} />
                        </Marker>
                    );
                })}
            </>
        );
    }
    function StopMap() {

        if (!showStops) return null;
        return (
            <>
                {routeConfig?.stops.map((z, index) => {
                    if (z == undefined) return null;

                    return (

                        <Marker
                            anchor={{ x: 0.5, y: 0.5 }}
                            key={index}
                            coordinate={{
                                latitude: z.position.lat,
                                longitude: z.position.lon,
                            }}
                            zIndex={10}
                            title={z.id}

                        >
                            <Stop stopSize={stopSize} color={routeConfig.color} data={z} />
                        </Marker>
                    );
                })}
            </>
        );
    }

    function VehicleMap() {
        if (!showVehicles) return null;
        return (
            <>
                {vehicleList?.data.map((z, index) => {
                    if (z == undefined) return null;
                    const config = getConfigFromDir(z.direction ?? "")
                    return (

                        <Marker
                            anchor={{ x: 0.5, y: 0.5 }}
                            key={index}
                            zIndex={10}
                            coordinate={{
                                latitude: z.position.lat,
                                longitude: z.position.lon,
                            }}
                            title={z.id}
                        >
                            <Bus busSize={busSize} backColor={config.color} borderColor={"#0000ff"} data={z} />
                        </Marker>
                    );
                })}
            </>
        );
    }
    function RouteMapGroup() {
        if (!showRoute) return null;
        return (
            <>
                {routeConfig?.routeMap.map((routeMap, index) => {
                    return (
                        <Polyline
                            zIndex={1}
                            key={index}
                            coordinates={routeMap.map((item) => {
                                return { latitude: item.lat, longitude: item.lon };
                            })}
                            strokeColor={"#" + routeConfig.color} // fallback for when `strokeColors` is not supported by the map-provider
                            strokeColors={["#" + routeConfig.color]}
                            strokeWidth={1}
                        />
                    );
                })}
            </>
        );
    }

    const onMapChange = async () => {
        if (!mapViewRef.current) return
        const {
            zoom,
            pitch,
            center,
            heading
        } = await mapViewRef.current.getCamera();
        if (!zoom) {
            setTrafficLightSize(2)
            setStopSize(2)
            setBusSize(2)
        }
        else if (zoom <= 10) {
            setTrafficLightSize(2)
            setStopSize(2)
            setBusSize(6)
        } else if (zoom <= 13) {
            setTrafficLightSize(2)
            setStopSize(2)
            setBusSize(10)
        }
        else if (zoom <= 15) {
            setTrafficLightSize(2)
            setStopSize(5)
            setBusSize(16)
        }
        else if (zoom <= 17) {
            setTrafficLightSize(8)
            setStopSize(8)
            setBusSize(20)
        }

    }
    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>

                <View style={{ width: "100%", height: "100%" }}>

                    <MapView
                        ref={mapViewRef}
                        provider={Platform.OS == "ios" ? undefined : "google"}

                        googleMapsApiKey={googleMapsApiKey}
                        zoomEnabled={true}
                        onRegionChange={onMapChange}
                        customMapStyle={mapStyle}
                        trackViewChanges={false}
                        showsPointsOfInterest={false}
                        showsTraffic={false}
                        showsBuildings={false}
                        minZoomLevel={10}
                        pitchEnabled={false}
                        zoomControlEnabled={false}

                        showsUserLocation={false}
                        animationEnabled={true}
                        initialRegion={{ latitude: 13.6532, longitude: -39.3832, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                        showsCompass={false}
                        loadingFallback={
                            <View>
                                <Text>Loading...</Text>
                            </View>

                        }
                        // @ts-expect-error 
                        style={styles.map2}>
                        <BufferedRoute />
                        <StopMap />
                        <CameraMap />
                        <TrafficLightMap />
                        <TrafficStopMap />
                        <VehicleMap />
                        <RouteMapGroup />

                        <ScrollView style={{ top: "80%", left: "1%", width: "98%", bottom: 30, position: "absolute", flexDirection: "column", padding: 0, backgroundColor: "#eee", borderWidth: 1, borderRadius: 10 }}>
                            <View style={{ padding: 3, backgroundColor: "#aaa" }}><Text style={{ fontWeight: "bold", fontSize: 10 }}>{config?.agency?.title} - {config?.route?.title}</Text></View>
                            <View style={{ flexDirection: "row" }}>
                                <Chip value={showStops} onPress={setShowStops} >Stops</Chip>
                                <Chip value={showRoute} onPress={setShowRoute} >Route</Chip>
                                <Chip value={showVehicles} onPress={setShowVehicles} >Vehicles</Chip>
                                <Chip value={showBufferedRoute} onPress={setShowBufferedRoute} >On Route Area</Chip>
                                <Chip value={showTrafficLights} onPress={setShowTrafficLights} >Traffic Lights</Chip>
                                <Chip value={showTrafficStops} onPress={setShowTrafficStops} >Stop Signs</Chip>
                                <Chip value={showCameras} onPress={setShowCameras} >Cameras</Chip>
                            </View>
                        </ScrollView>



                    </MapView>
                    <VZModal title={"Camera View"} visible={showCamera != undefined} onClose={() => setShowCamera(undefined)}>
                        {showCamera && <View>

                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                <Image source={{ uri: showCamera.imageUrl }} style={{ width: 200, height: 150 }} />
                                <Image source={{ uri: showCamera.refurl1 }} style={{ width: 200, height: 150 }} />
                                <Image source={{ uri: showCamera.refurl2 }} style={{ width: 200, height: 150 }} />
                                <Image source={{ uri: showCamera.refurl3 }} style={{ width: 200, height: 150 }} />
                                <Image source={{ uri: showCamera.refurl4 }} style={{ width: 200, height: 150 }} />
                            </View>
                        </View >}
                    </VZModal>
                </View>
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
