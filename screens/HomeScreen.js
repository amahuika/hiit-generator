import { View, StyleSheet, ScrollView, Text } from "react-native";
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

  // seed database functions
  function seedRounds() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM rounds",
        [],
        (txt, results) => {
          console.log(results.rows.length);
          if (results.rows.length === 0) {
            tx.executeSql("INSERT INTO rounds (name) VALUES (?),(?),(?),(?) ", [
              "Round 1",
              "Round 2",
              "Round 3",
              "Round 4",
            ]);
          }
        },
        (txt, error) => {
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
              tx.executeSql(
                "INSERT INTO exercises (name, type, description) VALUES (?,?,?)",
                [exercise.name, exercise.type, exercise.description]
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
    // Create Tables
    createTable();

    // seeding data
    seedRounds();
    seedExercises();
  }, []);

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
