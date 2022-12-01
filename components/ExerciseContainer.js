import { StyleSheet, View, Text } from "react-native";

function ExerciseContainer({ title, description, round }) {
  return (
    <View style={styles.exerciseContainer}>
      <Text>Round {round}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
}
export default ExerciseContainer;

const styles = StyleSheet.create({
  exerciseContainer: {
    borderColor: "black",
    borderWidth: 0.5,
    marginVertical: 4,
    borderRadius: 4,
    padding: 4,
    elevation: 4,
    backgroundColor: "#fefefe",
  },
  title: {
    textAlign: "center",
  },
});
