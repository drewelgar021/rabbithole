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
import cors from "cors";

type Song = { title: string; artist: string; youtube: string };

const INSTRUCTIONS = `You are a music recommendation assistant. Given a list of songs and a list of
artists provided by the user, you are to provide a list of songs that you would recommend to the 
user based on the songs and artists that they provide. Your response will be in JSON of the form: 
{ title, artist, youtube }[], where the youtube field is a link to the song on youtube. Song names 
can be ambiguous, so you should aim to associate user provided song names with the provided artist 
names, or the provided artists' musical genres. Your response should only contain the JSON array of 
song recommendations, and nothing else. Aim to provide a mixture of artists.`

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
            }
          ],
        }),
      },
    );
    if (!response.ok) throw new Error(`${response.status}: ${response.text}`);
    const data = await response.json();
    setList(data.choices[0].message.content);
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
        <View style={styles.container}>

          {songs.length + artists.length > 0 && !list && (
            <TouchableOpacity
              style={styles.buttonAccent}
              onPress={generateList}
            >
              <Text style={styles.text}>Generate</Text>
            </TouchableOpacity>
          )}
          {list &&
            <Text style={styles.text}>{JSON.stringify(list)}</Text>
          }

        </View>
      </ScrollView>
    </View>
  );
}
