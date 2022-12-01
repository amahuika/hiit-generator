import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  AddBreaks,
  GetExercises,
  GetWorkoutOrder,
} from "../HelperFunctions/HelperFunctions";
import ExerciseContainer from "../components/ExerciseContainer";
import MyButton from "../components/MyButton";

import { AllExercises } from "../exerciseData/ExerciseData";

const AllData = AllExercises;

function WorkoutScreen({ route, navigation }) {
  const [minutes, setMinutes] = useState();
  const [exerciseList, setExerciseList] = useState([]);
  const [workout, setWorkout] = useState([]);
  // 20sec * 3
  // 10sec rest
  // 45 sec rest
  // repeat * 2

  function generateHandler() {
    const UpperBody = [...AllData.UpperBody];
    const LowerBody = [...AllData.LowerBody];
    const Core = [...AllData.Core];
    const FullBody = [...AllData.FullBody];

    let totalWorkoutLength = 0;

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

    for (let i = 0; i < exercisesToRetrieve; i++) {
      exercises.push(
        GetExercises(UpperBody, i + 1),
        GetExercises(LowerBody, i + 1),
        GetExercises(Core, i + 1),
        GetExercises(FullBody, i + 1)
      );
    }

    setExerciseList(exercises);
    workoutOrder = GetWorkoutOrder(exercises, minutes);

    const round1 = workoutOrder.filter((item) => item.round === 1);
    const round2 = workoutOrder.filter((item) => item.round === 2);
    const round3 = workoutOrder.filter((item) => item.round === 3);
    const round4 = workoutOrder.filter((item) => item.round === 4);

    // console.log("total length: " + workoutOrder.length);
    // console.log("Round 1 length: " + round1.length);
    // console.log("Round 2 length: " + round2.length);
    // console.log("Round 3 length " + round3.length);
    // console.log("Round 4 length " + round4.length);

    let workoutOrderList = [...round1, ...round2, ...round3, ...round4];

    AddBreaks(workoutOrderList);

    setWorkout((val) => [...workoutOrderList]);

    return;
  }

  function startHandler() {
    navigation.navigate("workout", { workout: workout });
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text>Enter length in Minutes </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 20"
          keyboardType="numeric"
          value={minutes}
          onChangeText={setMinutes}
        />
        <MyButton
          style={styles.button}
          txtStyle={styles.btnText}
          text="Generate"
          onPress={generateHandler}
        />
      </View>
      <ScrollView style={styles.exerciseList}>
        {exerciseList.map((item) => {
          return (
            <ExerciseContainer
              title={item.title}
              round={item.round}
              description={item.description}
            />
          );
        })}
      </ScrollView>
      <MyButton
        style={styles.button}
        txtStyle={styles.btnText}
        text="Start Workout"
        onPress={startHandler}
      />
    </View>
  );
}
export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  innerContainer: {
    marginTop: 16,
  },
  input: {
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#504141",
  },
  btnText: {
    color: "white",
    fontSize: 24,
  },
  exerciseList: {
    marginTop: 16,
  },
});
