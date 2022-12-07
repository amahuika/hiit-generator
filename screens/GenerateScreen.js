import { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import {
  AddBreaks,
  displayTimeRemaining,
  GetExercises,
  GetWorkoutOrder,
} from "../HelperFunctions/HelperFunctions";
import ExerciseContainer from "../components/ExerciseContainer";
import MyButton from "../components/MyButton";

import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import { AllExercises } from "../exerciseData/ExerciseData";

const AllData = AllExercises;

// const myData = AllData.UpperBody.map((item) => {
//   return {
//     id: item.id,
//     name: item.name,
//     description: item.description,
//     type: "Upper Body",
//   };
// });

// console.log(myData);

function GenerateScreen({ route, navigation }) {
  const [minutes, setMinutes] = useState(25);
  const [exerciseList, setExerciseList] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [totalTime, setTotalTime] = useState("");
  const [allData, setAllData] = useState([]);

  // 20sec * 3
  // 10sec rest
  // 45 sec rest
  // repeat * 2

  // navigation.setOptions({
  //   headerStyle: { backgroundColor: "#EEEEEE" },
  //   title: "Your Workout",
  // });
  const allExercises = route.params.allData;
  const userMinutes = route.params.minutes;
  useEffect(() => {
    setMinutes(userMinutes);
    setAllData(allExercises);
    if (allData.length > 0) {
      generateHandler();
    }
  }, [minutes]);
  //to do
  // load all data from database on page before then pass when navigate over

  function generateHandler() {
    Keyboard.dismiss();

    const UpperBody = allData.filter(
      (exercise) => exercise.type === "Upper Body"
    );
    const LowerBody = allData.filter(
      (exercise) => exercise.type === "Lower Body"
    );
    const Core = allData.filter((exercise) => exercise.type === "Core");
    const FullBody = allData.filter(
      (exercise) => exercise.type === "Full Body"
    );

    // const UpperBody = [...AllData.UpperBody];
    // const LowerBody = [...AllData.LowerBody];
    // const Core = [...AllData.Core];
    // const FullBody = [...AllData.FullBody];

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

    // let workoutOrderList = [...round1, ...round2, ...round3, ...round4];

    // AddBreaks(workoutOrderList);
    AddBreaks(workoutOrder);

    const lastElementIndex = workoutOrder.length - 1;
    if (
      workoutOrder[lastElementIndex].title === "Break" ||
      workoutOrder[lastElementIndex].title === "Rest"
    ) {
      workoutOrder.pop();
    }
    workoutOrder.unshift({ title: "Get Ready", length: 10 });

    setWorkout((val) => [...workoutOrder]);

    let totalInSeconds = 0;
    workoutOrder.map((item) => (totalInSeconds += item.length));
    setTotalTime(displayTimeRemaining(totalInSeconds));
    // setWorkout((val) => [...workoutOrder]);

    return;
  }

  function startHandler() {
    navigation.navigate("workout", {
      workout: workout,
      totalTime: totalTime,
    });
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
export default GenerateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  exerciseList: {
    paddingTop: 16,
  },
});
