import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import GenerateScreen from "./screens/GenerateScreen";
import HomeScreen from "./screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import WorkoutScreen from "./screens/WorkoutScreen";
import InputWorkoutScreen from "./screens/InputWorkoutScreen";
import MyWorkoutsScreen from "./screens/MyWorkoutsScreen";
import DisplaySavedWorkoutScreen from "./screens/DisplaySavedWorkoutScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: "center",
            headerTintColor: "#EEEEEE",
            headerStyle: { backgroundColor: "#393E46" },
            headerShadowVisible: false,
            headerTitleStyle: {
              color: "#00ADB5",
              fontSize: 24,
            },
          }}
        >
          <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{ title: "Workout Generator" }}
          />
          <Stack.Screen
            name="myWorkouts"
            component={MyWorkoutsScreen}
            options={{ title: "My Workouts" }}
          />
          <Stack.Screen
            name="displaySavedWorkout"
            component={DisplaySavedWorkoutScreen}
          />
          <Stack.Screen
            name="input"
            component={InputWorkoutScreen}
            options={{ title: "Customize My Workout" }}
          />
          <Stack.Screen
            name="generator"
            component={GenerateScreen}
            options={{ title: "My Workout" }}
          />
          <Stack.Screen
            name="workout"
            component={WorkoutScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
