import { View, StyleSheet } from "react-native";
import SelectionButton from "../components/selectionScreen.js/SelectionButton";

function SelectionScreen({ route, navigation }) {
  function onRandom() {
    navigation.navigate("input");
  }

  function onCustom() {
    console.log("Custom Workout");
    navigation.navigate("customInput");
  }

  return (
    <View style={styles.container}>
      <SelectionButton
        title="Random Workout"
        subtitle="Randomly generated workout"
        onPress={onRandom}
      />

      <SelectionButton
        title="Custom Workout"
        subtitle="Custom made workout"
        onPress={onCustom}
      />
    </View>
  );
}
export default SelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    padding: 8,
  },
});
