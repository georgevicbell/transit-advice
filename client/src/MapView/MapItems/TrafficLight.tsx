import { View } from "react-native";
import { TrafficLightItem } from "../../context/types";
type Props = {
    data: TrafficLightItem;
    borderColor: string
    backColor: string;
    size: number
};
export function TrafficLight(props: Props) {
    return (
        props.size == 8 ?
            <View style={{ borderWidth: 1, borderRadius: 4, padding: 1, backgroundColor: "white", borderColor: "black" }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "red" }}></View>
                <View style={{ width: 6, height: 6, borderRadius: 3, borderColor: "lightgray", borderWidth: 1, backgroundColor: "yellow" }}></View>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "green" }}></View>
            </View > :
            <View style={{ borderWidth: 1, borderRadius: 1, padding: 1, backgroundColor: "white", borderColor: "black" }}>
                <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: "red" }}></View>
                <View style={{ width: 2, height: 2, borderRadius: 1, borderColor: "lightgray", borderWidth: 1, backgroundColor: "yellow" }}></View>
                <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: "green" }}></View>
            </View>

    );
}