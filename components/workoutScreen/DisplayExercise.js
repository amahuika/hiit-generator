import { View, Text, StyleSheet } from "react-native";
import CenteredView from "../CenteredView";

function DisplayExercise({ title, length, description }) {
  return (
    <View style={styles.exerciseContainer}>
      <CenteredView>
        <Text style={styles.exerciseText}>{title}</Text>
      </CenteredView>
      <CenteredView>
        <Text>{length} sec</Text>
      </CenteredView>
      {description !== undefined && (
        <>
          <Text style={styles.exerciseText}>Description</Text>
          <View>
            <Text>{description}</Text>
          </View>
        </>
      )}
    </View>
  );
}
export default DisplayExercise;

const styles = StyleSheet.create({
  timerText: {
    fontSize: 28,
    fontWeight: "bold",
  },

  exerciseContainer: {
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 16,
    marginVertical: 14,
  },

  exerciseText: {
    fontSize: 24,
  },
});
