import * as Sentry from "@sentry/react-native";
import { useNavigation } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import React from "react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
//import awsConfig from "../src/aws-exports";
import CustomDrawer from '../src/components/CustomDrawer';
import Header from '../src/components/Header';
import { DataProvider } from "../src/context/DataProvider";
import { StyleProvider } from "../src/context/StyleProvider";


Sentry.init({
    dsn: "https://63501e952a5a9118ac754e9395afad89@o4504590057078784.ingest.sentry.io/4506360509956096",

    debug: false,
    tracesSampleRate: 1.0,
});

//Amplify.configure(awsConfig)
function Content() {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets();


    return <Drawer
        defaultStatus="closed"
        drawerContent={(props: any) => {
            return <CustomDrawer {...props} />
        }}
        screenOptions={{
            drawerPosition: "left",
            drawerStyle: {
                backgroundColor: "#fff",
            },
            drawerActiveTintColor: "#000",
            drawerInactiveTintColor: "aaa",
            drawerActiveBackgroundColor: "#aaa",

            headerStyle: {},
            headerTintColor: "#000",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            header: (props: any) => <Header {...props} />,

        }}
    >
        <Drawer.Screen
            name="index" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: "Map",
                title: "Map",
            }}
        />
        <Drawer.Screen
            name="chart" // This is the name of the page and must match the url from root
            options={{

                drawerLabel: "Journey Chart",
                title: "Journey Chart",
            }}
        />
        <Drawer.Screen
            name="advice" // This is the name of the page and must match the url from root
            options={{

                drawerLabel: "Advice",
                title: "Advice",
            }}
        />
        <Drawer.Screen
            name="simple" // This is the name of the page and must match the url from root
            options={{

                drawerLabel: "Vehicle Chart",
                title: "Vehicle Chart",
            }}
        />
        <Drawer.Screen
            name="serverconfig" // This is the name of the page and must match the url from root
            options={{

                drawerLabel: "Server Config",
                title: "Server Config",
            }}
        />

    </Drawer >
}

export default function Layout() {

    return (
        <StyleProvider>
            <DataProvider>
                <SafeAreaProvider>
                    <Content />
                </SafeAreaProvider>
            </DataProvider>

        </StyleProvider >
    );
}
