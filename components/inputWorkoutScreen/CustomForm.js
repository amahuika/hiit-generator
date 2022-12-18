import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

import Card from "../Card";

function CustomForm({ inputHandler, totalTime, userInput }) {
  const [inputName, setInputName] = useState(userInput.name);
  const [inputSets, setInputSets] = useState(userInput.sets);
  const [inputLength, setInputLength] = useState(userInput.length);
  const [inputRest, setInputRest] = useState(userInput.rest);
  const [inputBreak, setInputBreak] = useState(userInput.break);
  const [inputRounds, setInputRounds] = useState(userInput.rounds);

  function handler() {
    const inputs = {
      name: inputName,
      sets: inputSets,
      length: inputLength,
      rest: inputRest,
      break: inputBreak,
      rounds: inputRounds,
    };
    console.log(inputs);

    inputHandler(inputs);
  }

  return (
    <Card style={{ paddingTop: 16 }}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={inputName}
          onChangeText={setInputName}
          onEndEditing={handler}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Sets</Text>
          <TextInput
            style={styles.input}
            value={inputSets}
            onChangeText={setInputSets}
            placeholder="Eg 3"
            keyboardType="number-pad"
            onEndEditing={handler}
          />
        </View>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Length of exercise (sec)</Text>
          <TextInput
            style={styles.input}
            value={inputLength}
            onChangeText={setInputLength}
            placeholder="25"
            keyboardType="number-pad"
            onEndEditing={handler}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Rest between exercises (sec)</Text>
          <TextInput
            style={styles.input}
            value={inputRest}
            onChangeText={setInputRest}
            keyboardType="number-pad"
            onEndEditing={handler}
          />
        </View>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Breaks (sec)</Text>
          <TextInput
            style={styles.input}
            value={inputBreak}
            onChangeText={setInputBreak}
            keyboardType="number-pad"
            onEndEditing={handler}
          />
        </View>
      </View>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Rounds</Text>
          <TextInput
            style={styles.input}
            value={inputRounds}
            onChangeText={setInputRounds}
            keyboardType="number-pad"
            onEndEditing={handler}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            width: "45%",
          }}
        >
          <Text style={styles.totalTimeText}>Total Time: {totalTime}</Text>
        </View>
      </View>
    </Card>
  );
}
export default CustomForm;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
  },
  input: {
    fontSize: 14,
    borderColor: "black",
    color: "#5a5b5e",
    borderBottomWidth: 0.5,
    borderRadius: 4,
  },
  totalTimeText: {
    fontSize: 16,
  },
});
