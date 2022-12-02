import { View, StyleSheet } from "react-native";
import MyButton from "../components/MyButton";
import { LinearGradient } from "expo-linear-gradient";

function HomeScreen({ route, navigation }) {
  function getStartedHandle() {
    navigation.navigate("input");
  }

  return (
    <View style={styles.container}>
      {/* <LinearGradient style={styles.background} colors={["#393E46"]} /> */}
      {/* <View style={styles.buttonContainer}> */}
      <MyButton
        onPress={getStartedHandle}
        txtStyle={styles.buttonText}
        style={styles.button}
        text="Get Started"
      />
      {/* </View> */}
    </View>
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#222831",
  },
  buttonContainer: {},
  button: {
    backgroundColor: "#00ADB5",
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
