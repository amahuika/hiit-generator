import { View, Text, StyleSheet } from "react-native";
import CenteredView from "../CenteredView";

function DisplayExercise({ title, length, description }) {
  return (
    <View
      style={
        title === "Break" ? styles.breakContainer : styles.exerciseContainer
      }
    >
      <CenteredView>
        <Text
          style={title === "Break" ? styles.breakText : styles.exerciseText}
        >
          {title}
        </Text>
      </CenteredView>
      <CenteredView>
        <Text
          style={
            title === "Break" ? { color: "#EEEEEE" } : { color: "#393E46" }
          }
        >
          {length} sec
        </Text>
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
    color: "#222831",
  },
  descriptionText: {
    fontSize: 18,
    paddingTop: 16,
  },
  breakContainer: {
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 16,

    marginBottom: 8,

    elevation: 4,
    backgroundColor: "#00ADB5",
  },
  breakText: {
    fontSize: 24,

    color: "#EEEEEE",
  },
});
