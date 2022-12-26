import { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, View, Text } from "react-native";
import {
  AddBreaks,
  displayTimeRemaining,
  GetExercises,
  GetWorkoutOrder,
} from "../HelperFunctions/HelperFunctions";
import ExerciseContainer from "../components/ExerciseContainer";
import MyButton from "../components/MyButton";

import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import Card from "../components/Card";

const db = DatabaseConnection.getConnection();

function GenerateScreen({ route, navigation }) {
  const [minutes, setMinutes] = useState(25);
  const [exerciseList, setExerciseList] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [totalTime, setTotalTime] = useState("");
  const [allData, setAllData] = useState([]);
  const [breakId, setBreakId] = useState(null);

  const [workoutInfo, setWorkoutInfo] = useState({
    name: null,
    sets: 3,
    length: 20,
    rest: 10,
    break: 45,
    rounds: null,
  });

  const allExercises = route.params.allData;
  const userMinutes = route.params.minutes;
  useEffect(() => {
    setMinutes(userMinutes);
    setAllData(allExercises);
    if (breakId === null) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM exercises WHERE name = ?",
          ["Break"],
          (tx, results) => {
            setBreakId(results.rows._array[0].id);
          }
        );
      });
    }

    if (allData.length > 0 && exerciseList.length === 0 && breakId !== null) {
      console.log(breakId);
      generateHandler();
    }
    if (exerciseList.length > 0) {
      MyWorkoutOrder();
    }
  }, [minutes, exerciseList, breakId]);

  function generateHandler() {
    Keyboard.dismiss();

    let workoutOrder = [];
    const exercises = [];

    // how many exercises to retrieve
    let exercisesToRetrieve = 1;
    if (minutes > 12 && minutes <= 24) {
      exercisesToRetrieve = 2;
    } else if (minutes > 24 && minutes <= 36) {
      exercisesToRetrieve = 3;
    } else if (minutes > 36) {
      exercisesToRetrieve = 4;
    }

    let round = 1;
    for (let i = 0; i < exercisesToRetrieve; i++) {
      exercises.push(
        GetExercises(allData, round, 20),
        GetExercises(allData, round, 20),
        GetExercises(allData, round, 20),
        GetExercises(allData, round, 20)
      );

      round++;
    }

    let addedBreaks = [];
    if (exercises.length > 4) {
      addedBreaks.push(exercises[0]);
      for (let i = 1; i < exercises.length; i++) {
        if (i % 4 === 0) {
          addedBreaks.push({
            id: breakId,
            length: 45,
            round: exercises[i].round,
            name: "Break",
          });
        }
        addedBreaks.push(exercises[i]);
      }
    } else {
      addedBreaks = exercises;
    }
    // setExerciseList(exercises);
    setExerciseList(addedBreaks);

    return;
  }

  function MyWorkoutOrder() {
    // console.log(breakId);

    // console.log(exerciseList.map((e) => e.id));
    let workoutOrder;

    const exercises = exerciseList.filter((item) => item.name !== "Break");
    workoutOrder = GetWorkoutOrder(exercises, minutes);

    AddBreaks(workoutOrder, breakId);

    setWorkout((val) => [...workoutOrder]);

    let totalInSeconds = 0;
    workoutOrder.map((item) => (totalInSeconds += item.length));
    setTotalTime(displayTimeRemaining(totalInSeconds));
  }
  // console.log(exerciseList.map((e) => e.name));

  function startHandler() {
    // console.log(workout);
    navigation.navigate("workout", {
      workout: workout,
      workoutTotalTime: totalTime,
      workoutName: null,
      workoutInfo: workoutInfo,
      workoutListForDb: exerciseList,
    });
  }

  function onRefreshExercise(exercise, index) {
    const newExercise = allData;
    let cloneExerciseList = [...exerciseList];
    // get new exercise with different id
    let currentIds = cloneExerciseList.map((item) => item.id);
    let selected;
    do {
      selected = GetExercises(newExercise, exercise.round, 20);
    } while (currentIds.includes(selected.id));

    cloneExerciseList[index] = selected;
    console.log(cloneExerciseList);
    setExerciseList((val) => [...cloneExerciseList]);
  }
  // console.log("exercise list " + exerciseList.length);
  return (
    <View style={styles.container}>
      <Card>
        <Text>Length of exercise: 20 sec</Text>
        <Text>Number of sets: 3</Text>
        <Text>Rest between exercises: 10 sec</Text>
        <Text>Break: 45 sec</Text>
        <Text>Total Time: {totalTime}</Text>
      </Card>
      <ScrollView
        style={styles.exerciseList}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ExerciseContainer
          workoutList={exerciseList}
          onRefresh={onRefreshExercise}
          fromSaved={false}
        />
      </ScrollView>
      {workout.length > 0 && (
        <View>
          <MyButton
            style={styles.button}
            txtStyle={styles.btnText}
            text="Start"
            onPress={startHandler}
          />
        </View>
      )}
    </View>
  );
}
export default GenerateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
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
  exerciseList: {},
});
