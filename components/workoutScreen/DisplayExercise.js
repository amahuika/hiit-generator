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
          {/* <CenteredView>
            <Text style={styles.descriptionText}>Description</Text>
          </CenteredView>
          <View>
            <Text>{description}</Text>
          </View> */}
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
    borderRadius: 8,
    padding: 16,

    marginBottom: 8,
    backgroundColor: "#EEEEEE",
    elevation: 4,
  },
  exerciseText: {
    fontSize: 24,
  },
  descriptionText: {
    fontSize: 18,
    paddingTop: 16,
  },
});
