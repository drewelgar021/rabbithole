import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#fa5",
                tabBarInactiveTintColor: "#aaa",
                headerTitle: "RabbitHole",
                tabBarStyle: {
                    backgroundColor: "#111",
                },
                headerStyle: {
                    backgroundColor: "#111"
                },
                headerTitleAlign: "center",
                headerTintColor: "#eee",
                headerTitleStyle: {
                    fontSize: 24,
                }
            }}
        >
            <Tabs.Screen
                name="newlist"
                options={{
                    title: "New List",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            size={28}
                            name="plus-square"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="lists"
                options={{
                    title: "My Lists",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="list" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
