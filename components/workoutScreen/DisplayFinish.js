import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../MyButton";
import { DatabaseConnection } from "../../assets/database/DatabaseConnection";
import { useState } from "react";
import SaveWorkoutModal from "./SaveWorkoutModal";

const db = DatabaseConnection.getConnection();

function DisplayFinish({ totalTime, exercises }) {
  const [showModal, setShowModal] = useState(false);
  const [lastId, setLastId] = useState();
  const navigation = useNavigation();

  exercises.shift();
  const restLength = exercises.find((item) => item.title === "Rest");
  const checkForBreak = exercises.find((item) => item.title === "Break");
  let breakLength;
  if (checkForBreak !== undefined) {
    breakLength = checkForBreak.length;
  }

  const filterOutBreaks = exercises.filter((item) => {
    return item.title !== "Rest";
  });

  const filtered = filterOutBreaks.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  function modalHandler() {
    showModal ? setShowModal(false) : setShowModal(true);
  }

  function saveWorkoutHandler() {
    // HOW TO CHECK IF SOMETHING EXSITIS IN DATABASE
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "SELECT EXISTS(SELECT 1 FROM rounds WHERE name='Round 4')",
    //     [],
    //     (txt, results) => {
    //       console.log(results.rows._array);
    //     }
    //   );
    // });
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "INSERT INTO saved_workouts ( name, length, rest, break) VALUES (?,?,?,?)",
    //     ["Test Workout", "1.30", 20, null],
    //     (transaction, resultSet) => {
    //       setLastId(resultSet.insertId);
    //       tx.executeSql(
    //         `SELECT * FROM saved_workouts WHERE id = ${resultSet.insertId}`,
    //         [],
    //         (txt, resultSet) => {
    //           console.log(resultSet.rows._array);
    //         }
    //       );
    //     }
    //   );
    // });
  }

  function insertData() {}

  function backHandler() {
    navigation.navigate("home");
  }

  return (
    <View style={styles.container}>
      <SaveWorkoutModal toggle={modalHandler} showModal={showModal} />
      <View style={styles.innerContainer}>
        <Text style={styles.congratulationText}>Congratulations!</Text>
        <Text style={styles.mainText}>Total time: {totalTime}</Text>
        {/* <Text style={styles.mainText}>Total Exercises: {}</Text> */}
        <Text style={styles.amazingText}>You are amazing!</Text>
      </View>
      <View>
        <MyButton
          style={styles.button}
          text="Save Workout"
          txtStyle={styles.buttonText}
          onPress={saveWorkoutHandler}
        />
        <MyButton
          style={styles.button}
          text="Home"
          txtStyle={styles.buttonText}
          onPress={backHandler}
        />
      </View>
    </View>
  );
}
export default DisplayFinish;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  innerContainer: {
    height: "60%",
    backgroundColor: "#EEEEEE",
    padding: 8,
    borderRadius: 8,
    elevation: 4,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  congratulationText: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00ADB5",
  },
  mainText: {
    fontSize: 18,
  },
  amazingText: {
    fontSize: 26,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#393E46",
    borderRadius: 50,
    marginBottom: 8,
  },
  buttonText: {
    color: "#00ADB5",
    fontSize: 24,
  },
});
