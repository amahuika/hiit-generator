import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import Card from "../components/Card";
import ExerciseContainer from "../components/ExerciseContainer";
import MyButton from "../components/MyButton";
import {
  AddBreaks,
  displayTimeRemaining,
  generateCustomWorkout,
  GetWorkoutOrder,
} from "../HelperFunctions/HelperFunctions";

import Modal from "react-native-modal";

import { Ionicons } from "@expo/vector-icons";
import RowSpaceBetween from "../components/RowSpaceBetween";
import { useFocusEffect } from "@react-navigation/native";

const db = DatabaseConnection.getConnection();

function DisplaySavedWorkoutScreen({ route, navigation }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutOrder, setWorkoutOrder] = useState([]);
  const [totalTime, setTotalTime] = useState("");
  const [breakId, setBreakId] = useState();
  const [SavedWorkout, setSavedWorkout] = useState({
    name: null,
    length: null,
    rest: null,
    break: null,
    sets: null,
    rounds: null,
    total_time: null,
  });

  // const [isActive, setIsActive] = useState(true);

  const workoutDetails = route.params.workout;

  useEffect(() => {
    console.log(workoutList.map((e) => e.name));

    if (workoutList.length > 0) {
      // check if rounds is null if it is then this is a random workout
      if (workoutDetails.rounds === "") {
        MyRandomWorkoutOrder();
      } else {
        const getWorkoutOrder = generateCustomWorkout(
          SavedWorkout,
          workoutList,
          breakId
        );

        setWorkoutOrder((val) => [...getWorkoutOrder]);

        let count = 0;
        getWorkoutOrder.map((item) => (count += item.length));
        const totalTime = displayTimeRemaining(count);
        setTotalTime(totalTime);
      }
    }
  }, [workoutList, SavedWorkout]);

  useFocusEffect(
    useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM saved_workouts WHERE id = ?",
          [workoutDetails.id],
          (tx, results) => {
            const savedWorkoutResults = results.rows._array[0];
            setSavedWorkout((_) => savedWorkoutResults);

            tx.executeSql(
              "SELECT * FROM workout_junction WHERE workout_id = ?",
              [workoutDetails.id],
              (tx, results) => {
                const resultsArray = results.rows._array;
                const ids = resultsArray.map((e) => e.exercise_id);
                let caseExpr = "";
                ids.forEach((id, index) => {
                  caseExpr += `WHEN ${id} THEN ${index} `;
                });
                const questionMarks = resultsArray.map((e) => "?").join(",");
                tx.executeSql(
                  "SELECT * FROM exercises WHERE id IN (" +
                    questionMarks +
                    ") ORDER BY CASE id " +
                    caseExpr +
                    "END",
                  [...ids],
                  (tx, results) => {
                    const resultsArray = results.rows._array;
                    console.log(savedWorkoutResults.break);
                    const updatedArray = resultsArray.map((item) => {
                      if (item.name === "Break") {
                        setBreakId(item.id);
                        return {
                          ...item,
                          id: new Date().getTime(),
                          length: savedWorkoutResults.break,
                        };
                      } else {
                        return {
                          ...item,
                          length: savedWorkoutResults.length,
                          sets: savedWorkoutResults.sets,
                        };
                      }
                    });
                    setWorkoutList((_) => [...updatedArray]);
                  }
                );
              }
            );
            navigation.setOptions({ title: savedWorkoutResults.name });
          }
        );
      });
    }, [])
  );

  function navigateToPreview() {
    navigation.navigate("preview", { workoutList: workoutOrder });
  }

  function startHandler() {
    navigation.navigate("workout", {
      workout: workoutOrder,
      workoutName: workoutDetails.name,
      workoutInfo: workoutDetails,
      workoutListForDb: null,
      workoutTotalTime: totalTime,
    });
  }

  function MyRandomWorkoutOrder() {
    // console.log(breakId);
    const minutes = parseInt(workoutDetails.total_time.split(":").shift());
    // console.log(exerciseList.map((e) => e.id));

    let workoutOrder;
    const exercises = workoutList.filter((item) => item.name !== "Break");
    workoutOrder = GetWorkoutOrder(exercises, minutes);

    AddBreaks(workoutOrder, breakId);

    setWorkoutOrder((val) => [...workoutOrder]);

    let totalInSeconds = 0;
    workoutOrder.map((item) => (totalInSeconds += item.length));
    setTotalTime(displayTimeRemaining(totalInSeconds));
  }

  function editHandler() {
    navigation.navigate("customInput", {
      workoutDetails: SavedWorkout,
      workoutList: workoutList,
      exerciseOrder: workoutOrder,
    });

    // const workoutDetails = route.params.workoutDetails;
    // const workoutList = route.params.workoutList;
    // const exerciseOrder = route.params.exerciseOrder;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 8 }}
      >
        <Card style={{ paddingTop: 16 }}>
          <RowSpaceBetween>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of sets</Text>
              <Text style={styles.input}>{SavedWorkout.sets}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Length of exercise (sec)</Text>
              <Text style={styles.input}>{SavedWorkout.length} </Text>
            </View>
          </RowSpaceBetween>
          <RowSpaceBetween>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Rest between exercises (sec)
              </Text>
              <Text style={styles.input}>
                {SavedWorkout.rest === "" ? "0" : SavedWorkout.rest}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Breaks (sec)</Text>
              <Text style={styles.input}>
                {SavedWorkout.break === "" ? "0" : SavedWorkout.break}
              </Text>
            </View>
          </RowSpaceBetween>
          <RowSpaceBetween>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Rounds</Text>
              <Text style={styles.input}>{SavedWorkout.rounds}</Text>
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
          </RowSpaceBetween>
        </Card>
        <ExerciseContainer workoutList={workoutList} fromSaved={true} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={navigateToPreview}>
          <Ionicons name="list" size={36} color="#EEEEEE" />
        </Pressable>
        <Pressable onPress={startHandler}>
          <Ionicons name="play" size={36} color="#00ADB5" />
        </Pressable>
        <Pressable onPress={editHandler}>
          <Ionicons name="create-outline" size={36} color="#EEEEEE" />
        </Pressable>
      </View>
    </View>
  );
}
export default DisplaySavedWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#222831",
  },
  inputContainer: {
    marginBottom: 14,
    width: "45%",
  },
  inputLabel: {
    fontSize: 12,
  },
  input: {
    fontSize: 14,
    borderColor: "black",
    color: "#1e1f1f",
    borderBottomWidth: 0.5,
    borderRadius: 4,
  },
  totalTimeText: {
    fontSize: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  innerLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "50%",
  },
  footer: {
    backgroundColor: "#393E46",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
