import { View, Text, StyleSheet } from "react-native";
import CenteredView from "../CenteredView";

function CountdownDisplay({ count, title, description }) {
  return (
    <CenteredView style={styles.countdown}>
      <Text style={styles.timerTextTitle}>{title}</Text>

      <View style={styles.timer}>
        <Text style={styles.timerText}>
          {count.toString().padStart(2, "0")}
        </Text>
      </View>
      <View>
        <Text>{description}</Text>
      </View>
    </CenteredView>
  );
}
export default CountdownDisplay;

const styles = StyleSheet.create({
  timerText: {
    fontSize: 56,
    color: "#00ADB5",
    fontWeight: "bold",
  },
  timerTextTitle: {
    fontSize: 36,
  },
  countdown: {
    borderRadius: 8,
    padding: 8,
    paddingTop: 16,
    backgroundColor: "#EEEEEE",
    elevation: 4,
    marginHorizontal: 16,
    marginBottom: 8,
    borderColor: "#00ADB5",
    borderWidth: 2,
    marginTop: 16,
    minHeight: "50%",
  },
  timer: {
    marginVertical: 24,
  },
});
