
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from "expo-router";
import React from "react";
import { View } from 'react-native';

import { useStyleContext } from '../context/StyleContext';
export default function CustomDrawer(props: DrawerContentComponentProps) {
    const navigation = useRouter();
    const styles = useStyleContext();
    if (!styles) return null
    return <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>

    </View >
}
