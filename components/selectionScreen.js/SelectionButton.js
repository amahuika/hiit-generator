import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SelectionButton({ title, subtitle, onPress, icon }) {
  return (
    <View>
      <Pressable
        onPress={() => onPress()}
        android_ripple={{ color: "#fefefe" }}
        style={styles.button}
      >
        <View style={styles.icon}>
          <Ionicons name={icon} size={36} color="#EEEEEE" />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Pressable>
    </View>
  );
}
export default SelectionButton;

const styles = StyleSheet.create({
  title: {
    color: "#EEEEEE",
    fontSize: 20,
  },
  subtitle: {
    color: "#b8b2b2",
  },
  button: {
    marginVertical: 8,
    borderColor: "#EEEEEE",
    borderBottomWidth: 0.5,
    padding: 8,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  icon: {
    marginEnd: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
