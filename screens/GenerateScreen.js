import { useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
  const [minutes, setMinutes] = useState(25);
  const [exerciseList, setExerciseList] = useState([]);
  const [workout, setWorkout] = useState([]);
  // 20sec * 3
  // 10sec rest
  // 45 sec rest
  // repeat * 2

  navigation.setOptions({
    headerStyle: { backgroundColor: "#EEEEEE" },
    title: "Your Workout",
  });
  const userMinutes = route.params.minutes;
  useEffect(() => {
    setMinutes(userMinutes);

    generateHandler();
  }, [minutes]);

  function generateHandler() {
    Keyboard.dismiss();
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

    let round = 1;
    for (let i = 0; i < exercisesToRetrieve; i++) {
      exercises.push(
        GetExercises(UpperBody, round),
        GetExercises(LowerBody, round),
        GetExercises(Core, round),
        GetExercises(FullBody, round)
      );
      round++;
    }

    setExerciseList(exercises);
    workoutOrder = GetWorkoutOrder(exercises, minutes);

    // const round1 = workoutOrder.filter((item) => item.round === 1);
    // const round2 = workoutOrder.filter((item) => item.round === 2);
    // const round3 = workoutOrder.filter((item) => item.round === 3);
    // const round4 = workoutOrder.filter((item) => item.round === 4);

    // console.log("total length: " + workoutOrder.length);
    // console.log("Round 1 length: " + round1.length);
    // console.log("Round 2 length: " + round2.length);
    // console.log("Round 3 length " + round3.length);
    // console.log("Round 4 length " + round4.length);

    // let workoutOrderList = [...round1, ...round2, ...round3, ...round4];

    // AddBreaks(workoutOrderList);
    AddBreaks(workoutOrder);

    // setWorkout((val) => [...workoutOrderList]);
    setWorkout((val) => [...workoutOrder]);

    return;
  }

  function startHandler() {
    navigation.navigate("workout", { workout: workout });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.exerciseList}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ExerciseContainer workoutList={exerciseList} />
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
export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#222831",
  },

  button: {
    position: "absolute",
    backgroundColor: "#00ADB5",
    bottom: 8,
    marginBottom: 5,
    borderRadius: 50,
  },
  btnText: {
    color: "#EEEEEE",
    fontSize: 24,
  },
  exerciseList: {
    paddingTop: 16,
  },
});
