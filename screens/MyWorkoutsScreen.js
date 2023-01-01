import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import { useFocusEffect } from "@react-navigation/native";

const db = DatabaseConnection.getConnection();

function MyWorkoutsScreen({ route, navigation }) {
  const [myWorkoutList, setMyWorkoutList] = useState([]);

  // useEffect(() => {
  //   getSavedWorkouts();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getSavedWorkouts();
    }, [])
  );

  function getSavedWorkouts() {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM saved_workouts", [], (tx, results) => {
        if (results.rows.length > 0) {
          setMyWorkoutList((val) => [...results.rows._array]);
          // console.log(results.rows._array);
        }
      });
    });
  }

  function onDeleteWorkout(workoutId) {
    console.log(workoutId);
    Alert.alert("Delete workout", "This workout will be permanently deleted.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          db.transaction((tx) => {
            tx.executeSql(
              "DELETE FROM workout_junction WHERE workout_id = ?",
              [workoutId],
              (tx, results) => {},
              (tx, error) => {
                console.log(error.message);
              }
            );
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
    console.log(workout);
    // navigation.navigate("displaySavedWorkout", { workout: workout });
    navigation.navigate("displaySavedWorkout", { workout: workout });
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {myWorkoutList.map((item) => {
          return (
            <View key={item.id}>
              <Pressable
                onPress={() => {
                  onViewWorkout(item);
                }}
                android_ripple={{ color: "#fefefe" }}
                style={styles.workoutButton}
              >
                <View>
                  <Text style={styles.workoutTitle}>{item.name}</Text>
                  <Text style={styles.totalTime}>
                    Length: {item.total_time} mins
                  </Text>
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
      </ScrollView>
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
