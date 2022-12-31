import { StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Card from "./Card";

const Exercises = ({ exercise, onRefresh, index, fromSaved }) => {
  const [showDescription, setShowDescription] = useState(false);

  function showDescriptionHandle() {
    showDescription ? setShowDescription(false) : setShowDescription(true);
  }

  function onRefreshHandle(exercise, index) {
    onRefresh(exercise, index);
  }
  return (
    <Card>
      <View style={showDescription && styles.exerciseTextContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.myTextExercise}>{exercise.name}</Text>
          {!fromSaved && (
            <Pressable
              style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
              onPress={() => onRefreshHandle(exercise, index)}
            >
              <Ionicons name="refresh" size={24} color="black" />
            </Pressable>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={styles.myTextLength}>
            {exercise.length} sec x{exercise.sets}
          </Text>

          <Pressable
            onPress={showDescriptionHandle}
            style={{ alignItems: "flex-end", justifyContent: "flex-end" }}
          >
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
          <Text>{exercise.description}</Text>
        </View>
      )}
    </Card>
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
              <Text style={styles.roundLength}>{item.length} sec</Text>
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
  roundContainer: {
    backgroundColor: "#00ADB5",
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    elevation: 4,
  },

  myText: {
    // color: "#EEEEEE",
    fontSize: 16,
  },
  exerciseTextContainer: {
    marginBottom: 12,
  },
  myTextExercise: {
    fontSize: 16,
    // color: "#EEEEEE",

    marginRight: 14,
  },
  roundLength: {
    color: "#EEEEEE",
    // color: "#393E46",
  },
  roundText: {
    color: "#EEEEEE",

    fontSize: 16,
  },
});
