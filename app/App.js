const BG_PRIMARY = "#222"
const FG_PRIMARY = "#EEE"

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: FG_PRIMARY,
  }
});
