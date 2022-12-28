import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRef, useState } from "react";

import Card from "../Card";

function CustomForm({ inputHandler, totalTime, userInput }) {
  const [inputName, setInputName] = useState(userInput.name);
  const [inputSets, setInputSets] = useState(userInput.sets);
  const [inputLength, setInputLength] = useState(userInput.length);
  const [inputRest, setInputRest] = useState(userInput.rest);
  const [inputBreak, setInputBreak] = useState(userInput.break);
  const [inputRounds, setInputRounds] = useState(userInput.rounds);

  const setsRef = useRef();
  const lengthRef = useRef();
  const restRef = useRef();
  const breaksRef = useRef();
  const roundsRef = useRef();

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
          style={[styles.input, styles.onFocusStyle]}
          value={inputName}
          onChangeText={setInputName}
          onEndEditing={handler}
          onSubmitEditing={() => {
            setsRef.current.focus();
          }}
          onFocus={() => {}}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Number of sets</Text>
          <TextInput
            style={styles.input}
            value={inputSets}
            onChangeText={(text) => {
              if (text < 1 || text.includes("-")) {
                setInputSets(1);
              } else {
                setInputSets((val) => text);
              }
            }}
            placeholder="Eg 3"
            keyboardType="number-pad"
            onEndEditing={handler}
            ref={setsRef}
            maxLength={2}
            onSubmitEditing={() => {
              lengthRef.current.focus();
            }}
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
            ref={lengthRef}
            maxLength={3}
            onSubmitEditing={() => {
              restRef.current.focus();
            }}
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
            ref={restRef}
            maxLength={3}
            onSubmitEditing={() => {
              breaksRef.current.focus();
            }}
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
            ref={breaksRef}
            maxLength={3}
            onSubmitEditing={() => {
              roundsRef.current.focus();
            }}
          />
        </View>
      </View>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Rounds</Text>
          <TextInput
            style={styles.input}
            value={inputRounds}
            onChangeText={(text) => {
              if (text < 1 || text.includes("-")) {
                setInputRounds(1);
              } else {
                setInputRounds((val) => text);
              }
            }}
            keyboardType="number-pad"
            onEndEditing={handler}
            ref={roundsRef}
            maxLength={2}
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
