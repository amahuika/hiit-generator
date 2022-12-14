import { View, StyleSheet, Text } from "react-native";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";

function CustomInputScreen(props) {
  return (
    <View style={styles.container}>
      <Card>
        <Text>List of exercises</Text>
        <Text>Name</Text>
        <Text>Number of time performing exercise</Text>
        <Text>Exercise length</Text>
        <Text>Rest length</Text>
        <Text>Break Length</Text>
        <Text>Total time</Text>
      </Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Card>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text>Add Exercise</Text>
          </View>
        </Card>
        <Card>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text>Add Break</Text>
          </View>
        </Card>
      </View>
    </View>
  );
}
export default CustomInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#222831",
  },
});
