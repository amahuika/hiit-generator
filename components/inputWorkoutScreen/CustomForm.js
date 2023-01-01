import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

import Card from "../Card";

function CustomForm({ inputHandler, totalTime, workoutDetails }) {
  const [inputName, setInputName] = useState(
    workoutDetails === null ? "" : workoutDetails.name
  );
  const [inputSets, setInputSets] = useState(
    workoutDetails === null ? "1" : workoutDetails.sets.toString()
  );
  const [inputLength, setInputLength] = useState(
    workoutDetails === null ? "" : workoutDetails.length.toString()
  );
  const [inputRest, setInputRest] = useState(
    workoutDetails === null ? "" : workoutDetails.rest.toString()
  );
  const [inputBreak, setInputBreak] = useState(
    workoutDetails === null ? "" : workoutDetails.break.toString()
  );
  const [inputRounds, setInputRounds] = useState(
    workoutDetails === null ? "1" : workoutDetails.rounds.toString()
  );
  const [isFocused, setIsFocused] = useState({
    name: false,
    sets: false,
    length: false,
    rest: false,
    break: false,
    rounds: false,
  });
  const [focusStyle, setFocusStyle] = useState({
    borderColor: "#00ADB5",
    borderBottomWidth: 2,
  });

  // const setsRef = useRef();
  // const lengthRef = useRef();
  // const restRef = useRef();
  // const breaksRef = useRef();
  // const roundsRef = useRef();

  function handler() {
    const inputs = {
      name: inputName,
      sets: inputSets,
      length: inputLength,
      rest: inputRest,
      break: inputBreak,
      rounds: inputRounds,
    };
    // console.log(inputs);

    inputHandler(inputs);
  }

  return (
    <Card style={{ paddingTop: 16 }}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={[styles.input, isFocused.name && focusStyle]}
          value={inputName}
          onChangeText={setInputName}
          onEndEditing={handler}
          onFocus={() => setIsFocused((val) => ({ ...val, name: true }))}
          onBlur={() => setIsFocused((val) => ({ ...val, name: false }))}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Number of sets</Text>
          <TextInput
            style={[styles.input, isFocused.sets && focusStyle]}
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
            maxLength={2}
            onFocus={() => setIsFocused((val) => ({ ...val, sets: true }))}
            onBlur={() => setIsFocused((val) => ({ ...val, sets: false }))}
          />
        </View>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Length of exercise (sec)</Text>
          <TextInput
            style={[styles.input, isFocused.length && focusStyle]}
            value={inputLength}
            onChangeText={setInputLength}
            placeholder="25"
            keyboardType="number-pad"
            onEndEditing={handler}
            maxLength={3}
            onFocus={() => setIsFocused((val) => ({ ...val, length: true }))}
            onBlur={() => setIsFocused((val) => ({ ...val, length: false }))}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Rest between exercises (sec)</Text>
          <TextInput
            style={[styles.input, isFocused.rest && focusStyle]}
            value={inputRest}
            onChangeText={setInputRest}
            keyboardType="number-pad"
            onEndEditing={handler}
            maxLength={3}
            onFocus={() => setIsFocused((val) => ({ ...val, rest: true }))}
            onBlur={() => setIsFocused((val) => ({ ...val, rest: false }))}
          />
        </View>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Breaks (sec)</Text>
          <TextInput
            style={[styles.input, isFocused.break && focusStyle]}
            value={inputBreak}
            onChangeText={setInputBreak}
            keyboardType="number-pad"
            onEndEditing={handler}
            maxLength={3}
            onFocus={() => setIsFocused((val) => ({ ...val, break: true }))}
            onBlur={() => setIsFocused((val) => ({ ...val, break: false }))}
          />
        </View>
      </View>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <View style={[styles.inputContainer, { width: "45%" }]}>
          <Text style={styles.inputLabel}>Rounds</Text>
          <TextInput
            style={[styles.input, isFocused.rounds && focusStyle]}
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
            maxLength={2}
            onFocus={() => setIsFocused((val) => ({ ...val, rounds: true }))}
            onBlur={() => setIsFocused((val) => ({ ...val, rounds: false }))}
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
    fontSize: 16,
    borderColor: "black",
    color: "#06393c",
    borderBottomWidth: 0.5,
  },
  totalTimeText: {
    fontSize: 16,
  },
});
