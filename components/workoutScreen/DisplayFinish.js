import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../MyButton";

function DisplayFinish({ totalTime, exercises }) {
  const navigation = useNavigation();
  function backHandler() {
    navigation.navigate("home");
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.congratulationText}>Congratulations!</Text>
        <Text style={styles.mainText}>Total time: {totalTime}</Text>
        {/* <Text style={styles.mainText}>Total Exercises: {}</Text> */}
        <Text style={styles.amazingText}>You are amazing!</Text>
      </View>
      <View>
        <MyButton
          style={styles.button}
          text="Save Workout"
          txtStyle={styles.buttonText}
          onPress={backHandler}
        />
        <MyButton
          style={styles.button}
          text="Home"
          txtStyle={styles.buttonText}
          onPress={backHandler}
        />
      </View>
    </View>
  );
}
export default DisplayFinish;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  innerContainer: {
    height: "60%",
    backgroundColor: "#EEEEEE",
    padding: 8,
    borderRadius: 8,
    elevation: 4,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  congratulationText: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00ADB5",
  },
  mainText: {
    fontSize: 18,
  },
  amazingText: {
    fontSize: 26,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#393E46",
    borderRadius: 50,
    marginBottom: 8,
  },
  buttonText: {
    color: "#00ADB5",
    fontSize: 24,
  },
});
