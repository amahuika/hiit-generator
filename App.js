import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import GenerateScreen from "./screens/GenerateScreen";
import HomeScreen from "./screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import WorkoutScreen from "./screens/WorkoutScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
          <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{ title: "Workout Generator" }}
          />
          <Stack.Screen
            name="generator"
            component={GenerateScreen}
            options={{ title: "Customize My Workout" }}
          />
          <Stack.Screen name="workout" component={WorkoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
