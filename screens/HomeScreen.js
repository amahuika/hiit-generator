import { View, StyleSheet, ScrollView, Text, Button } from "react-native";
import MyButton from "../components/MyButton";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import { useEffect, useState } from "react";
import { createTable, dropTables } from "../HelperFunctions/DatabaseFunctions";

import { updatedExercises } from "../assets/exerciseData/ExerciseData";

// Upper Body = 1
// Lower Body = 2
// Core = 3
// Full Body = 4

const categorySeed = ["Upper Body", "Lower Body", "Core", "Full Body"];

const db = DatabaseConnection.getConnection();

function HomeScreen({ route, navigation }) {
  // get started handler
  function getStartedHandle() {
    navigation.navigate("selection");
  }

  function seedCategory() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM category",
        [],
        (tx, result) => {
          console.log(result.rows._array);
          if (result.rows.length === 0) {
            for (const category of categorySeed) {
              tx.executeSql("INSERT INTO category (name) VALUES (?)", [
                category,
              ]);
            }
          }
        },
        (tx, error) => {
          console.log(error.message);
        }
      );
    });
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
              let categoryId;
              if (exercise.type === null) categoryId = null;
              if (exercise.type === "Upper Body") categoryId = 1;
              if (exercise.type === "Lower Body") categoryId = 2;
              if (exercise.type === "Core") categoryId = 3;
              if (exercise.type === "Full Body") categoryId = 4;

              tx.executeSql(
                "INSERT INTO exercises (name, category_id, description) VALUES (?,?,?)",
                [exercise.name, categoryId, exercise.description]
              );
            }
          }
        },
        (tx, error) => {
          console.log(error.message);
        }
      );
    });
  }

  useEffect(() => {
    // dropTables();
    // Create Tables

    createTable();

    // seeding data

    seedCategory();
    seedExercises();
  }, []);

  function savedWorkoutsHandler() {
    navigation.navigate("myWorkouts");
  }

  function exercisesHandler() {}

  return (
    <View style={styles.container}>
      {/* <LinearGradient style={styles.background} colors={["#393E46"]} /> */}
      {/* <View style={styles.buttonContainer}> */}
      <MyButton
        onPress={getStartedHandle}
        txtStyle={styles.buttonText}
        style={styles.button}
        text="Generate a workout"
      />
      <MyButton
        onPress={savedWorkoutsHandler}
        txtStyle={styles.buttonText}
        style={styles.button}
        text="Saved Workouts"
      />
      <MyButton
        onPress={exercisesHandler}
        txtStyle={styles.buttonText}
        style={styles.button}
        text="Exercises"
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
