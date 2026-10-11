const BG_APP = "#222";
const BG_PRIMARY = "#000";
const FG_PRIMARY = "#EEE";
const FG_SECONDARY = "#777"

const IOS_STATUS_BAR_HEIGHT = 20;

import { StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_APP,
        alignItems: "center",
        justifyContent: "center",
    },

    scrollView: {
        padding: 10,
    },

    text: {
        color: FG_PRIMARY,
    },

    h1: {
        color: FG_PRIMARY,
        fontSize: 24,
        marginBottom: 5,
    },
    
    h2: {
        color: FG_PRIMARY,
        fontSize: 20,
        marginBottom: 5,
    },

    header: {
        backgroundColor: BG_PRIMARY,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        paddingTop: (StatusBar.currentHeight ?? IOS_STATUS_BAR_HEIGHT) + 10,
    },

    form: {
        minWidth: "75%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    textInput: {
        color: FG_PRIMARY,
        borderColor: FG_SECONDARY,
        borderWidth: 1,
        borderRadius: 10,
        minWidth: "75%",
        padding: 10,
        margin: 5
    },

    button: {
        color: FG_PRIMARY,
        backgroundColor: FG_SECONDARY,
        borderRadius: 10,
        padding: 10,
        margin: 5
    },

    horizontal: {
        flex: 1,
        flexDirection: "row",
    }
});

export default styles;
