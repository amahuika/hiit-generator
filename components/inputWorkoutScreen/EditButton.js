import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function EditButton({ onPress }) {
  return (
    <Pressable
      android_ripple={{ color: "#EEEEEE", foreground: true }}
      style={styles.editButton}
      onPress={() => onPress()}
    >
      <Ionicons name="create-outline" size={28} color="white" />
    </Pressable>
  );
}
export default EditButton;

const styles = StyleSheet.create({
  editButton: {
    position: "absolute",
    bottom: 90,
    right: 8,
    backgroundColor: "#00ADB5",
    borderRadius: 100,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    overflow: "hidden",
    height: 50,
    width: 50,
  },
});
