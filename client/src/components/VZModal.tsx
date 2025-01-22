import { ReactNode } from "react"
import { Modal, Text, View } from "react-native"
import { useStyleContext } from "../context/StyleContext"
import VZButton from "./VZButton"

type Props = {
    requireLogin?: boolean
    children: ReactNode
    visible: boolean
    transparent?: boolean
    halfSize?: boolean
    onClose(): void
    title: string
}
export default function VZModal(props: Props) {
    const styles = useStyleContext()
    if (!styles) return null
    return <Modal visible={props.visible} transparent={props.transparent}>

        <View style={[styles.modalContent, props.halfSize ? { height: "25%" } : { height: "75%", width: "75%", maxHeight: "75%", maxWidth: "75%", left: "12.5%", top: "12.5%" }]}>
            <View style={{ backgroundColor: "grey", alignItems: "center", padding: 5, borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: "row" }}>
                <Text style={styles.h2}>{props.title}</Text>
                <View style={{ flex: 1 }} />
                <VZButton onPress={() => {
                    props.onClose()
                }}>X</VZButton>
            </View>
            {props.children}
        </View>


    </Modal>
}