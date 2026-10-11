import {
    View,
    Text,
    ScrollView,
    TextInput,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";
import { useState } from "react";

export default function Tab() {
    const [songs, setSongs] = useState<string[]>([]);
    const [artists, setArtists] = useState<string[]>([]);

    /**
     * Updates a song in the `songs` state variable.
     * It is assumed that `index` is not out of bounds.
     *
     * @param index: The index of the song in `songs` to update.
     */
    function onChangeTextSong(index: number, newSong: string) {
        const top = songs.slice(0, index);
        const bottom =
            index < songs.length - 1
                ? songs.slice(index + 1, songs.length)
                : [];
        setSongs([...top, newSong, ...bottom]);
    }

    /**
     * Updates an artist in the `artists` state variable.
     * It is assumed that `index` is not out of bounds.
     *
     * @param index: The index of the song in `songs` to update.
     */
    function onChangeTextArtist(index: number, newArtist: string) {
        const top = artists.slice(0, index);
        const bottom =
            index < artists.length - 1
                ? artists.slice(index + 1, artists.length)
                : [];
        setArtists([...top, newArtist, ...bottom]);
    }

    /**
     * Adds an empty song to the `songs` array in state.
     * As the songs form is a map of `songs`, this will make a new, empty songs input appear.
     *
     */
    function addSong() {
        setSongs([...songs, ""]);
    }

    /**
     * Adds an empty artist to the `artists` array in state.
     * As the artists form is a map of `artists`, this will make a new, empty artists input appear.
     *
     */
    function addArtist() {
        setArtists([...artists, ""]);
    }

    /**
     * Deletes the song at the specified index from the `songs` array in state.
     *
     * @param index: The index of the song to delete.
    */
    function deleteSong(index: number) {
        const top = songs.slice(0, index);
        const bottom = index < songs.length - 1
            ? songs.slice(index + 1, songs.length)
            : []
        setSongs([...top, ...bottom])
    }

    /**
     * Deletes the artist at the specified index from the `artists` array in state.
     *
     * @param index: The index of the artist to delete.
    */
    function deleteArtist(index: number) {
        const top = artists.slice(0, index);
        const bottom = index < artists.length - 1
            ? artists.slice(index + 1, artists.length)
            : []
        setArtists([...top, ...bottom])
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>

                <View style={styles.form}>
                    <Text style={styles.h2}>Songs</Text>
                    {songs.map((song, index) => (
                        <View style={styles.horizontal} key={index}>
                            <TextInput
                                style={styles.textInput}
                                value={song}
                                onChangeText={(newSong) =>
                                    onChangeTextSong(index, newSong)
                                }
                            />
                            <TouchableOpacity style={styles.button} onPress={() => deleteSong(index)}>
                                <FontAwesome size={24} name="trash-o" color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.button} onPress={addSong}>
                        <Text style={styles.text}>Add Song</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.h2}>Artists</Text>
                    {artists.map((artist, index) => (
                        <View style={styles.horizontal} key={index}>
                            <TextInput
                                style={styles.textInput}
                                value={artist}
                                onChangeText={(newArtist) =>
                                    onChangeTextArtist(index, newArtist)
                                }
                            />
                            <TouchableOpacity style={styles.button} onPress={() => deleteArtist(index)}>
                                <FontAwesome size={24} name="trash-o" color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.button} onPress={addArtist}>
                        <Text style={styles.text}>Add Artist</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}
