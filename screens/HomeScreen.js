import { View, StyleSheet } from "react-native";
import MyButton from "../components/MyButton";

function HomeScreen({ route, navigation }) {
  function getStartedHandle() {
    navigation.navigate("input");
  }

  return (
    <View style={styles.container}>
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
  },
  buttonContainer: {},
  button: {
    backgroundColor: "#f76e6e",
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
});
