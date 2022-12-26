import { Text, View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Card from "../components/Card";

function PreviewScreen({ route, navigation }) {
  const workoutOrder = route.params.workoutList;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {workoutOrder.map((item, index) => {
          return (
            <Card
              key={index}
              style={item.name === "Break" && styles.breakContainer}
            >
              <Text style={item.name === "Break" && styles.breakText}>
                {item.name}
              </Text>
              <Text style={item.name === "Break" && styles.breakText}>
                {item.length} sec
              </Text>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#222831",
  },
  breakContainer: {
    backgroundColor: "#00ADB5",
  },
  breakText: {
    color: "#EEEEEE",
  },
});
