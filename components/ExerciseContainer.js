import { StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const Exercises = ({ title, description }) => {
  const [showDescription, setShowDescription] = useState(false);

  function showDescriptionHandle() {
    showDescription ? setShowDescription(false) : setShowDescription(true);
  }
  return (
    <View style={styles.showExerciseList}>
      <View style={showDescription && styles.exerciseTextContainer}>
        <Text style={styles.myTextExercise}>{title}</Text>
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
          <Text style={styles.myText}>{description}</Text>
        </View>
      )}
    </View>
  );
};

function ExerciseContainer({ workoutList }) {
  let round1 = workoutList.filter((item) => item.round === 1);
  let round2 = workoutList.filter((item) => item.round === 2);
  let round3 = workoutList.filter((item) => item.round === 3);
  let round4 = workoutList.filter((item) => item.round === 4);

  const round1results = round1.map((item) => (
    <Exercises key={item.id} title={item.name} description={item.description} />
  ));
  const round2results = round2.map((item) => (
    <Exercises key={item.id} title={item.name} description={item.description} />
  ));
  const round3results = round3.map((item) => (
    <Exercises key={item.id} title={item.name} description={item.description} />
  ));
  const round4results = round4.map((item) => (
    <Exercises key={item.id} title={item.name} description={item.description} />
  ));
  return (
    <View>
      {round1results.length > 0 && (
        <>
          <View style={styles.roundContainer}>
            <Text style={styles.roundText}>Round 1</Text>
          </View>
          {round1results}
        </>
      )}
      {round2results.length > 0 && (
        <>
          <View style={styles.roundContainer}>
            <Text style={styles.roundText}>Round 2</Text>
          </View>
          {round2results}
        </>
      )}
      {round3results.length > 0 && (
        <>
          <View style={styles.roundContainer}>
            <Text style={styles.roundText}>Round 3</Text>
          </View>
          {round3results}
        </>
      )}
      {round4results.length > 0 && (
        <>
          <View style={styles.roundContainer}>
            <Text style={styles.roundText}>Round 4</Text>
          </View>
          {round4results}
        </>
      )}
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
    marginRight: 8,
  },
  myTextLength: {
    // color: "#EEEEEE",
    color: "#393E46",
  },
  roundText: {
    color: "#EEEEEE",
    // color: "#393E46",
    fontSize: 26,
    // fontWeight: "bold",
    textAlign: "center",
  },
});
