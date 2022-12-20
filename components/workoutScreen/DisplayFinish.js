import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../MyButton";
import { DatabaseConnection } from "../../assets/database/DatabaseConnection";
import { useState } from "react";
import SaveWorkoutModal from "./SaveWorkoutModal";
import { useToast } from "react-native-toast-notifications";

const db = DatabaseConnection.getConnection();

function DisplayFinish({
  workoutInfo,
  exercises,
  workoutListForDb,
  workoutTotalTime,
}) {
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigation = useNavigation();

  const toast = useToast();

  // create a list to be saved to db if it is not null
  exercises.shift();
  let updatedList;
  const getBreakId = exercises.find((item) => item.name === "Break");
  console.log(exercises.map((e) => e.id));
  if (workoutListForDb !== null) {
    updatedList = workoutListForDb.map((item) => {
      if (item.name === "Break" && getBreakId.id !== undefined) {
        return {
          name: "Break",
          id: getBreakId.id,
          isChecked: item.isChecked,
        };
      } else {
        return item;
      }
    });
  }

  function modalHandler() {
    showModal ? setShowModal(false) : setShowModal(true);
  }

  function saveWorkoutHandler(workoutName) {
    let lastId;
    // console.log("Saved! " + workoutName);
    // console.log(filtered.map((item) => item.round));
    // console.log(restLength);
    // console.log(breakLength);

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO saved_workouts (name, length, rest, break, sets, rounds, total_time) VALUES (?,?,?,?,?,?,?)",
        [
          workoutName,
          workoutInfo.length,
          workoutInfo.rest,
          workoutInfo.break,
          workoutInfo.sets,
          workoutInfo.rounds,
          workoutTotalTime,
        ],
        (tx, results) => {
          console.log("workout id entered " + results.insertId);
          if (results.insertId > 0) {
            lastId = results.insertId;
          }
        },
        (tx, error) => {
          console.log(error.message);
        }
      );
    });

    db.transaction((tx) => {
      for (const exercise of updatedList) {
        tx.executeSql(
          "INSERT INTO workout_junction (workout_id, exercise_id) VALUES (?,?)",
          [lastId, exercise.id],
          null,
          (tx, error) => {
            console.log(error.message);
          }
        );
      }
    });

    if (workoutInfo.name === "") {
      modalHandler();
    }
    setIsSaved(true);
    toast.show("Workout saved successfully!", {
      type: "normal",
      placement: "bottom",
      animationType: "slide-in",
      duration: 3000,
    });
  }

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
        <Text style={styles.mainText}>Total time: {workoutTotalTime}</Text>

        <Text style={styles.amazingText}>You are amazing!</Text>
      </View>
      <View>
        {workoutListForDb !== null && (
          <MyButton
            style={styles.button}
            text={!isSaved ? "Save Workout" : "Workout Saved!"}
            txtStyle={styles.buttonText}
            onPress={() => {
              if (!isSaved) {
                if (workoutInfo.name !== "") {
                  saveWorkoutHandler(workoutInfo.name);
                } else {
                  modalHandler();
                }
              }
            }}
          />
        )}
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
