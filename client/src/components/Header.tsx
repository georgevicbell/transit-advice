import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Link } from "expo-router";
import React, { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DataContext } from '../context/DataContext';
import { Server } from '../context/types';

export default function Header(props: DrawerHeaderProps) {
    const { server, setServer } = useContext(DataContext)
    const insets = useSafeAreaInsets();
    const servers: Server[] = [{
        name: "50", server: "http://localhost:8080"
    }, { name: "test", server: "http://localhost:8079" }]
    return <View style={{


        padding: 10, paddingTop: insets.top + 10, backgroundColor: "#fff", flexDirection: "row"
    }
    } >
        <View style={{ alignItems: "flex-start", marginRight: 20 }} >
            <Pressable onPress={() => { props.navigation.toggleDrawer() }}>
                <Ionicons name="menu" size={32} color="#000" />
            </Pressable>
        </View>

        <View style={{ flex: 1, alignSelf: "center" }}>
            <Link
                href="/"
            >
                <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
                    Transit Advice
                </Text>
            </Link>

        </View>
        <View style={{ flexDirection: "row", flex: 1, alignSelf: "center" }}>
            <Link href="/" style={{ marginRight: 10 }} >
                <Text style={{ color: "#000", fontSize: 15, }}>
                    Simplified
                </Text>
            </Link>
            <Link href="/" style={{ marginRight: 10 }}  >
                <Text style={{ color: "#000", fontSize: 15, }}>
                    Map
                </Text>
            </Link>
            <Link href="/" style={{ marginRight: 10 }} >
                <Text style={{ color: "#000", fontSize: 15, }}>
                    3D
                </Text>
            </Link>
            <Link href="/chart" style={{ marginRight: 10 }} >
                <Text style={{ color: "#000", fontSize: 15, }}>
                    Chart
                </Text>
            </Link>
        </View>
        <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-end", alignSelf: "center" }}>

            <Picker
                selectedValue={server.server}
                onValueChange={(itemValue, itemIndex) => { setServer(servers[itemIndex]) }}
            >
                {
                    servers.map((server, index) => {
                        return <Picker.Item key={index} label={server.name} value={server.server} />
                    })
                }


            </Picker>
        </View>

    </View >

}