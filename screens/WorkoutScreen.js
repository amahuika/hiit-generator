import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CenteredView from "../components/CenteredView";
import { Ionicons } from "@expo/vector-icons";
import MyButton from "../components/MyButton";
import DisplayExercise from "../components/workoutScreen/DisplayExercise";
import { displayTimeRemaining } from "../HelperFunctions/HelperFunctions";

function WorkoutScreen({ route, navigation }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [timer, setTimer] = useState(10);
  const [hasPaused, setHasPaused] = useState(false);
  const [totalTime, setTotalTime] = useState();
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState();
  const [currentExercise, setCurrentExercise] = useState();

  const workout = route.params.workout;
  // 20sec * 3
  // 10sec rest
  // 45 sec rest
  // repeat * 2
  // setCurrentRound(workout[0].round);
  useEffect(() => {
    let countdown;
    const updatedTotal = totalTimeInSeconds - 1;

    if (hasPaused) {
      return;
    }
    if (hasStarted && !hasPaused) {
      countdown = setTimeout(() => {
        setTotalTimeInSeconds(totalTimeInSeconds - 1);
        setTotalTime(displayTimeRemaining(updatedTotal));
        setTimer(timer - 1);
      }, 800);

      if (timer < 1) {
        clearTimeout(countdown);

        if (workoutList.length === 0) {
          return;
        }
        const newWorkout = [...workoutList];
        setTimer(newWorkout[0].length);
        setCurrentExercise(newWorkout[0].title);
        newWorkout.shift();
        // setCurrentRound(newWorkout[0].round);
        setWorkoutList(newWorkout);
      }
    }
    if (!hasStarted) {
      const lastElementIndex = workout.length - 1;
      if (
        workout[lastElementIndex].title === "Break" ||
        workout[lastElementIndex].title === "Rest"
      ) {
        workout.pop();
      }
      if (workout[0].title !== "Get Ready") {
        workout.unshift({ title: "Get Ready", length: 10 });
      }

      let totalTimeInSeconds = 0;
      workout.map((item) => (totalTimeInSeconds += item.length));
      setTotalTimeInSeconds(totalTimeInSeconds);
      setTotalTime(displayTimeRemaining(totalTimeInSeconds));
      setCurrentExercise(workout[0].title);
      workout.shift();
      setWorkoutList(workout);
    }

    return () => {
      clearTimeout(countdown);
    };
  }, [timer, hasStarted, hasPaused, totalTimeInSeconds]);

  function onStartHandler() {
    setHasStarted(true);
  }

  function onPause() {
    hasPaused ? setHasPaused(false) : setHasPaused(true);
  }

  function onStop() {
    Alert.alert(
      "Are you sure you want to stop?",
      "This will reset your workout",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        { text: "OK", onPress: () => navigation.navigate("generator") },
      ]
    );
  }

  function onSkip() {
    const newWorkout = [...workoutList];
    let totalTimeInSeconds = 0;
    newWorkout.map((item) => (totalTimeInSeconds += item.length));
    setTotalTimeInSeconds(totalTimeInSeconds);
    setTotalTime(displayTimeRemaining(totalTimeInSeconds));

    setTimer(newWorkout[0].length);
    setCurrentExercise(newWorkout[0].title);
    newWorkout.shift();

    setWorkoutList(newWorkout);
  }

  return (
    <View style={styles.container}>
      <CenteredView style={styles.countdown}>
        <Text style={styles.timerText}>{currentExercise}</Text>
        <Text style={styles.timerText}>
          {timer.toString().padStart(2, 0)} Sec
        </Text>
      </CenteredView>
      <CenteredView style={{ paddingVertical: 16 }}>
        <Text style={styles.upNextText}>Up Next</Text>
      </CenteredView>
      <ScrollView style={{ padding: 8 }}>
        {workoutList.map((item) => {
          return (
            <DisplayExercise
              title={item.title}
              length={item.length}
              description={item.description}
            />
          );
        })}
      </ScrollView>
      <View style={styles.footerContainer}>
        <CenteredView style={styles.totalTime}>
          <Text style={styles.totalTimeText}>Time remaining: {totalTime}</Text>
        </CenteredView>
        {!hasStarted && (
          <MyButton
            text="Lets Go!"
            style={styles.startBtn}
            txtStyle={styles.btnTxtStyle}
            onPress={onStartHandler}
          />
        )}
        {hasStarted && (
          <>
            <View style={styles.pauseBtnContainer}>
              <View>
                <Pressable onPress={onStop}>
                  <Text>
                    {<Ionicons name="stop" size={40} color="white" />}
                  </Text>
                </Pressable>
              </View>

              <View>
                <Pressable onPress={onPause}>
                  <Text>
                    {!hasPaused ? (
                      <Ionicons name="pause" size={40} color="white" />
                    ) : (
                      <Ionicons name="play" size={40} color="white" />
                    )}
                  </Text>
                </Pressable>
              </View>
              <View>
                <Pressable onPress={onSkip}>
                  <Text>
                    {
                      <Ionicons
                        name="play-skip-forward"
                        size={40}
                        color="white"
                      />
                    }
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
        {/* <Text>Total Time remaining: 13.4</Text> */}
      </View>
    </View>
  );
}

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d8d1d1",
  },

  timerText: {
    fontSize: 46,
  },
  btnContainer: {
    width: "100%",
    marginTop: 8,
  },
  startBtn: {
    backgroundColor: "#ff4f4f",
  },

  btnTxtStyle: {
    color: "white",
    fontSize: 24,
  },
  footerContainer: {
    paddingBottom: 16,
    backgroundColor: "#746f6f",
    padding: 8,
  },
  pauseBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  totalTimeText: {
    paddingBottom: 16,
    paddingTop: 8,
    fontSize: 16,
    color: "white",
  },
  countdown: {
    marginTop: 8,
    borderColor: "black",
    borderWidth: 0.5,
    marginHorizontal: 8,
    borderRadius: 4,
    paddingVertical: 16,
    backgroundColor: "#fefefe",
  },
  upNextText: {
    fontSize: 18,
  },
});
