import { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import CenteredView from "../components/CenteredView";
import { Ionicons } from "@expo/vector-icons";
import CountDown from "react-native-countdown-component";
// import TimerCountdown from "react-native-timer-countdown";

import DisplayExercise from "../components/workoutScreen/DisplayExercise";
import { displayTimeRemaining } from "../HelperFunctions/HelperFunctions";
import CountdownDisplay from "../components/workoutScreen/CountdownDisplay";

// const shortBeep = new Audio("../assets/sounds/short-beep-tone-47916.mp3");

function WorkoutScreen({ route, navigation }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [timer, setTimer] = useState(10);
  const [hasPaused, setHasPaused] = useState(false);
  const [totalTime, setTotalTime] = useState();
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(null);
  const [currentExercise, setCurrentExercise] = useState({
    title: "",
    length: 0,
    description: "",
  });

  const workout = route.params.workout;

  navigation.setOptions({
    // title: "Exercise",
    headerLeft: () => null,
    headerRight: () => {
      return (
        <View style={styles.totalTimeContainer}>
          <Text style={styles.totalTimeText}>{totalTime}</Text>
        </View>
      );
    },
    // headerStyle: { backgroundColor: "#222831" },
    // headerTitleStyle: { fontSize: 36, color: "#00ADB5" },
  });
  // 20sec * 3
  // 10sec rest
  // 45 sec rest
  // repeat * 2
  // setCurrentRound(workout[0].round);
  useEffect(() => {
    let countdown;
    let updatedTotal;

    if (hasPaused) {
      return;
    }
    if (hasStarted && !hasPaused) {
      countdown = setInterval(() => {
        updatedTotal = totalTimeInSeconds - 1;
        setTotalTimeInSeconds(updatedTotal);

        setTotalTime(displayTimeRemaining(updatedTotal));

        setTimer(timer - 1);
      }, 800);

      if (timer < 1) {
        clearTimeout(countdown);
        if (workoutList.length === 0) {
          return;
        }
        timerCompleteHandler();
      }
    }

    if (!hasStarted && workoutList.length === 0) {
      let totalTimeInSeconds = 0;
      workout.map((item) => (totalTimeInSeconds += item.length));

      setTotalTimeInSeconds(totalTimeInSeconds);
      setTotalTime(displayTimeRemaining(totalTimeInSeconds));

      const myWorkout = [...workout];
      setCurrentExercise(myWorkout[0]);
      setTimer(myWorkout[0].length);

      myWorkout.shift();
      setWorkoutList(myWorkout);
      setHasStarted(true);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [timer, hasPaused, hasStarted]);

  function onPause() {
    hasPaused ? setHasPaused(false) : setHasPaused(true);
  }

  function onStop() {
    setHasPaused(true);
    Alert.alert(
      "Are you sure you want to stop?",
      "This will reset your workout",
      [
        {
          text: "Cancel",
          onPress: () => {
            setHasPaused(false);
            return;
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setHasStarted(false);
            navigation.navigate("generator", { minutes: 0 });
          },
        },
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
    setCurrentExercise(newWorkout[0]);
    newWorkout.shift();

    setWorkoutList(newWorkout);
  }

  function timerCompleteHandler() {
    const newWorkout = [...workoutList];
    setCurrentExercise(newWorkout[0]);
    setTimer(newWorkout[0].length);
    newWorkout.shift();
    setWorkoutList(newWorkout);
  }

  return (
    <View style={styles.container}>
      <CountdownDisplay
        count={timer}
        title={currentExercise.title}
        description={currentExercise.description}
      />

      <View style={styles.upNextContainer}>
        <Text style={styles.upNextText}>Up Next</Text>
      </View>

      <ScrollView style={{ marginHorizontal: 16 }}>
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
        <CenteredView style={styles.totalTime}></CenteredView>

        <View style={styles.pauseBtnContainer}>
          <View>
            <Pressable onPress={onStop}>
              <Text>{<Ionicons name="stop" size={40} color="#EEEEEE" />}</Text>
            </Pressable>
          </View>

          <View>
            <Pressable onPress={onPause}>
              <Text>
                {!hasPaused ? (
                  <Ionicons name="pause" size={40} color="#EEEEEE" />
                ) : (
                  <Ionicons name="play" size={40} color="#EEEEEE" />
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
                    color="#EEEEEE"
                  />
                }
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
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
    backgroundColor: "#393E46",
    padding: 8,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  pauseBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  totalTimeText: {
    padding: 8,
    fontSize: 20,
    color: "#EEEEEE",
  },

  totalTimeContainer: {
    marginHorizontal: 8,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 8,
  },
  upNextText: {
    fontSize: 16,
    color: "#EEEEEE",
  },
  upNextContainer: {
    backgroundColor: "#00ADB5",
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 8,
    width: "20%",
  },
});
