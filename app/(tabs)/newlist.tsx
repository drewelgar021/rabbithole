import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";
import { useState } from "react";
import List from "../List";
import QRCode from "react-qr-code";

type Song = { title: string; artist: string };

const INSTRUCTIONS = `You are a music recommendation assistant. Given a list of songs and a list of 
artists provided by the user, you are to provide a list of up to 10 songs that you would recommend 
to the user based on the songs and artists that they provide. Your response will be in JSON of the 
form: { title: string, artist: string}[]. Song names can be ambiguous, so you should aim to 
associate user provided song names with the provided artist names, or the provided artists' musical 
genres. Your response should only contain the JSON array of song recommendations, and nothing else. 
Do not use markdown code fences. Aim to provide songs from at least 1 artist that is not provided 
by the user.`;

export default function Tab() {
  const [songs, setSongs] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [list, setList] = useState<Song[]>();

  /**
   * Updates a song in the `songs` state variable.
   * It is assumed that `index` is not out of bounds.
   *
   * @param index: The index of the song in `songs` to update.
   */
  function onChangeTextSong(index: number, newSong: string) {
    const top = songs.slice(0, index);
    const bottom =
      index < songs.length - 1 ? songs.slice(index + 1, songs.length) : [];
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
    const bottom =
      index < songs.length - 1 ? songs.slice(index + 1, songs.length) : [];
    setSongs([...top, ...bottom]);
  }

  /**
   * Deletes the artist at the specified index from the `artists` array in state.
   *
   * @param index: The index of the artist to delete.
   */
  function deleteArtist(index: number) {
    const top = artists.slice(0, index);
    const bottom =
      index < artists.length - 1
        ? artists.slice(index + 1, artists.length)
        : [];
    setArtists([...top, ...bottom]);
  }

  function clear() {
    setSongs([]);
    setArtists([]);
    setList(undefined);
  }

  async function generateList() {
    const response = await fetch(
      "https://comp2140-3ea651da.uqcloud.net/api/_ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // I don't pay for this LLM lol
          Authorization: `Bearer sk-uq-PBMsknwE4-89VPyaRdplJHBpav5r9UPj`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: INSTRUCTIONS,
            },
            {
              role: "user",
              content: `Songs: ${songs}\n Artists: ${artists}`,
            },
          ],
        }),
      },
    );
    if (!response.ok)
      throw new Error(`${response.status}: ${await response.text()}`);
    const data = await response.json();
    setList(JSON.parse(data.choices[0].message.content));
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {!list && (
          <View style={styles.form}>
            <Text style={styles.h2}>Songs</Text>
            {songs.map((song, index) => (
              <View style={styles.horizontal} key={index}>
                <TextInput
                  style={styles.textInput}
                  value={song}
                  onChangeText={(newSong) => onChangeTextSong(index, newSong)}
                  placeholder="Song Name"
                  placeholderTextColor="#777"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => deleteSong(index)}
                >
                  <FontAwesome size={24} name="trash-o" color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={addSong}>
              <Text style={styles.text}>Add Song</Text>
            </TouchableOpacity>
          </View>
        )}

        {!list && (
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
                  placeholder="Artist Name"
                  placeholderTextColor="#777"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => deleteArtist(index)}
                >
                  <FontAwesome size={24} name="trash-o" color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={addArtist}>
              <Text style={styles.text}>Add Artist</Text>
            </TouchableOpacity>
          </View>
        )}

        {songs.length + artists.length > 0 && !list && (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.buttonAccent}
              onPress={generateList}
            >
              <Text style={styles.text}>Generate</Text>
            </TouchableOpacity>
          </View>
        )}
        {list && (
          <>
            <List songs={list} />
            <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={clear}>
                <Text style={styles.text}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View style={{backgroundColor: "#FFF", padding: 5, margin: 20}}>
              <QRCode size={256}
                value={JSON.stringify(list)} />
            </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
