
import { View } from "react-native";
import { DataRouteStopItem } from "../../context/types";

type Props2 = {
    data: DataRouteStopItem;
    color: string;
    stopSize: number;
};

export function Stop(props: Props2) {
    return (
        <View
            style={{
                width: props.stopSize,
                height: props.stopSize,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#" + props.color,
                borderRadius: 2,

            }}
        ></View>
    );
}