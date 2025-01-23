import { Link } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator, GestureResponderEvent, Pressable, Text, TextStyle, View } from "react-native";
import { useHover } from "react-native-web-hooks";
import { useStyleContext } from "../context/StyleContext";

type Props = {
    href?: string,
    onPress?: ((event: GestureResponderEvent) => void) | null | undefined,
    children: React.ReactNode
    isBusy?: boolean
    style?: TextStyle
}

export default function VZButton(props: Props) {
    const styles = useStyleContext();
    if (!styles) return null
    if (!styles) return null
    const ref = useRef(null);
    const isHovered = useHover(ref);
    // @ts-expect-error
    return props.href ? <View ref={ref} style={[styles.button, { backgroundColor: isHovered ? "#ccc" : undefined }]}>
        <Link href={props.href}>
            <Text>{props.children}</Text>
        </Link>
    </View> :
        // @ts-expect-error
        <Pressable ref={ref} disabled={props.isBusy} style={[styles.button, { ...props.style }, { backgroundColor: isHovered && !props.isBusy ? "#ccc" : undefined }]} onPress={props.onPress}>
            <Text>{props.isBusy ? <ActivityIndicator /> : props.children}</Text>
        </Pressable>
}
