import { Text, View, ScrollView, StatusBar } from "react-native";
import { useState } from "react"
import styles from "./styles";

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.h1}>RabbitHole</Text>
            </View>
            <ScrollView>

            </ScrollView>
        </View>
    );
}
