import { Pressable, Text } from "react-native";

type Props = {
    children: any;
    value: boolean
    onPress: (value: boolean) => void
};
export default function Chip(props: Props) {
    return (
        <Pressable onPress={() => { props.onPress(!props.value) }}
            style={{
                borderWidth: 1, backgroundColor: props.value ? "#aaa" : "#fff",
                borderColor: "#000", borderRadius: 5, padding: 2, margin: 2
            }}>
            <Text style={{ fontSize: 8 }}>{props.children}</Text>
        </Pressable>
    );
}