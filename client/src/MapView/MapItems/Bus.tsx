import { View } from "react-native";
import { DataVehicleItem } from "../../context/types";

import Ionicons from "@expo/vector-icons/Ionicons";
type Props = {
    data: DataVehicleItem;
    borderColor: string
    backColor: string;
    busSize: number
};

export function Bus(props: Props) {
    return (
        <View
            style={{
                width: props.busSize,
                height: props.busSize,
                borderRadius: props.busSize / 2,
                backgroundColor: props.backColor,
                borderWidth: 1,
                borderColor: props.borderColor,
            }}
        >
            <Ionicons
                name="arrow-up"
                size={props.busSize - 2}
                color="white"
                style={{ transform: [{ rotate: props.data.heading + "deg" }] }}
            />
        </View>
    );
}