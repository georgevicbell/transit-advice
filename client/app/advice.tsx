import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext } from "react";
import { Text, View } from "react-native";
import { DataContext } from "../src/context/DataContext";
export default function Advice() {
    const { advice } = useContext(DataContext)
    return <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Route Advice</Text>
        {advice.map((x, index) => {
            return <View style={{ borderWidth: 1, padding: 5, margin: 5, borderRadius: 5, flexDirection: "row" }} key={index}>
                <View>
                    {x.priority == "info" ? <Ionicons name="information-circle" size={24} color="black" /> :
                        x.priority == "high" ? <Ionicons name="alert-circle" size={24} color="red" /> :
                            x.priority == "medium" ? <Ionicons name="alert-circle" size={24} color="orange" /> :
                                x.priority == "ok" ? <Ionicons name="alert-circle" size={24} color="green" /> : null}

                </View>
                <View style={{ margin: 5, flexDirection: "column" }}>
                    <Text style={{ fontWeight: "bold" }}>{x.message}</Text>
                    <Text>{x.details}</Text>
                    <Text style={{ fontSize: 10 }}>{x.type}</Text>
                    <Text style={{ fontSize: 10 }}>{new Date(x.date).toDateString()}</Text>
                </View>
            </View>
        })}
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Active Vehicle Advice</Text>
        <Text>This will eventually advise on which vehicles should slow, stop or short turn to regulate service</Text>
        <Text>Additional features for run-as-directed or transferring vehicles from other routes with low utilization</Text>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Historical Advice</Text>
        <Text>This will eventually advise on issues based on collected data over time, such as broken signal priority, busy routes/time of day</Text>

        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Advice Action Log</Text>
        <Text>This section will log actions taken, and their impact</Text>


    </View >
}