import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../MyButton";
import { DatabaseConnection } from "../../assets/database/DatabaseConnection";
import { useState } from "react";
import SaveWorkoutModal from "./SaveWorkoutModal";

const db = DatabaseConnection.getConnection();

function DisplayFinish({ totalTime, exercises }) {
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigation = useNavigation();

  exercises.shift();
  const rest = exercises.find((item) => item.name === "Rest");
  const restLength = rest.length;
  const checkForBreak = exercises.find((item) => item.name === "Break");
  const breakLength = checkForBreak !== undefined ? checkForBreak.length : null;

  const filterOutBreaks = exercises.filter((item) => {
    return item.name !== "Rest" && item.name !== "Break";
  });

  const filteredExercises = filterOutBreaks.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  function modalHandler() {
    showModal ? setShowModal(false) : setShowModal(true);
  }

  function saveWorkoutHandler(workoutName) {
    let lastId;
    console.log("Saved! " + workoutName);
    // console.log(filtered.map((item) => item.round));
    console.log(restLength);
    console.log(breakLength);

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO saved_workouts (name, length, rest, break) VALUES (?,?,?,?)",
        [workoutName, totalTime, restLength, breakLength],
        (tx, results) => {
          console.log("workout id entered " + results.insertId);
          if (results.insertId > 0) {
            lastId = results.insertId;
          }
        }
      );
    });

    db.transaction((tx) => {
      for (const exercise of filteredExercises) {
        tx.executeSql(
          "INSERT INTO workout_junction (workout_id, exercise_id, round) VALUES (?,?,?)",
          [lastId, exercise.id, exercise.round],
          null,
          (tx, error) => {
            console.log(error.message);
          }
        );
      }
    });

    modalHandler();

    setIsSaved(true);
  }

  function insertData() {}

  function backHandler() {
    navigation.navigate("home");
  }

  return (
    <View style={styles.container}>
      <SaveWorkoutModal
        toggle={modalHandler}
        showModal={showModal}
        saveHandler={saveWorkoutHandler}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.congratulationText}>Congratulations!</Text>
        <Text style={styles.mainText}>Total time: {totalTime}</Text>

        <Text style={styles.amazingText}>You are amazing!</Text>
      </View>
      <View>
        <MyButton
          style={styles.button}
          text={!isSaved ? "Save Workout" : "Workout Saved!"}
          txtStyle={styles.buttonText}
          onPress={() => {
            if (!isSaved) modalHandler();
          }}
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
