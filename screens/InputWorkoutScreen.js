import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import MyButton from "../components/MyButton";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";

const db = DatabaseConnection.getConnection();

function InputWorkoutScreen({ route, navigation }) {
  const [minutes, setMinutes] = useState(20);
  const [validInput, setValidInput] = useState(true);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM exercises", [], (tx, results) => {
        setAllData((val) => [...results.rows._array]);
      });
    });
  }, []);

  function generateHandler() {
    if (minutes > 60) {
      setValidInput(false);
      return;
    }
    navigation.navigate("generator", { minutes: minutes, allData: allData });
  }
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Enter length in Minutes </Text>
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
    backgroundColor: "#222831",
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
  label: {
    color: "#EEEEEE",
  },
});
