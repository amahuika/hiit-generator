import { View, StyleSheet, ScrollView, Text, Button } from "react-native";
import MyButton from "../components/MyButton";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import { useEffect, useState } from "react";
import { createTable } from "../HelperFunctions/DatabaseFunctions";

import { updatedExercises } from "../exerciseData/ExerciseData";

const db = DatabaseConnection.getConnection();

function HomeScreen({ route, navigation }) {
  // get started handler
  function getStartedHandle() {
    navigation.navigate("input");
  }

  // seed database function
  function seedExercises() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM exercises",
        [],
        (tx, result) => {
          console.log(result.rows.length);
          if (result.rows.length === 0) {
            for (const exercise of updatedExercises) {
              tx.executeSql(
                "INSERT INTO exercises (name, type, description) VALUES (?,?,?)",
                [exercise.name, exercise.type, exercise.description]
              );
            }
          }
        },
        (tx, error) => {
          console.log(error.message);
          console.log(error.code);
        }
      );
    });
  }

  useEffect(() => {
    // Create Tables
    createTable();

    // seeding data
    seedExercises();
  }, []);

  function savedWorkoutsHandler() {
    navigation.navigate("myWorkouts");
  }

  function myWorkoutTitleHandler(id) {
    console.log(id);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM saved_workouts WHERE id = ?",
        [id],
        (tx, results) => {
          // console.log(results.rows.length);
          if (results.rows.length > 0) {
            const workout = results.rows.item(0);
            tx.executeSql(
              `SELECT exercises.description, exercises.type, exercises.name, workout_junction.round
           FROM exercises INNER JOIN
           workout_junction ON exercises.id = workout_junction.exercise_id INNER JOIN
           saved_workouts ON workout_junction.workout_id = saved_Workouts.id
           WHERE saved_workouts.id = ?`,
              [id],
              (tx, result) => {
                console.log(result.rows._array);
              }
            );
          }
        }
      );
    });
  }

  return (
    <View style={styles.container}>
      {/* <LinearGradient style={styles.background} colors={["#393E46"]} /> */}
      {/* <View style={styles.buttonContainer}> */}
      <MyButton
        onPress={getStartedHandle}
        txtStyle={styles.buttonText}
        style={styles.button}
        text="Get Started"
      />
      <MyButton
        onPress={savedWorkoutsHandler}
        txtStyle={styles.buttonText}
        style={styles.button}
        text="Saved Workouts"
      />

      {/* </View> */}
    </View>
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#222831",
  },
  buttonContainer: {},
  button: {
    backgroundColor: "#00ADB5",
    marginVertical: 16,
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
