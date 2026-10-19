import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";
import { useState } from "react";
import List from "../List";
import QRCode from "react-qr-code";
import { File, Paths } from "expo-file-system";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { z } from "zod";

type Song = { title: string; artist: string };

const INSTRUCTIONS = `You are a music recommendation assistant. Given a list of songs and a list of 
artists provided by the user, you are to provide a list of up to 10 songs that you would recommend 
to the user based on the songs and artists that they provide. Your response will be in JSON of the 
form: { title: string, artist: string}[]. Song names can be ambiguous, so you should aim to 
associate user provided song names with the provided artist names, or the provided artists' musical 
genres. Your response should only contain the JSON array of song recommendations, and nothing else. 
Do not use markdown code fences. Aim to provide songs from at least 1 artist that is not provided 
by the user.`;

const listSchema = z.array(z.object({ title: z.string(), artist: z.string() }));

export default function Tab() {
  const [songs, setSongs] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [list, setList] = useState<Song[]>();
  const [saveModalVisibility, setSaveModalVisibility] = useState(false);
  const [saveFileName, setSaveFileName] = useState("");
  const [saveSuccessModalVisibility, setSaveSuccessModalVisibility] =
    useState(false);
  const [saveError, setSaveError] = useState(false);
  const [camera, requestCamera] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [qrError, setQRError] = useState(false);

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

  /**
   * Resets the song and artists lists in state, as well as the recommendations
   * list if one has been generated.
   */
  function clear() {
    setSongs([]);
    setArtists([]);
    setList(undefined);
  }

  /**
   * Fetches a list of song recommendations from the LLM, using the provided
   * songs and artists (in state variables) in a prompt asking for similar
   * songs.
   */
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

  /**
   * Closes the save modal and clears the save file name in state.
   */
  function closeSaveModal() {
    setSaveModalVisibility(false);
    setSaveFileName("");
    setSaveError(false);
  }

  /**
   * Saves the currently loaded list to the file system.
   * Does nothing if the filename is empty.
   */
  function save() {
    if (!saveFileName) return;
    try {
      const file = new File(Paths.document, `${saveFileName}.list`);
      if (file.exists) file.delete();
      file.create();
      file.write(JSON.stringify(list));
      setSaveModalVisibility(false);
      setSaveSuccessModalVisibility(true);
      setSaveFileName("");
      setSaveError(false);
    } catch (error) {
      console.error(error);
      setSaveError(true);
    }
  }

  /**
   * Starts the camera, and requests permission if it hasn't been granted.
   */
  function startCamera() {
    if (!camera || !camera.granted) {
      requestCamera();
    }

    if (camera && camera.granted) {
      setCameraVisible(true);
    }
  }

  /**
   * Sets the currently loaded list to the contents of the QR code if it is valid.
   * Otherwise sets the qrError flag.
   */
  function handleBarcode(scan: BarcodeScanningResult) {
    try {
      setList(listSchema.parse(JSON.parse(scan.data)));
    } catch (error) {
      setQRError(true);
    }
    setCameraVisible(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {!list && (
          <View style={styles.container}>
            <TouchableOpacity
              style={{ ...styles.buttonAccent, flex: 1, flexDirection: "row" }}
              onPress={startCamera}
            >
              <FontAwesome
                size={24}
                name="qrcode"
                color="#EEE"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.text}>From QR Code</Text>
            </TouchableOpacity>
            {qrError && (
              <Text style={{ color: "#F00" }}>
                QR code is not a valid list.
              </Text>
            )}
          </View>
        )}
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
                  <FontAwesome size={24} name="trash-o" color="#EEE" />
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

        {songs.join("").length + artists.join("").length > 0 && !list && (
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => setSaveModalVisibility(true)}
              >
                <Text style={styles.text}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View style={{ backgroundColor: "#FFF", padding: 5, margin: 20 }}>
                <QRCode size={256} value={JSON.stringify(list)} />
              </View>
            </View>
          </>
        )}

        <Modal
          animationType="slide"
          transparent
          visible={saveModalVisibility}
          presentationStyle="overFullScreen"
          onDismiss={() => setSaveModalVisibility(false)}
        >
          <View style={styles.modalWrapper}>
            <View style={styles.modal}>
              <View style={styles.form}>
                <Text style={styles.h2}>Save List</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="List Name"
                  placeholderTextColor="#777"
                  value={saveFileName}
                  onChangeText={setSaveFileName}
                />
                {!saveFileName && (
                  <Text style={{ color: "#F00" }}>
                    List name cannot be empty.
                  </Text>
                )}
                {saveError && (
                  <Text style={{ color: "#F00" }}>
                    There was an error saving the file.
                  </Text>
                )}
                <TouchableOpacity style={styles.button} onPress={save}>
                  <Text style={styles.text}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={closeSaveModal}
                >
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={saveSuccessModalVisibility}
          presentationStyle="overFullScreen"
          onDismiss={() => setSaveSuccessModalVisibility(false)}
        >
          <View style={styles.modalWrapper}>
            <View style={styles.modal}>
              <View style={styles.form}>
                <Text style={styles.h2}>List Saved</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setSaveSuccessModalVisibility(false)}
                >
                  <Text style={styles.text}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={cameraVisible}
          onDismiss={() => setCameraVisible(false)}
        >
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              maxHeight: 36,
              backgroundColor: "#222",
            }}
          >
            <TouchableOpacity onPress={() => setCameraVisible(false)}>
              <FontAwesome size={36} color="#F00" name="close" />
            </TouchableOpacity>
          </View>
          <CameraView
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            style={{ flex: 1 }}
            onBarcodeScanned={handleBarcode}
          />
        </Modal>
      </ScrollView>
    </View>
  );
}
