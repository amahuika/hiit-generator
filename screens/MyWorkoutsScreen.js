import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { DatabaseConnection } from "../assets/database/DatabaseConnection";

const db = DatabaseConnection.getConnection();

function MyWorkoutsScreen({ route, navigation }) {
  const [myWorkoutList, setMyWorkoutList] = useState([]);

  useEffect(() => {
    getSavedWorkouts();
  }, []);

  function getSavedWorkouts() {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM saved_workouts", [], (tx, results) => {
        if (results.rows.length !== myWorkoutList.length) {
          setMyWorkoutList((val) => [...results.rows._array]);
        }
      });
    });
  }

  function onDeleteWorkout(workoutId) {
    Alert.alert("Are you sure?", "This workout will be permanently deleted", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          db.transaction((tx) => {
            tx.executeSql("DELETE FROM workout_junction WHERE workout_id = ?", [
              workoutId,
            ]);
            tx.executeSql("DELETE FROM saved_workouts WHERE id = ?", [
              workoutId,
            ]);
          });
          getSavedWorkouts();
        },
      },
    ]);
  }

  function onViewWorkout(workout) {
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `SELECT exercises.description, exercises.type, exercises.name, workout_junction.round
    //        FROM exercises INNER JOIN
    //        workout_junction ON exercises.id = workout_junction.exercise_id INNER JOIN
    //        saved_workouts ON workout_junction.workout_id = saved_Workouts.id
    //        WHERE saved_workouts.id = ?`,
    //     [id],
    //     (tx, result) => {
    //       console.log(result.rows._array);
    //     }
    //   );
    // });

    navigation.navigate("displaySavedWorkout", { workout: workout });
  }

  return (
    <View style={styles.container}>
      {myWorkoutList.map((item) => {
        return (
          <View>
            <Pressable
              onPress={() => {
                onViewWorkout(item);
              }}
              android_ripple={{ color: "#fefefe" }}
              style={styles.workoutButton}
            >
              <View>
                <Text style={styles.workoutTitle}>{item.name}</Text>
                <Text style={styles.totalTime}>Length: {item.length} mins</Text>
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => onDeleteWorkout(item.id)}
              >
                <Ionicons name="trash-outline" size={30} color="#fe7a7a" />
              </Pressable>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
export default MyWorkoutsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    padding: 8,
  },
  workoutTitle: {
    color: "#EEEEEE",
    fontSize: 20,
  },
  totalTime: {
    color: "#EEEEEE",
  },
  workoutButton: {
    marginVertical: 8,
    borderColor: "#EEEEEE",
    borderBottomWidth: 0.5,
    padding: 8,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});
