import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../MyButton";
import { DatabaseConnection } from "../../assets/database/DatabaseConnection";
import { useState } from "react";

const db = DatabaseConnection.getConnection();

function DisplayFinish({ totalTime, exercises }) {
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

    db.transaction((tx) => {
      // ${lastId}
      tx.executeSql(
        `SELECT EXISTS(SELECT 1 FROM saved_workouts WHERE id = ?)`,
        [100],
        (txt, results) => {
          console.log("Exsits: " + results.rows.length);
        }
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO saved_workouts ( name, length, rest, break) VALUES (?,?,?,?)",
        ["Test Workout", "1.30", 20, null],
        (transaction, resultSet) => {
          setLastId(resultSet.insertId);

          tx.executeSql(
            `SELECT * FROM saved_workouts WHERE id = ${resultSet.insertId}`,
            [],
            (txt, resultSet) => {
              console.log(resultSet.rows._array);
            }
          );
        }
      );
    });
  }

  function insertData() {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO saved_workouts ( name, length, rest, break) VALUES (?,?,?,?)",
        ["Test Workout", "1.30", 20, null]
      );
      lastWorkoutId = db.lastInsertRowId();
      console.log(lastWorkoutId);
    });

    tx.executeSql(
      "INSERT INTO saved_workouts ( name, length, rest, break) VALUES (?,?,?,?)",
      ["Test Workout", "1.30", 20, null]
    );

    db.transaction((tx) => {
      filtered.map((item) => {
        tx.executeSql(
          "INSERT INTO exercises (id, name, type, description,) VALUES (?,?,?,?)",
          [item.id, item.title, null, item.description]
        );
      });

      tx.executeSql(
        "INSERT INTO workout_junction (incorrect, correct, country, continent) VALUES (?,?,?,?)",
        [incorrect, correct, country, continent]
      );
      tx.executeSql(
        "INSERT INTO table_results (incorrect, correct, country, continent) VALUES (?,?,?,?)",
        [incorrect, correct, country, continent]
      );
      tx.executeSql(
        "INSERT INTO table_results (incorrect, correct, country, continent) VALUES (?,?,?,?)",
        [incorrect, correct, country, continent]
      );
    });
  }

  function backHandler() {
    navigation.navigate("home");
  }

  return (
    <View style={styles.container}>
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
