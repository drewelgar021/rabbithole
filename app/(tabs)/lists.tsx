import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import styles from "../styles";
import { File, Directory, Paths } from "expo-file-system";
import List from "../List";
import QRCode from "react-qr-code";

type Song = { title: string; artist: string };

export default function Tab() {
  const [lists, setLists] = useState<(Directory | File)[]>([]);
  const [loadedList, loadList] = useState<Song[]>();
  const [fileOpenError, setFileOpenError] = useState(false);
  useEffect(getLists, []);

  /**
   * Sets the lists state variable to a list of the app's documents directory
   * contents.
   */
  function getLists() {
    const dir = new Directory(Paths.document);
    setLists(dir.list());
    setFileOpenError(false);
  }

  /**
   * Opens the list of the specified filename and sets the loadedList state
   * variable to that list's JSON data.
   *
   * @param filename - The filename of the list to load, including the ".list"
   *                   extension.
   */
  function load(filename: string) {
    try {
      const file = new File(Paths.document, filename);
      loadList(JSON.parse(file.textSync()));
    } catch (error) {
      console.log(error);
      setFileOpenError(true);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {!loadedList && (
          <View style={styles.container}>
            <Text style={styles.h2}>My Lists</Text>
            <TouchableOpacity onPress={getLists} style={styles.button}>
              <Text style={styles.text}>Refresh</Text>
            </TouchableOpacity>
            {fileOpenError && <Text style={{color: "#F00"}}>Error opening list.</Text>}
            {lists
              .filter((file) => file.name.endsWith(".list"))
              .map((list, index) => (
                <TouchableOpacity
                  onPress={() => load(list.name)}
                  key={index}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "80%",
                    padding: 10,
                    borderColor: "#777",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={styles.text}>
                    {list.name.slice(0, list.name.length - 5)}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
        {loadedList && (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => loadList(undefined)}
            >
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
            <List songs={loadedList} />
            <View style={styles.container}>
              <View style={{ backgroundColor: "#FFF", padding: 5, margin: 20 }}>
                <QRCode size={256} value={JSON.stringify(loadedList)} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
