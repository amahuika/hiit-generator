import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

const db = DatabaseConnection.getConnection();

function DisplaySavedWorkoutScreen({ route, navigation }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutOrder, setWorkoutOrder] = useState([]);
  const [totalTime, setTotalTime] = useState("");
  const [breakId, setBreakId] = useState();

  const workoutDetails = route.params.workout;

  useEffect(() => {
    navigation.setOptions({ title: workoutDetails.name });

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

    if (workoutList.length > 0) {
      // check if rounds is null id it is then this is a random workout
      if (workoutDetails.rounds === null) {
        MyRandomWorkoutOrder();
      } else {
        const getWorkoutOrder = generateCustomWorkout(
          workoutDetails,
          workoutList,
          breakId
        );

        setWorkoutOrder((_) => [...getWorkoutOrder]);

        let count = 0;
        getWorkoutOrder.map((item) => (count += item.length));
        const totalTime = displayTimeRemaining(count);
        setTotalTime(totalTime);
      }
    }
  }, [workoutList]);

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
      <Card>
        <Text>Sets {workoutDetails.sets}</Text>

        <Text>Length of exercise: {workoutDetails.length} sec</Text>

        <Text>Rest between exercises: {workoutDetails.rest} sec</Text>
        <Text>Total Time: {totalTime}</Text>
      </Card>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <ExerciseContainer workoutList={workoutList} fromSaved={true} />
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
    padding: 16,
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
});
