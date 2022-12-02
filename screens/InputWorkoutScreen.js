import { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import MyButton from "../components/MyButton";

function InputWorkoutScreen({ route, navigation }) {
  const [minutes, setMinutes] = useState(20);
  const [validInput, setValidInput] = useState(true);

  function generateHandler() {
    if (minutes > 60) {
      setValidInput(false);
      return;
    }
    navigation.navigate("generator", { minutes: minutes });
  }
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text>Enter length in Minutes </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 20"
          keyboardType="numeric"
          value={minutes}
          onChangeText={setMinutes}
          onSubmitEditing={generateHandler}
        />
        {!validInput && <Text>Please enter a number between 5 and 60</Text>}
        <MyButton
          style={styles.GenerateButton}
          txtStyle={styles.btnText}
          text="Generate"
          onPress={generateHandler}
        />
      </View>
    </View>
  );
}
export default InputWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  innerContainer: {
    marginTop: 16,
  },
  GenerateButton: {
    backgroundColor: "#00ADB5",
    marginTop: 8,
  },
  input: {
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  btnText: {
    color: "#EEEEEE",
    fontSize: 24,
  },
});
