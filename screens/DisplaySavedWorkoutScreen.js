import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import Card from "../components/Card";
import ExerciseContainer from "../components/ExerciseContainer";
import MyButton from "../components/MyButton";
import { AddBreaks, GetWorkoutOrder } from "../HelperFunctions/HelperFunctions";

const db = DatabaseConnection.getConnection();

function DisplaySavedWorkoutScreen({ route, navigation }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutOrder, setWorkoutOrder] = useState([]);
  const [totalTime, setTotalTime] = useState("");
  const workout = route.params.workout;

  useEffect(() => {
    navigation.setOptions({ title: workout.name });

    if (workoutList.length === 0) {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT exercises.description, exercises.type, exercises.name, workout_junction.round
       FROM exercises INNER JOIN
       workout_junction ON exercises.id = workout_junction.exercise_id INNER JOIN
       saved_workouts ON workout_junction.workout_id = saved_Workouts.id
       WHERE saved_workouts.id = ?`,
          [workout.id],
          (tx, results) => {
            console.log("Query " + results.rows.length);
            if (results.rows.length > 0) {
              let workouts = results.rows._array.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  type: item.type,
                  round: item.round,
                  length: 20,
                };
              });
              setWorkoutList((_) => [...workouts]);
            }
          }
        );
      });
    }

    if (workoutOrder.length === 0 && workoutList.length > 0) {
      const minutes = parseInt(workout.length.split(":")[0]);
      console.log("list length " + workoutList.length);
      let getWorkout = GetWorkoutOrder(workoutList, minutes);

      AddBreaks(getWorkout);

      setTotalTime(workout.length);
      setWorkoutOrder((_) => [...getWorkout]);
    }
  }, [workoutList, workoutOrder]);

  function startHandler() {
    // console.log("Start");
    console.log(workoutOrder);
    // console.log(workoutList.length);
    navigation.navigate("workout", {
      workout: workoutOrder,
      totalTime: totalTime,
    });
  }

  return (
    <View style={styles.container}>
      <Card>
        <Text>Total Time: {workout.length}</Text>
      </Card>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <ExerciseContainer workoutList={workoutList} />
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
