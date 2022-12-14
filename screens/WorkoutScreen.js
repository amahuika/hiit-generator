import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
// need to uninstall
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
// need to uninstall
import CountDown from "react-native-countdown-component";
// need to uninstall
// import TimerCountdown from "react-native-timer-countdown";

import DisplayExercise from "../components/workoutScreen/DisplayExercise";
import { displayTimeRemaining } from "../HelperFunctions/HelperFunctions";
import CountdownDisplay from "../components/workoutScreen/CountdownDisplay";
import DisplayFinish from "../components/workoutScreen/DisplayFinish";
import Footer from "../components/workoutScreen/Footer";

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
    name: "",
    length: 0,
    description: "",
  });

  const explosion = useRef();
  function explosionTrigger() {
    explosion.current.start();
  }
  const workout = route.params.workout;
  const totalTimeInMinutes = route.params.totalTime;
  const workoutName = route.params.workoutName;

  // 20sec * 3
  // 10sec rest
  // 45 sec rest
  // repeat * 2
  // setCurrentRound(workout[0].round);
  useEffect(() => {
    navigation.setOptions({
      title: workoutName === null ? "Workout Generator" : workoutName,
      headerLeft: () => null,
      headerRight: () => {
        return (
          <View style={styles.totalTimeContainer}>
            <Text style={styles.totalTimeText}>{totalTime}</Text>
          </View>
        );
      },
    });
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
      }, 750);

      if (timer < 1) {
        clearTimeout(countdown);
        if (workoutList.length === 0) {
          setIsFinished(true);
          setTimeout(() => {
            explosionTrigger();
          }, 700);
          return;
        }
        timerCompleteHandler();
      }
    }

    if (!hasStarted && totalTimeInSeconds === null) {
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
            navigation.goBack();
            // navigation.navigate("generator", { minutes: 0 });

            // setHasStarted(false);
            // setIsFinished(false);
          },
        },
      ]
    );
  }

  function onSkip() {
    if (workoutList.length === 0) {
      return;
    }
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
      {!isFinished && (
        <CountdownDisplay
          count={timer}
          title={currentExercise.name}
          description={currentExercise.description}
        />
      )}

      {isFinished && (
        <DisplayFinish totalTime={totalTimeInMinutes} exercises={workout} />
      )}

      {workoutList.length !== 0 && (
        <View style={styles.upNextContainer}>
          <Text style={styles.upNextText}>Up Next</Text>
        </View>
      )}

      <ScrollView
        style={{ marginHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {workoutList.map((item, index) => {
          return (
            <DisplayExercise
              key={index}
              title={item.name}
              length={item.length}
              description={item.description}
            />
          );
        })}
      </ScrollView>

      {!isFinished && (
        <Footer
          onPause={onPause}
          onStop={onStop}
          onSkip={onSkip}
          hasPaused={hasPaused}
        />
      )}

      {isFinished && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
          fallSpeed={5000}
          explosionSpeed={500}
          ref={explosion}
        />
      )}
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
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
});
