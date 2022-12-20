import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import MyButton from "../components/MyButton";
import DropDownPicker from "react-native-dropdown-picker";
import Card from "../components/Card";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { color } from "react-native-reanimated";

const db = DatabaseConnection.getConnection();

function InputWorkoutScreen({ route, navigation }) {
  const [minutes, setMinutes] = useState(20);
  const [validInput, setValidInput] = useState(true);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    if (allData.length === 0) {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT exercises.id, exercises.name, exercises.description, category.name AS type
           FROM category INNER JOIN
           exercises ON category.id = exercises.category_id`,
          [],
          (tx, results) => {
            const resultsData = results.rows._array;
            console.log(resultsData);
            setAllData((val) => [...resultsData]);
          },
          (tx, error) => {
            console.log(error.message);
          }
        );
      });
    }
  }, [allData]);

  function generateHandler() {
    if (minutes > 60 || minutes < 5) {
      setValidInput(false);
      return;
    }
    navigation.navigate("generator", { minutes: minutes, allData: allData });
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <>
          <Text style={styles.label}>Enter length in Minutes </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 20"
            keyboardType="numeric"
            value={minutes}
            onChangeText={(text) => {
              setMinutes(text);
              if (text > 60 || text < 5) {
                setValidInput(false);
              } else {
                setValidInput(true);
              }
            }}
            onSubmitEditing={generateHandler}
          />
          {!validInput && (
            <Text style={{ color: "#ff8f8f" }}>
              Please enter between 5 and 60
            </Text>
          )}
          <MyButton
            style={styles.GenerateButton}
            txtStyle={styles.btnText}
            text="Generate"
            onPress={generateHandler}
          />
        </>
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
    marginTop: 16,
  },
  input: {
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    marginBottom: 8,
  },
  btnText: {
    color: "#EEEEEE",
    fontSize: 24,
  },
  label: {
    color: "#EEEEEE",
  },
});
