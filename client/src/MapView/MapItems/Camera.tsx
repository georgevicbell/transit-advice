import { CameraItem } from "../../context/types";

import Ionicons from "@expo/vector-icons/Ionicons";
type Props = {
    data: CameraItem;
    borderColor: string
    backColor: string;
    size: number
};
export function Camera(props: Props) {
    return (

        <Ionicons
            name="videocam-outline"
            size={props.size}
            color={props.borderColor}

        />

    );
}