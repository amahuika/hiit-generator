import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import CenteredView from "../components/CenteredView";
import { Ionicons } from "@expo/vector-icons";
import MyButton from "../components/MyButton";
import DisplayExercise from "../components/workoutScreen/DisplayExercise";

function WorkoutScreen({ route, navigation }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [timer, setTimer] = useState(0);
  const [hasPaused, setHasPaused] = useState(false);
  const workout = route.params.workout;
  // 20sec * 3
  // 10sec rest
  // 45 sec rest
  // repeat * 2
  // setCurrentRound(workout[0].round);
  useEffect(() => {
    let countdown;
    if (hasPaused) {
      return;
    }
    if (hasStarted && !hasPaused) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);

      if (timer < 0) {
        clearTimeout(countdown);
        const newWorkout = [...workoutList];
        newWorkout.shift();
        setTimer(newWorkout[0].length);
        setCurrentRound(newWorkout[0].round);
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
      setWorkoutList(workout);
    }

    return () => {
      clearTimeout(countdown);
    };
  }, [timer, hasStarted, hasPaused]);

  function onStartHandler() {
    setHasStarted(true);
    setTimer(workoutList[0].length);
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

  return (
    <View style={styles.container}>
      <CenteredView>
        <Text style={styles.timerText}>Round {currentRound}</Text>
      </CenteredView>
      <CenteredView>
        <Text style={styles.timerText}>{timer} Sec</Text>
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
        {!hasStarted && (
          <MyButton
            text="Lets Go!"
            style={styles.startBtn}
            txtStyle={styles.btnTxtStyle}
            onPress={onStartHandler}
          />
        )}
        {hasStarted && (
          <View style={styles.pauseBtnContainer}>
            <View>
              <MyButton
                text={<Ionicons name="stop" size={24} color="white" />}
                style={styles.stopBtn}
                txtStyle={styles.btnTxtStyle}
                onPress={onStop}
              />
            </View>

            <View>
              <MyButton
                text={
                  !hasPaused ? (
                    <Ionicons name="pause" size={24} color="white" />
                  ) : (
                    <Ionicons name="play" size={24} color="white" />
                  )
                }
                style={styles.pauseBtn}
                txtStyle={styles.btnTxtStyle}
                onPress={onPause}
              />
            </View>
            <View>
              <MyButton
                text={
                  <Ionicons name="play-skip-forward" size={24} color="white" />
                }
                style={styles.skipBtn}
                txtStyle={styles.btnTxtStyle}
                onPress={onStop}
              />
            </View>
          </View>
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
  },

  timerText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  btnContainer: {
    width: "100%",
    marginTop: 8,
  },
  startBtn: {
    backgroundColor: "#ff4f4f",
  },
  pauseBtn: {
    backgroundColor: "#5aca2e",
    paddingHorizontal: 24,
  },
  stopBtn: {
    backgroundColor: "#df3939",
    paddingHorizontal: 24,
  },
  skipBtn: {
    backgroundColor: "#355dff",
    paddingHorizontal: 24,
  },
  pauseBtnTxtStyle: {},
  btnTxtStyle: {
    color: "white",
    fontSize: 24,
  },
  exerciseContainer: {
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 16,
  },

  exerciseText: {
    fontSize: 24,
  },
  footerContainer: {
    paddingVertical: 16,
    backgroundColor: "#746f6f",
    padding: 8,
  },
  pauseBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
