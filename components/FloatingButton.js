import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function FloatingButton({ onPress, Ionicon }) {
  return (
    <Pressable
      android_ripple={{ color: "#EEEEEE", foreground: true }}
      style={styles.button}
      onPress={() => onPress()}
    >
      <Ionicons name={Ionicon} size={36} color="#EEEEEE" />
    </Pressable>
  );
}
export default FloatingButton;

const styles = StyleSheet.create({
  button: {
    overflow: "hidden",
    width: 60,
    height: 60,
    borderRadius: 100,
    position: "absolute",
    bottom: 30,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00ADB5",
  },
});
