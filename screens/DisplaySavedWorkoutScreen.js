import { useEffect, useState } from "react";
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

const db = DatabaseConnection.getConnection();

function DisplaySavedWorkoutScreen({ route, navigation }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutOrder, setWorkoutOrder] = useState([]);
  const [totalTime, setTotalTime] = useState("");
  const [breakId, setBreakId] = useState();
  const [refresh, setRefresh] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  const workoutDetails = route.params.workout;

  useEffect(() => {
    if (workoutList.length === 0) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM workout_junction WHERE workout_id = ?",
          [workoutDetails.id],
          (tx, results) => {
            for (const item of results.rows._array) {
              tx.executeSql(
                "SELECT * FROM exercises WHERE id = ?",
                [item.exercise_id],
                (tx, results) => {
                  const resultObj = results.rows._array[0];
                  if (resultObj.name === "Break") {
                    setBreakId(resultObj.id);
                    resultObj.id = new Date().getTime();
                    resultObj.length = workoutDetails.break;
                  } else {
                    resultObj.length = workoutDetails.length;
                    resultObj.sets = workoutDetails.sets;
                  }

                  setWorkoutList((val) => [...val, resultObj]);
                }
              );
            }
          }
        );
      });
    }

    // if (refresh >= workoutOrder.length) {
    //   setIsLoading(false);
    // }

    if (workoutList.length > 0) {
      // check if rounds is null id it is then this is a random workout
      if (workoutDetails.rounds === "") {
        MyRandomWorkoutOrder();
      } else {
        const getWorkoutOrder = generateCustomWorkout(
          workoutDetails,
          workoutList,
          breakId
        );

        setWorkoutOrder((val) => [...getWorkoutOrder]);

        let count = 0;
        getWorkoutOrder.map((item) => (count += item.length));
        const totalTime = displayTimeRemaining(count);
        setTotalTime(totalTime);

        // setRefresh((val) => val + 1);
      }
    }

    navigation.setOptions({
      title: workoutDetails.name,
      headerRight: () => {
        return (
          <Pressable style={{ paddingEnd: 24 }} onPress={navigateToPreview}>
            <Ionicons name="list" size={30} color="#EEEEEE" />
          </Pressable>
        );
      },
    });
  }, [workoutList]);

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Card style={{ paddingTop: 16 }}>
          <RowSpaceBetween>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of sets</Text>
              <Text style={styles.input}>{workoutDetails.sets}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Length of exercise (sec)</Text>
              <Text style={styles.input}>{workoutDetails.length} </Text>
            </View>
          </RowSpaceBetween>
          <RowSpaceBetween>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Rest between exercises (sec)
              </Text>
              <Text style={styles.input}>
                {workoutDetails.rest === "" ? "0" : workoutDetails.rest}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Breaks (sec)</Text>
              <Text style={styles.input}>
                {workoutDetails.break === "" ? "0" : workoutDetails.break}
              </Text>
            </View>
          </RowSpaceBetween>
          <RowSpaceBetween>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Rounds</Text>
              <Text style={styles.input}>{workoutDetails.rounds}</Text>
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
        {/* {isLoading && (
          <View style={styles.loadingContainer}>
            <Card style={styles.innerLoadingContainer}>
              <ActivityIndicator size={"large"} />
              <Text>Loading...</Text>
            </Card>
          </View>
        )} */}
      </ScrollView>
      <View>
        <MyButton
          style={styles.button}
          txtStyle={styles.btnText}
          text="Start"
          onPress={startHandler}
        />
      </View>
    </View>
  );
}
export default DisplaySavedWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#222831",
  },
  button: {
    position: "absolute",
    backgroundColor: "#393E46",
    // backgroundColor: "#00ADB5",
    bottom: 8,
    marginBottom: 5,
    borderRadius: 50,
  },
  btnText: {
    color: "#00ADB5",
    // color: "#EEEEEE",
    fontSize: 24,
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
    color: "#5a5b5e",
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
});
