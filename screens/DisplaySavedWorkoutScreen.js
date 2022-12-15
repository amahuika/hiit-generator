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
        tx.executeSql("SELECT * FROM workout_junction", [], (tx, results) => {
          console.log(results.rows._array);
        });

        tx.executeSql(
          `SELECT exercises.id, exercises.name, exercises.description, category.name AS type
       FROM exercises INNER JOIN 
       workout_junction ON exercises.id = workout_junction.exercise_id INNER JOIN
       category ON exercises.category_id = category.id INNER JOIN
       saved_workouts ON workout_junction.workout_id = saved_workouts.id
       WHERE (saved_workouts.id = ?)`,
          [workout.id],
          (tx, results) => {
            console.log("Query " + results.rows._array);
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
              let addedBreaks = [];
              if (workouts.length > 4) {
                addedBreaks.push(workouts[0]);
                for (let i = 1; i < workouts.length; i++) {
                  if (i % 4 === 0) {
                    addedBreaks.push({
                      id: Math.random() * i,
                      length: 45,
                      round: workouts[i].round,
                      name: "Break",
                    });
                  }
                  addedBreaks.push(workouts[i]);
                }
              } else {
                addedBreaks = workouts;
              }
              setWorkoutList((_) => [...addedBreaks]);
            }
          },
          (tx, error) => {
            console.log(error.message);
            console.log(error.code);
          }
        );
      });
    }

    if (workoutOrder.length === 0 && workoutList.length > 0) {
      const minutes = parseInt(workout.length.split(":")[0]);
      // console.log("list length " + workoutList.length);
      let workoutListUpdate = workoutList.filter(
        (item) => item.name !== "Break"
      );
      let getWorkout = GetWorkoutOrder(workoutListUpdate, minutes);

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
      workoutName: workout.name,
    });
  }

  return (
    <View style={styles.container}>
      <Card>
        <Text>Total Time: {workout.length}</Text>
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
