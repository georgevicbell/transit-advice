import { GiStopSign } from "react-icons/gi";
import { TrafficLightItem } from "../../context/types";
type Props = {
    data: TrafficLightItem;
    borderColor: string
    backColor: string;
    size: number
};
export function TrafficStop(props: Props) {
    return (
        props.size == 8 ?
            <GiStopSign size={10} color="red" />
            :
            <GiStopSign size={5} color="red" />
    );
}