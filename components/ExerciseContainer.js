import { StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const Exercises = ({ exercise, onRefresh, index, fromSaved }) => {
  const [showDescription, setShowDescription] = useState(false);

  function showDescriptionHandle() {
    showDescription ? setShowDescription(false) : setShowDescription(true);
  }

  function onRefreshHandle(exercise, index) {
    onRefresh(exercise, index);
  }
  return (
    <View style={styles.showExerciseList}>
      <View style={showDescription && styles.exerciseTextContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.myTextExercise}>{exercise.name}</Text>
          {!fromSaved && (
            <Pressable
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={() => onRefreshHandle(exercise, index)}
            >
              <Ionicons name="refresh" size={24} color="black" />
            </Pressable>
          )}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.myTextLength}>20sec x3</Text>

          <Pressable onPress={showDescriptionHandle}>
            <Ionicons
              name={!showDescription ? "chevron-down" : "chevron-up"}
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      </View>
      {showDescription && (
        <View>
          <Text style={styles.myText}>Description</Text>
          <Text style={styles.myText}>{exercise.description}</Text>
        </View>
      )}
    </View>
  );
};

function ExerciseContainer({ workoutList, onRefresh, fromSaved }) {
  return (
    <View>
      {workoutList.map((item, index) => {
        if (item.name === "Break") {
          return (
            <View key={item.id} style={styles.roundContainer}>
              <Text style={styles.roundText}>{item.name}</Text>
              <Text style={styles.roundText}>{item.length}sec</Text>
            </View>
          );
        } else {
          return (
            <Exercises
              key={item.id}
              onRefresh={onRefresh}
              exercise={item}
              index={index}
              fromSaved={fromSaved}
            />
          );
        }
      })}
    </View>
  );
}
export default ExerciseContainer;

const styles = StyleSheet.create({
  showExerciseList: {
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    elevation: 4,
  },
  roundContainer: {
    backgroundColor: "#00ADB5",
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    elevation: 4,
  },

  myText: {
    // color: "#EEEEEE",
    color: "#393E46",
  },
  exerciseTextContainer: {
    marginBottom: 12,
  },
  myTextExercise: {
    fontSize: 20,
    // color: "#EEEEEE",
    color: "#393E46",
    marginRight: 14,
  },
  myTextLength: {
    // color: "#EEEEEE",
    color: "#393E46",
  },
  roundText: {
    color: "#EEEEEE",
    // color: "#393E46",
    fontSize: 20,
    // fontWeight: "bold",
  },
});
