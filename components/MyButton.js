import { StyleSheet, Text, Pressable } from "react-native";

function MyButton({ onPress, txtStyle, style, rippleColor, text }) {
  return (
    <Pressable
      android_ripple={{ color: "#fefefe" }}
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, txtStyle]}>{text}</Text>
    </Pressable>
  );
}
export default MyButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,

    paddingVertical: 12,
    width: "100%",
    elevation: 4,
    backgroundColor: "#fefefe",
  },
  buttonText: {
    textAlign: "center",
  },
});
