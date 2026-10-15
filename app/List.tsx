import { DataTable } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { Linking, TouchableOpacity, Text } from "react-native";
import styles from "./styles";

type Song = { title: string; artist: string };

function getYoutubeURL(song: Song) {
  const query = encodeURIComponent(`${song.artist} - ${song.title}`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function List(props: { songs: Song[] }) {
  return (
    <DataTable style={{ minWidth: "100%" }}>
      <DataTable.Header>
        <DataTable.Title textStyle={styles.text}>Title</DataTable.Title>
        <DataTable.Title textStyle={styles.text}>Artist</DataTable.Title>
        <DataTable.Title textStyle={styles.text}>Listen</DataTable.Title>
      </DataTable.Header>

      {props.songs.map((song, index) => (
        <DataTable.Row key={index}>
          <DataTable.Cell textStyle={styles.text}>{song.title}</DataTable.Cell>
          <DataTable.Cell textStyle={styles.text}>{song.artist}</DataTable.Cell>
          <DataTable.Cell>
            <TouchableOpacity
              onPress={() => Linking.openURL(getYoutubeURL(song))}
            >
              {<FontAwesome size={24} name="youtube-play" color="#EEE" />}
            </TouchableOpacity>
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}

export default List;
