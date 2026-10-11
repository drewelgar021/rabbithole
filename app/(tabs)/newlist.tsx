import { View, Text, ScrollView, TextInput } from "react-native";
import styles from "../styles";
import { useState } from "react";

export default function Tab() {
    const [songs, setSongs] = useState(["Scavenger of Human Sorrow", "Spirit Crusher", "Story to Tell"]);
    const [artists, setArtists] = useState(["Death"]);

    /**
     * Updates a song in the `songs` state variable.
     * It is assumed that `index` is not out of bounds.
     *
     * @param index: The index of the song in `songs` to update.
     */
    function onChangeTextSong(index: number, newSong: string) {
        const top = songs.slice(0, index);
        const bottom = index < songs.length - 1 ? songs.slice(index + 1, songs.length) : [];
        setSongs([...top, newSong, ...bottom])
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    <Text style={styles.h2}>Songs</Text>
                    {songs.map((song, index) =>
                        <TextInput
                            style={styles.textInput}
                            value={songs[index]}
                            onChangeText={(newSong) => onChangeTextSong(index, newSong)}
                            key={index}
                        />
                    )}

                </View>
            </ScrollView>
        </View>
    );
}
