import { View, StyleSheet } from "react-native";
import SelectionButton from "../components/selectionScreen.js/SelectionButton";

function SelectionScreen({ route, navigation }) {
  function onRandom() {
    navigation.navigate("input");
  }

  function onCustom() {
    // console.log("Custom Workout");
    navigation.navigate("customInput", {
      workoutDetails: null,
      workoutList: null,
      exerciseOrder: null,
    });
  }

  return (
    <View style={styles.container}>
      <SelectionButton
        title="Random Timer Workout"
        subtitle="Randomly generated workout"
        onPress={onRandom}
        icon={"timer-outline"}
      />

      <SelectionButton
        title="Custom Timer Workout"
        subtitle="Custom made timed workout"
        onPress={onCustom}
        icon={"timer-outline"}
      />

      <SelectionButton
        title="Custom Reps Workout"
        subtitle="Custom made reps workout"
        onPress={onCustom}
        icon={"list-outline"}
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
