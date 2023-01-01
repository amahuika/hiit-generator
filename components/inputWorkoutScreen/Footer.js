import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Footer({ onSave, onStart, onPreview, onToggle, workoutDetails }) {
  return (
    <View style={styles.footer}>
      <Pressable onPress={onSave}>
        <Ionicons name="save-outline" size={30} color="#EEEEEE" />
      </Pressable>
      {workoutDetails === null && (
        <Pressable onPress={onStart}>
          <Ionicons name="play" size={32} color="#00ADB5" />
        </Pressable>
      )}
      <Pressable onPress={onPreview}>
        <Ionicons name="list" size={32} color="#EEEEEE" />
      </Pressable>

      <Pressable onPress={onToggle}>
        <Ionicons name="add" size={32} color="#EEEEEE" />
      </Pressable>
    </View>
  );
}
export default Footer;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#393E46",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
